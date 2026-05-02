import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { TripCreateDTO } from './dto/create.dto';
import { TripUpdateDTO } from './dto/update.dto';
import { Trip, TripAffiliation } from './entities/trips.entity';
import {
  paginatedResponse,
  PaginatedResponseDto,
} from 'src/common/dto/paginated-response.dto';
import { applySupabaseQuery } from 'src/common/utils/query-builder';
import { QueryDto } from 'src/common/dto/query.dto';
import { TripStopDTO, TripStopType } from './dto/trip-stop.dto';

interface TripStopRow {
  id: string;
  trip_id: string;
  stop_order: number;
  stop_type: TripStopType;
  destination_id: string | null;
  location: unknown;
  label: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type TripWithStops = Trip & { stops: TripStopRow[] };

@Injectable()
export class TripsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

<<<<<<< Updated upstream
  private validateStopOrder(stops: TripStopDTO[]): void {
    if (!stops.length) {
      return;
=======
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
            `Failed to upload image "${file.originalname}": ${error.message}`, // TODO: delete any successfully uploaded files in this batch, or retry
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
        `Failed to upload attachment "${file.originalname}": ${error.message}`, // TODO: delete any successfully uploaded files in this batch, or retry
      );
>>>>>>> Stashed changes
    }

    const orders = stops.map((stop) => stop.stop_order).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i += 1) {
      if (orders[i] !== i) {
        throw new BadRequestException(
          'Stops must have continuous stop_order values starting from 0',
        );
      }
    }
  }

  private mapStopForInsert(tripId: string, stop: TripStopDTO) {
    const [lng, lat] = stop.location.coordinates;

    return {
      trip_id: tripId,
      stop_order: stop.stop_order,
      stop_type: stop.stop_type,
      destination_id:
        stop.stop_type === TripStopType.Destination
          ? (stop.destination_id ?? null)
          : null,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      label: stop.label ?? null,
    };
  }

  private async replaceTripStops(tripId: string, stops: TripStopDTO[]): Promise<void> {
    this.validateStopOrder(stops);

    const { error: deleteError } = await this.supabaseClient
      .from('trip_stops' as any)
      .delete()
      .eq('trip_id', tripId);

    if (deleteError) {
      throw new BadRequestException('Failed to update trip stops');
    }

    if (!stops.length) {
      return;
    }

    const payload = stops.map((stop) => this.mapStopForInsert(tripId, stop));
    const { error: insertError } = await this.supabaseClient
      .from('trip_stops' as any)
      .insert(payload as any);

    if (insertError) {
      throw new BadRequestException('Failed to save trip stops');
    }
  }

  private async getTripStops(tripId: string): Promise<TripStopRow[]> {
    const { data, error } = await this.supabaseClient
      .from('trip_stops' as any)
      .select('*')
      .eq('trip_id', tripId)
      .order('stop_order', { ascending: true });

    if (error) {
      throw new InternalServerErrorException('Failed to fetch trip stops');
    }

    return (data ?? []) as TripStopRow[];
  }

  /// @Return: all trips
<<<<<<< Updated upstream
  async getTrips(query: QueryDto): Promise<PaginatedResponseDto<Trip>> {
    const qb = applySupabaseQuery(this.supabaseClient, 'trips', query, {
      searchFields: ['title', 'description'],
      allowedFilters: ['organizer'],
      allowedSortFields: [
        'title',
        'created_at',
        'start_date',
        'end_date',
        'price',
        'difficulty',
        'status',
        'start_date',
      ],
      defaultSort: 'start_date',
    });
=======
  async getTrips(userId: string | null, query: TripsQueryDto): Promise<Trip[]> {
    let tripsQuery = this.supabaseClient.from('trips').select('*');
>>>>>>> Stashed changes

    const { data, error, count } = await qb;

    if (error || !data || count === null) {
      throw new InternalServerErrorException(
        "Can't fetch trips at the instant",
      );
    }

    return paginatedResponse(data as Trip[], count, query);
  }

  /// @Return: the trip with the given id
  async getTripById(tripId: string): Promise<TripWithStops> {
    const { data: trip, error } = await this.supabaseClient
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (error || !trip) {
      throw new NotFoundException('Trip not found');
    }

<<<<<<< Updated upstream
    const stops = await this.getTripStops(tripId);
    return { ...(trip as Trip), stops };
=======
    const { data: stops, error: fetchStopsError } = await this.supabaseClient
      .from('trip_stops')
      .select('*')
      .eq('trip', tripId)
      .order('index', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });

    if (fetchStopsError || !stops) {
      throw new InternalServerErrorException('Failed to fetch trip stops');
    }

    return { ...trip, stops };
>>>>>>> Stashed changes
  }

  /// @Return: the added trip
  async addTrip(userId: string, trip: TripCreateDTO): Promise<TripWithStops> {
    const { stops, ...tripPayload } = trip;

<<<<<<< Updated upstream
    const { error, data } = await this.supabaseClient
=======
    let images_urls: string[] = [];

    if (images && Array.isArray(images)) {
      images_urls = await this.uploadImages(userId, images);
    }

    let attachment_url: string | null = null;
    if (attachment) {
      attachment_url = await this.uploadAttachment(userId, attachment);
    }

    const { error, data: createdTrip } = await this.supabaseClient
>>>>>>> Stashed changes
      .from('trips')
      .insert({
        ...(tripPayload as any),
        images: [], // TODO: file uploads
        organizer: userId,
      } as any)
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      throw new BadRequestException('Failed to create trip');
    }

