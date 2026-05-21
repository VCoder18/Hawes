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
  TripWithStops,
} from './entities/trips.entity';
import { randomUUID } from 'crypto';
import { TripsQueryDto, TripsQueryFilter } from './dto/query.dto';

@Injectable()
export class TripsService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

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

  async getTrips(userId: string | null, query: TripsQueryDto): Promise<Trip[]> {
    let tripsQuery = this.supabaseClient.from('trips').select('*');

    const { data: trips, error: fetchTripsError } = await new TripsQueryFilter(
      query,
      this.supabaseClient,
    ).apply(tripsQuery, userId);

    if (fetchTripsError || !trips) {
      throw new NotFoundException('Failed to fetch trips');
    }

    return trips as Trip[];
  }

  async getTripById(tripId: string): Promise<TripWithStops> {
    const { data: trip, error: fetchTripError } = await this.supabaseClient
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (fetchTripError || !trip) {
      throw new NotFoundException('Trip not found');
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

    return { ...(trip as Trip), stops: stops as TripStop[] };
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
      stops.map((stop) =>
        this.supabaseClient
          .from('trip_stops')
          .insert({
            ...stop,
            location: this.toGeographyPoint(stop.location),
            trip: createdTrip.id,
          })
          .select('*')
          .single(),
      ),
    );

    if (results.some((result) => result.error || !result.data)) {
      console.error(
        `Failed to create trip stops: ${results.map((r) => r.error?.message)}`,
      );
      throw new BadRequestException('Failed to create trip stops');
    }

    return {
      ...(createdTrip as Trip),
      stops: results.map((result) => result.data as TripStop),
    };
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
        stopsToCreate.map((stop) =>
          this.supabaseClient
            .from('trip_stops')
            .insert({
              ...stop,
              location: this.toGeographyPoint(stop.location),
              trip: tripId,
            })
            .select('*')
            .single(),
        ),
      );

      if (results.some((result) => result.error || !result.data)) {
        console.error(
          `Failed to update trip stop(s): ${results.map((r) => r.error?.message)}`,
        );
        throw new BadRequestException('Failed to update trip stop(s)');
      }

      updatedStops = results.map((result) => result.data as TripStop);
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

    return { ...updatedTrip, stops: updatedStops };
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

  async joinTrip(userId: string, tripId: string): Promise<TripAffiliation> {
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

      const { error, data: trip } = await this.supabaseClient
        .from('trips')
        .select('id, max_participants')
        .eq('id', tripId)
        .single();

      if (error || !trip) {
        throw new BadRequestException('Trip not found');
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
}
