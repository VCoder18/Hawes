import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { TripCreateDTO } from './dto/create.dto';
import { TripUpdateDTO } from './dto/update.dto';
import {
  Trip,
  TripAffiliation,
  TripStop,
  TripStopWithService,
  StopServiceData,
  TripWithStops,
  TripWithMeetingPoint,
  TripVisibility,
} from './entities/trips.entity';
import { randomUUID } from 'crypto';
import { TripsQueryDto, TripsQueryFilter } from './dto/query.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TripsService {
  constructor(
    private readonly supabaseClient: SupabaseClient<Database>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private toGeographyPoint(location: {
    type: string;
    coordinates: [number, number];
  }): string {
    const lng = Number(location.coordinates?.[0]);
    const lat = Number(location.coordinates?.[1]);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new BadRequestException('Stop coordinates are invalid');
    }

    return `SRID=4326;POINT(${lng} ${lat})`;
  }

  async uploadImages(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploads = files.map(
      async (file: Express.Multer.File): Promise<string> => {
        const ext = file.originalname.split('.').pop();
        const path = `${userId}/${randomUUID()}.${ext}`;

        const { error } = await this.supabaseClient.storage
          .from('trips-images')
          .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          console.error(
            `Failed to upload image "${file.originalname}": ${error.message}`,
          );
          throw new InternalServerErrorException(
            `Failed to upload image "${file.originalname}": ${error.message}`,
          );
        }

        const {
          data: { publicUrl },
        } = this.supabaseClient.storage.from('trips-images').getPublicUrl(path);

        return publicUrl;
      },
    );

    return Promise.all(uploads);
  }

  async uploadAttachment(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const path = `${userId}/${randomUUID()}.${ext}`;
    const { error } = await this.supabaseClient.storage
      .from('trips-attachments')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload attachment "${file.originalname}": ${error.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = this.supabaseClient.storage
      .from('trips-attachments')
      .getPublicUrl(path);

    return publicUrl;
  }

    async getTrips(userId: string | null, query: TripsQueryDto): Promise<TripWithMeetingPoint[]> {
        let tripsQuery = this.supabaseClient.from('trips').select('*');

        // Filter trips by visibility: public trips are visible to everyone,
        // private trips are only visible to their organizer
        if (userId) {
            // User is logged in: show public trips OR private trips where they are the organizer
            tripsQuery = tripsQuery.or(`visibility.eq.public,organizer.eq.${userId}`);
        } else {
            // User is not logged in: only show public trips
            tripsQuery = tripsQuery.eq('visibility', 'public');
        }

        const { data: trips, error: fetchTripsError } = await new TripsQueryFilter(
            query,
            this.supabaseClient,
        ).apply(tripsQuery, userId);

        if (fetchTripsError || !trips) {
            throw new NotFoundException('Failed to fetch trips');
        }

        // Attach first meeting stop label to each trip for card display
        const tripIds = trips.map((t) => t.id);
        const { data: meetingStops } = await this.supabaseClient
            .from('trip_stops')
            .select('trip, label')
            .in('trip', tripIds)
            .eq('type', 'meeting')
            .order('index');

        const meetingMap = new Map<string, string | null>();
        if (meetingStops) {
            for (const stop of meetingStops) {
                if (!meetingMap.has(stop.trip)) {
                    meetingMap.set(stop.trip, stop.label ?? null);
                }
            }
        }

        // Fetch participant counts for each trip in parallel
        const countsResults = await Promise.all(
          tripIds.map((tid) =>
            this.supabaseClient
              .from('trip_participants')
              .select('*', { count: 'exact', head: true })
              .eq('trip_id', tid)
          )
        );

        const countsMap = new Map<string, number>();
        countsResults.forEach((r, idx) => {
          const cnt = r?.count ?? 0;
          countsMap.set(String(tripIds[idx]), cnt as number);
        });

        return trips.map((trip) => ({
          ...trip,
          meeting_point: meetingMap.get(trip.id) ?? null,
          current_participants: countsMap.get(String(trip.id)) ?? 0,
        })) as TripWithMeetingPoint[];
    }

    async getTripById(tripId: string, userId: string | null = null, inviteCode?: string): Promise<TripWithStops> {
        const { data: trip, error: fetchTripError } = await this.supabaseClient
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single();

        if (fetchTripError || !trip) {
            throw new NotFoundException('Trip not found');
        }

        // Check access permissions for private trips
        if (trip.visibility === 'private' && trip.organizer !== userId) {
            // User is not the organizer and trip is private
            // Allow access if they have a valid invite code
            if (!inviteCode || inviteCode !== trip.invite_code) {
                throw new NotFoundException('Trip not found');
            }
        }

        // Fetch organizer profile data
        let organizerProfile = null;
        if (trip.organizer) {
            const { data: profile } = await this.supabaseClient
                .from('profiles')
                .select('id, display_name, username, avatar_url, location, role')
                .eq('id', trip.organizer)
                .single();
            
            organizerProfile = profile;
        }

        const { data: stops, error: fetchStopsError } = await this.supabaseClient
            .from('trip_stops')
            .select('*')
            .eq('trip', tripId)
            .order('index', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: true });

        if (fetchStopsError || !stops) {
            throw new InternalServerErrorException('Failed to fetch trip stops');
        }

        const rawStops = stops as TripStop[];

        const serviceIds = rawStops
            .filter((s) => s.type === 'service' && s.service != null)
            .map((s) => s.service as number);

        const serviceMap = new Map<number, StopServiceData>();
        if (serviceIds.length > 0) {
            const uniqueIds = [...new Set(serviceIds)];
            const { data: services, error: servicesError } = await this.supabaseClient
                .from('services')
                .select('id, name, category, procedure, min_cost, max_cost, image, address')
                .in('id', uniqueIds);

            if (!servicesError && services) {
                for (const svc of services as StopServiceData[]) {
                    serviceMap.set(svc.id, svc);
                }
            }
        }

        const stopsWithServices: TripStopWithService[] = rawStops.map((s) => ({
            ...s,
            service_data: s.type === 'service' && s.service != null
                ? serviceMap.get(s.service as number) || null
                : null,
        }));

        const { count: participantCount } = await this.supabaseClient
            .from('trip_participants')
            .select('*', { count: 'exact', head: true })
            .eq('trip_id', tripId);

        return { 
            ...(trip as unknown as Record<string, unknown>),
            organizer_profile: organizerProfile,
            stops: stopsWithServices,
            current_participants: participantCount ?? 0,
        } as TripWithStops;
    }
  async createTrip(
    userId: string,
    tripDTO: TripCreateDTO,
    images: Express.Multer.File[] | undefined,
    attachment: Express.Multer.File | undefined,
  ): Promise<TripWithStops> {
    const { stops, ...trip } = tripDTO;

    let images_urls: string[] = [];
    if (images && Array.isArray(images)) {
      images_urls = await this.uploadImages(userId, images);
    }

    let attachment_url: string | null = null;
    if (attachment) {
      attachment_url = await this.uploadAttachment(userId, attachment);
    }

    const { error, data: createdTrip } = await this.supabaseClient
      .from('trips')
      .insert({
        ...trip,
        images: images_urls,
        attachment_url,
        organizer: userId,
      })
      .select('*')
      .single();

        if (error || !createdTrip) {
      console.error(`Failed to create trip: ${error.message}`);
      throw new BadRequestException('Failed to create trip');
        }

     const results = await Promise.all(
       stops.map((stop) => {
         // Ensure index is provided, defaulting to 0 if not set
         const index = stop.index !== undefined && stop.index !== null ? stop.index : 0;
         
         // Create a clean object with only the properties that exist in the trip_stops table
         const tripStopData = {
           index: index,
           label: stop.label,
           location: this.toGeographyPoint(stop.location),
           service: stop.service, // This would be set separately for service stops
           time: stop.time,
           trip: createdTrip.id,
           type: stop.type,
           // Handle destination for destination-type stops
           ...(stop.type === 'destination' && stop.destination !== undefined && stop.destination !== null
             ? { destination: stop.destination }
             : {}),
         };
         
         return this.supabaseClient
           .from('trip_stops')
           .insert(tripStopData)
           .select('*')
           .single();
       }),
     );

    if (results.some((result) => result.error || !result.data)) {
      console.error(
        `Failed to create trip stops: ${results.map((r) => r.error?.message)}`,
      );
      throw new BadRequestException('Failed to create trip stops');
    }

    return {
      ...(createdTrip as unknown as Record<string, unknown>),
      stops: results.map((result) => result.data as TripStopWithService),
    } as TripWithStops;
  }
  async updateTrip(
    userId: string,
    tripId: string,
    tripDTO: TripUpdateDTO,
  ): Promise<TripWithStops> {
    const { stopIDsToDelete, stopsToCreate, ...trip } = tripDTO;

    if (
      Object.keys(trip).length === 0 &&
      (!stopsToCreate || stopsToCreate.length === 0) &&
      (!stopIDsToDelete || stopIDsToDelete.length === 0)
    ) {
      throw new BadRequestException(
        'You should provide at least a trip property to modify',
      );
    }

    const { data: currentTrip, error: tripFetchError } =
      await this.supabaseClient
        .from('trips')
        .select('id, organizer, images, status')
        .eq('id', tripId)
        .single();

    if (tripFetchError || !currentTrip) {
      throw new NotFoundException('Trip not found');
    }

    if (currentTrip.organizer !== userId) {
      throw new UnauthorizedException();
    }

    if (currentTrip.status !== 'draft') {
      throw new BadRequestException('Only draft trips can be updated');
    }

    let updatedStops: TripStop[] = [];
     if (stopsToCreate && stopsToCreate.length > 0) {
       const results = await Promise.all(
         stopsToCreate.map((stop) => {
           // Ensure index is provided, defaulting to 0 if not set
           const index = stop.index !== undefined && stop.index !== null ? stop.index : 0;
           
           // Create a clean object with only the properties that exist in the trip_stops table
           const tripStopData = {
             index: index,
             label: stop.label,
             location: this.toGeographyPoint(stop.location),
             service: stop.service, // This would be set separately for service stops
             time: stop.time,
             trip: tripId,
             type: stop.type,
             // Handle destination for destination-type stops
             ...(stop.type === 'destination' && stop.destination !== undefined && stop.destination !== null
               ? { destination: stop.destination }
               : {}),
           };
           
           return this.supabaseClient
             .from('trip_stops')
             .insert(tripStopData)
             .select('*')
             .single();
         }),
       );

      if (results.some((result) => result.error || !result.data)) {
        console.error(
          `Failed to update trip stop(s): ${results.map((r) => r.error?.message)}`,
        );
        throw new BadRequestException('Failed to update trip stop(s)');
      }

      updatedStops = results.map((result) => result.data as TripStopWithService);
    }
    if (stopIDsToDelete && stopIDsToDelete.length > 0) {
      const results = await Promise.all(
        stopIDsToDelete.map((stopId) =>
          this.supabaseClient.from('trip_stops').delete().eq('id', stopId),
        ),
      );

      if (results.some((result) => result.error)) {
        console.error(
          `Failed to delete trip stop(s): ${results.map((r) => r.error?.message)}`,
        );
        throw new BadRequestException('Failed to update trip stop(s)');
      }
    }
    let updatedTrip: Trip;
    if (Object.keys(trip).length > 0) {
      const { error: updateError, data } = await this.supabaseClient
        .from('trips')
        .update(trip)
        .eq('id', tripId)
        .select('*')
        .single();

      if (updateError || !data) {
        throw new BadRequestException('Failed to update trip');
      }

      updatedTrip = data as Trip;
    } else {
      const { data } = await this.supabaseClient
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();
      updatedTrip = data as Trip;
    }

    return { ...(updatedTrip as unknown as Record<string, unknown>), stops: updatedStops } as TripWithStops;
  }

  async deleteTrip(userId: string, id: string): Promise<string> {
    const { data: existing, error: fetchError } = await this.supabaseClient
      .from('trips')
      .select('id, organizer')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException('Trip not found');
    }

    if (existing.organizer !== userId) {
      throw new UnauthorizedException();
    }

    const { error } = await this.supabaseClient
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException('Failed to delete trip');
    }

    return id;
  }

    async checkParticipation(userId: string, tripId: string): Promise<TripAffiliation | null> {
        const { data, error } = await this.supabaseClient
            .from('trip_participants')
            .select('*')
            .eq('user_id', userId)
            .eq('trip_id', tripId)
            .maybeSingle();

        if (error) {
            throw new BadRequestException('Failed to check participation');
        }

        return data as TripAffiliation | null;
    }

    async joinTrip(userId: string, tripId: string, inviteCode?: string): Promise<TripAffiliation> {
        // First, get the trip to check if it's private and validate invite code if needed
        const { data: trip, error: tripError } = await this.supabaseClient
            .from('trips')
            .select('id, visibility, invite_code, max_participants')
            .eq('id', tripId)
            .single();

        if (tripError || !trip) {
            throw new BadRequestException('Trip not found');
        }

        // If trip is private, validate invite code
        if (trip.visibility === 'private') {
            if (!inviteCode) {
                throw new BadRequestException('Invite code is required to join this private trip');
            }
            
            if (inviteCode !== trip.invite_code) {
                throw new BadRequestException('Invalid invite code');
            }
        }

        const { data: affiliations } = await this.supabaseClient
            .from('trip_participants')
            .select('*')
            .eq('trip_id', tripId);

        if (affiliations) {
            if (affiliations.some((p) => p.user_id === userId)) {
                throw new BadRequestException(
                    'You are already participating in the trip',
                );
            }

            if (
                trip.max_participants &&
                trip.max_participants <= affiliations.length
            ) {
                throw new BadRequestException('Trip is full');
            }
        }

        const { error, data } = await this.supabaseClient
            .from('trip_participants')
            .insert({
                user_id: userId,
                trip_id: tripId,
            })
            .select('*')
            .single();

        if (error || !data) {
            console.error(error);
            throw new BadRequestException('Failed to join trip');
        }

        return data as TripAffiliation;
    }

    async leaveTripByTripId(userId: string, tripId: string): Promise<string> {
        const { data: affiliation, error: fetchError } = await this.supabaseClient
            .from('trip_participants')
            .select('id')
            .eq('user_id', userId)
            .eq('trip_id', tripId)
            .maybeSingle();

        if (fetchError || !affiliation) {
            throw new BadRequestException('You are not a participant of this trip');
        }

        const { error } = await this.supabaseClient
            .from('trip_participants')
            .delete()
            .eq('id', affiliation.id);

        if (error) {
            console.error(error);
            throw new BadRequestException('Failed to leave the trip.');
        }

        return affiliation.id;
    }

    async leaveTrip(userId: string, affiliationId: string): Promise<string> {
        const { error: fetchError, data: affiliation } = await this.supabaseClient
            .from('trip_participants')
            .select('*')
            .eq('id', affiliationId)
            .single();

        if (fetchError || !affiliation) {
            throw new BadRequestException('Affiliation to the trip not found');
        }

        if (affiliation.user_id !== userId) {
            throw new UnauthorizedException('You are not affiliated to this trip');
        }

        const { error } = await this.supabaseClient
            .from('trip_participants')
            .delete()
            .eq('id', affiliationId);

        if (error) {
            console.error(error);
            throw new BadRequestException('Failed to leave the trip.');
        }

        return affiliationId;
    }

  async sendTripInvite(userId: string, tripId: string, recipientId: string): Promise<{ success: boolean }> {
    // Verify the trip exists and user is the organizer
    const { data: trip, error: tripError } = await this.supabaseClient
      .from('trips')
      .select('organizer, visibility, title, invite_code')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.organizer !== userId) {
      throw new UnauthorizedException('Only the trip organizer can send invites');
    }

    if (trip.visibility !== 'private') {
      throw new BadRequestException('Invites can only be sent for private trips');
    }

    // Get the organizer's profile for the notification
    const { data: organizerProfile } = await this.supabaseClient
      .from('profiles')
      .select('display_name, username')
      .eq('id', userId)
      .single();

    // Get the recipient's profile to verify they exist
    const { data: recipientProfile } = await this.supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', recipientId)
      .single();

    if (!recipientProfile) {
      throw new BadRequestException('Recipient user not found');
    }

    const senderName = organizerProfile?.display_name || organizerProfile?.username || 'Someone';

    // Create notification for the recipient
    await this.notificationsService.createNotification(
      recipientId,
      'trip_invite',
      `Trip Invite: ${trip.title}`,
      `${senderName} invited you to join their trip "${trip.title}"`,
      {
        trip_id: tripId,
        invite_code: trip.invite_code,
        sender_id: userId,
        sender_name: senderName,
      },
    );

    return { success: true };
  }

    async getInviteCode(tripId: string, userId: string): Promise<{ invite_code: string; invite_link: string }> {
        // Verify that the user is the organizer of the trip
        const { data: trip, error: tripError } = await this.supabaseClient
            .from('trips')
            .select('organizer, visibility, invite_code')
            .eq('id', tripId)
            .single();

        if (tripError || !trip) {
            throw new NotFoundException('Trip not found');
        }

        if (trip.organizer !== userId) {
            throw new UnauthorizedException('Only the trip organizer can get the invite code');
        }

        // Generate the invite link (frontend URL)
        const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${trip.invite_code}`;

        return {
            invite_code: trip.invite_code,
            invite_link: inviteLink,
        };
    }
}