<<<<<<< Updated upstream
    try {
      // @ts-expect-error - table types issue
      await this.replaceTripStops(data.id, stops);
    } catch (stopError) {
      // @ts-expect-error - table types issue
      await this.supabaseClient.from('trips').delete().eq('id', data.id);
      throw stopError;
=======
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
      console.error('Failed to create trip stops', {
        errors: results
          .filter((result) => result.error)
          .map((result) => result.error),
        stops,
        createdTripId: createdTrip.id,
      });
      throw new BadRequestException('Failed to create trip stops'); // TODO: fault tolerance
>>>>>>> Stashed changes
    }

    // @ts-expect-error - table types issue
    const savedStops = await this.getTripStops(data.id);
    return { ...(data as Trip), stops: savedStops };
  }

  /// @Return: the updated trip fields
  async updateTrip(
    userId: string,
    id: string,
    trip: TripUpdateDTO,
  ): Promise<TripWithStops> {
    const { data: existing, error: fetchError } = await this.supabaseClient
      .from('trips')
      .select('id, organizer, images, status')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException('Trip not found');
    }

    // @ts-expect-error - table types issue
    if (existing.organizer !== userId) {
      throw new UnauthorizedException();
    }

    const { stops, ...tripPayload } = trip;
    const hasTripFields = Object.keys(tripPayload).length > 0;

<<<<<<< Updated upstream
    if (hasTripFields) {
      const { error: updateError } = await this.supabaseClient
=======
    // 1) Create new stops
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
          `Failed to update trip stop(s): ${results.map((r) => r.error)}`,
        );
        throw new BadRequestException('Failed to update trip stop(s)'); // TODO: fault tolerance
      }

      updatedStops = results.map((result) => result.data);
    }

    // 2) Delete stops
    if (stopIDsToDelete && stopIDsToDelete.length > 0) {
      const results = await Promise.all(
        stopIDsToDelete.map((stopId) =>
          this.supabaseClient.from('trip_stops').delete().eq('id', stopId),
        ),
      );

      if (results.some((result) => result.error)) {
        console.error(
          `Failed to delete trip stop(s): ${results.map((r) => r.error)}`,
        );
        throw new BadRequestException('Failed to update trip stop(s)'); // TODO: fault tolerance
      }
    }

    // 4) Update trip
    let updatedTrip: Trip;
    if (Object.keys(trip).length > 0) {
      const { error: updateError, data } = await this.supabaseClient
>>>>>>> Stashed changes
        .from('trips')
        // @ts-expect-error - table types issue
        .update(tripPayload as any)
        .eq('id', id);

      if (updateError) {
        throw new BadRequestException('Failed to update trip');
      }
    }

    if (stops) {
      await this.replaceTripStops(id, stops);
    }

    return this.getTripById(id);
  }

  /// @Return: the id of the deleted trip
  async deleteTrip(userId: string, id: string): Promise<string> {
    const { data: existing, error: fetchError } = await this.supabaseClient
      .from('trips')
      .select('id, organizer')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException('Trip not found');
    }

    // @ts-ignore
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

  /// @Return: a trip affiliation record
  async joinTrip(userId: string, tripId: string): Promise<TripAffiliation> {
    const { data: affiliations } = await this.supabaseClient
      .from('trip_participants')
      .select('*')
      .eq('trip_id', tripId);

    if (affiliations) {
      // @ts-expect-error - table types issue
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
        // @ts-expect-error - table types issue
        trip.max_participants &&
        // @ts-expect-error - table types issue
        trip.max_participants <= affiliations.length
      ) {
        throw new BadRequestException('Trip is full');
      }
    }

    const { error, data } = await this.supabaseClient
      .from('trip_participants')
      // @ts-ignore
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

    return data;
  }

  /// @Return: affiliation record id
  async leaveTrip(userId: string, affiliationId: string): Promise<string> {
    const { error: fetchError, data: affiliation } = await this.supabaseClient
      .from('trip_participants')
      .select('*')
      .eq('id', affiliationId)
      .single();

    if (fetchError || !affiliation) {
      throw new BadRequestException('Affiliation to the trip not found');
    }

    // @ts-expect-error - table types issue
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
