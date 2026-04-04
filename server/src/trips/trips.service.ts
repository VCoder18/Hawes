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
import { Trip } from './entities/trips.entity';
import {
  paginatedResponse,
  PaginatedResponseDto,
} from 'src/common/dto/paginated-response.dto';
import { applySupabaseQuery } from 'src/common/utils/query-builder';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class TripsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  async uploadImages(
    images: Express.Multer.File[],
    userId: string,
  ): Promise<string[]> {
    const urls: string[] = [];

    await Promise.all(
      images.map(async (file) => {
        const path = `trips/${userId}/${Date.now()}-${file.originalname}`;

        const { error } = await this.supabaseClient.storage
          .from('trip-images')
          .upload(path, file.buffer, { contentType: file.mimetype });

        // TODO: delete already uploaded files if any upload fails
        if (error) throw new InternalServerErrorException(error.message);

        const { data } = this.supabaseClient.storage
          .from('trip-images')
          .getPublicUrl(path);
        urls.push(data.publicUrl);
      }),
    );

    return urls;
  }

  /// @Return: all trips
  async getTrips(query: QueryDto): Promise<PaginatedResponseDto<Trip>> {
    let qb = applySupabaseQuery(this.supabaseClient, 'trips', query, {
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

    const { data, error, count } = await qb;

    if (error || !data || count === null) {
      throw new InternalServerErrorException(
        "Can't fetch trips at the instant",
      );
    }

    return paginatedResponse(data as Trip[], count, query);
  }

  /// @Return: the trip with the given id
  async getTripById(id: string): Promise<Trip> {
    const { data: trip, error } = await this.supabaseClient
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  /// @Return: the added trip
  async addTrip(
    userId: string,
    trip: TripCreateDTO,
    files?: Express.Multer.File[],
  ): Promise<Trip> {
    let images: string[] = [];

    if (files) {
      images = await this.uploadImages(files, userId);
    }

    const { error, data } = await this.supabaseClient
      .from('trips')
      .insert({
        ...trip,
        images,
        organizer: userId,
      })
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to create trip');
    }

    return data;
  }

  /// @Return: the updated trip fields
  async updateTrip(
    userId: string,
    id: string,
    trip: TripUpdateDTO,
    files?: Express.Multer.File[],
  ): Promise<Trip> {
    const { data: existing, error: fetchError } = await this.supabaseClient
      .from('trips')
      .select('id, organizer, images')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException('Trip not found');
    }

    if (existing.organizer !== userId) {
      throw new UnauthorizedException();
    }

    const removed = existing.images.filter(
      (url) => !trip.existingImages.includes(url),
    );

    try {
      await Promise.all(
        removed.map((url) => {
          const path = url.split('/trip-images/')[1];
          return this.supabaseClient.storage.from('trip-images').remove([path]);
        }),
      );
    } catch (error) {
      // TODO: handle partial failures (some images deleted, some failed)
      throw new InternalServerErrorException('Failed to remove old images');
    }

    let images: string[] = existing.images.filter((url) =>
      trip.existingImages.includes(url),
    );

    if (files) {
      images = [...images, ...(await this.uploadImages(files, userId))];
    }

    const { data, error } = await this.supabaseClient
      .from('trips')
      .update({ ...trip, images })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update trip');
    }

    return data;
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
}
