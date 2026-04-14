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
import {
  DestinationsCount,
  ParticipantsRange,
  QuickFilter,
  TripsQueryDto,
} from './dto/query.dto';

@Injectable()
export class TripsService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

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
    }

    const {
      data: { publicUrl },
    } = this.supabaseClient.storage
      .from('trips-attachements')
      .getPublicUrl(path);

    return publicUrl;
  }

  /// @Return: all trips
  async getTrips(userId: string, query: TripsQueryDto): Promise<Trip[]> {
    const {
      search,
      tripType,
      quickFilter,
      difficulty,
      participants,
      placeType,
      minSpots,
      month,
      destinationsCount,
      priceMin,
      priceMax,
      offset = 0,
      limit = 20,
    } = query;

    let tripsQuery = this.supabaseClient.from('trips').select('*');

    if (search) {
      tripsQuery = tripsQuery.textSearch('title', search);
    }

    if (tripType) {
      tripsQuery = tripsQuery.eq('category', tripType);
    }

    if (difficulty) {
      tripsQuery = tripsQuery.eq('difficulty', difficulty);
    }

    if (minSpots !== undefined) {
      tripsQuery = tripsQuery.gte('min_participants', minSpots);
    }

    if (priceMin !== undefined) {
      tripsQuery = tripsQuery.gte('price', priceMin);
    }

    if (priceMax !== undefined) {
      tripsQuery = tripsQuery.lte('price', priceMax);
    }

    if (month) {
      // tripsQuery.eq(`EXTRACT(MONTH FROM "start_date")::int`, month);
    }

    const idSets: string[][] = [];

    if (placeType) {
      const { error, data } = await this.supabaseClient.rpc(
        'filter_trips_by_place_type',
        { p_place_type: placeType },
      );

      if (error || !data) {
        console.error(`Failed filter with place type: ${error}`);
        throw new BadRequestException('Failed to filter by place type');
      }

      idSets.push(data.map((r) => r.trip_id));
    }

    if (quickFilter === QuickFilter.BOOKMARKS) {
      const { error, data } = await this.supabaseClient.rpc(
        'filter_trips_by_bookmark',
        { p_user_id: userId },
      );

      if (error || !data) {
        console.error(`Failed to filter by bookmark: ${error}`);
        throw new BadRequestException('Failed to filter by bookmark');
      }

      idSets.push(data.map((r) => r.trip_id));
    }

    if (quickFilter && quickFilter !== QuickFilter.BOOKMARKS) {
      const { error, data } = await this.supabaseClient.rpc(
        'filter_trips_by_creator_type',
        { p_creator_type: quickFilter },
      );

      if (error || !data) {
        console.error(`Failed to filter by user role: ${error}`);
        throw new BadRequestException('Failed to filter by user role');
      }

      idSets.push(data.map((r) => r.trip_id));
    }

    if (participants) {
      const [min, max] = {
        [ParticipantsRange.ZERO_TO_FIVE]: [0, 5],
        [ParticipantsRange.FIVE_TO_FIFTEEN]: [5, 15],
        [ParticipantsRange.FIFTEEN_TO_FIFTY]: [15, 50],
        [ParticipantsRange.FIFTY_PLUS]: [50, null],
      }[participants];

      const { error, data } = await this.supabaseClient.rpc(
        'filter_trips_by_participants_range',
        { p_min: min, p_max: max },
      );

      if (error || !data) {
        console.error(`Failed to filter by participants range: ${error}`);
        throw new BadRequestException('Failed to filter by participants range');
      }

      idSets.push(data.map((r) => r.trip_id));
    }

    if (destinationsCount) {
      const [min, max] = {
        [DestinationsCount.ONE]: [1, 1],
        [DestinationsCount.TWO_PLUS]: [2, null],
        [DestinationsCount.THREE_PLUS]: [3, null],
        [DestinationsCount.FIVE_PLUS]: [5, null],
      }[destinationsCount];

      const { data, error } = await this.supabaseClient.rpc(
        'filter_trips_by_destinations_count',
        { p_min: min, p_max: max },
      );

      if (error)
        throw new InternalServerErrorException(
          'Failed to filter by destinations count',
        );

      idSets.push(data.map((r: { trip: string }) => r.trip));
    }

    if (idSets.length > 0) {
      const intersected = idSets.reduce((a, b) =>
        a.filter((id) => b.includes(id)),
      );

      if (intersected.length === 0) return [];

      tripsQuery = tripsQuery.in('id', intersected);
    }

    const { data: trips, error: fetchTripsError } = await tripsQuery.range(
      offset,
      offset + limit,
    );

    if (fetchTripsError || !trips) {
      throw new NotFoundException('Failed to fetch trips');
    }

    return trips;
  }

  /// @Return: the trip with the given id
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
      .eq('id', tripId);

    if (fetchStopsError || !stops) {
      throw new InternalServerErrorException('Failed to fetch trip stops');
    }

    return { ...trip, stops };
  }

  /// @Return: the created trip
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
    if (attachment && Array.isArray(images)) {
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
      console.error(`Failed to create trip: ${error}`);
      throw new BadRequestException('Failed to create trip');
    }

    const results = await Promise.all(
      stops.map((stop) =>
        this.supabaseClient
          .from('trip_stops')
          .insert({ ...stop, trip: trip.id })
          .select('*')
          .single(),
      ),
    );

    if (results.some((result) => result.error || !result.data)) {
      console.error(
        `Failed to create trip stops: ${results.map((r) => r.error)}`,
      );
      throw new BadRequestException('Failed to create trip stops'); // TODO: fault tolerance
    }

    return { ...createdTrip, stops: results.map((result) => result.data) };
  }

  // TODO: get back file uploads bro
  /// @Return: the updated trip and only updated stops
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

    // 1) Create new stops
    let updatedStops: TripStop[] = [];
    if (stopsToCreate && stopsToCreate.length > 0) {
      const results = await Promise.all(
        stopsToCreate.map((stop) =>
          this.supabaseClient
            .from('trip_stops')
            .insert({ ...stop, trip: tripId })
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
        .from('trips')
        .update(trip)
        .eq('id', tripId)
        .select('*')
        .single();

      if (updateError || !updatedTrip) {
        throw new BadRequestException('Failed to update trip');
      }

      updatedTrip = data;
    }

    return { ...updatedTrip, stops: updatedStops };
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
