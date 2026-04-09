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
import { TripMediaUploadDTO } from './dto/upload-media.dto';

const DEFAULT_TRIP_MEDIA_BUCKET = 'trips';

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

interface UploadedMediaFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export type TripWithStops = Trip & { stops: TripStopRow[] };

@Injectable()
export class TripsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  private sanitizePathSegment(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  }

  private fileExtensionFromContentType(contentType: string): string {
    switch (contentType) {
      case 'image/png':
        return 'png';
      case 'image/jpeg':
        return 'jpg';
      case 'application/pdf':
        return 'pdf';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx';
      default:
        return 'bin';
    }
  }

  async uploadTripMedia(
    userId: string,
    media: TripMediaUploadDTO,
    file?: UploadedMediaFile,
  ): Promise<{ publicUrl: string; path: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const contentType = file.mimetype || 'application/octet-stream';
    const extension = this.fileExtensionFromContentType(contentType);
    const originalName = media.fileName ?? file.originalname ?? 'upload';
    const fileBaseName = this.sanitizePathSegment(originalName.replace(/\.[^.]+$/, '')) || 'upload';
    const uniquePart = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const safeTripId = this.sanitizePathSegment(media.tripId);
    let bucketName: string;
    let filePath: string;

    switch (media.folder) {
      case 'covers':
        bucketName = process.env.SUPABASE_TRIP_MEDIA_BUCKET ?? DEFAULT_TRIP_MEDIA_BUCKET;
        filePath = `${safeTripId}/cover.${extension}`;
        break;
      case 'documents':
        bucketName = process.env.SUPABASE_TRIP_ATTACHMENTS_BUCKET ?? 'trips-attachments';
        filePath = `${safeTripId}/attachment.${extension}`;
        break;
      case 'images':
      default:
        bucketName = process.env.SUPABASE_TRIP_IMAGES_BUCKET ?? 'trips-images';
        filePath = `${safeTripId}/${fileBaseName}-${uniquePart}.${extension}`;
        break;
    }

    const { error: uploadError } = await this.supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType,
        upsert: media.folder !== 'images',
      });

    if (uploadError) {
      const isMimeRestricted = /mime type/i.test(uploadError.message);
      if (isMimeRestricted && contentType !== 'application/octet-stream') {
        const { error: retryError } = await this.supabaseClient.storage
          .from(bucketName)
          .upload(filePath, file.buffer, {
            contentType: 'application/octet-stream',
            upsert: media.folder !== 'images',
          });

        if (retryError) {
          throw new BadRequestException(
            `Failed to upload media: ${retryError.message}`,
          );
        }
      } else {
        throw new BadRequestException(
          `Failed to upload media: ${uploadError.message}`,
        );
      }
    }

    const { data } = this.supabaseClient.storage.from(bucketName).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new InternalServerErrorException('Failed to resolve media URL');
    }

    console.log(`[TripsService] Generated public URL: ${data.publicUrl}`);
    console.log(`[TripsService] Bucket: ${bucketName}, Path: ${filePath}`);

    return {
      publicUrl: data.publicUrl,
      path: filePath,
    };
  }

  private validateStopOrder(stops: TripStopDTO[]): void {
    if (!stops.length) {
      return;
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
  async getTrips(query: QueryDto): Promise<PaginatedResponseDto<Trip>> {
    const normalizedFilters = { ...(query.filters ?? {}) };
    let participantCountsByTripId: Map<string, number> | null = null;

    const getParticipantCountsByTrip = async (): Promise<Map<string, number>> => {
      if (participantCountsByTripId) {
        return participantCountsByTripId;
      }

      const { data: participants, error: participantsError } = await this.supabaseClient
        .from('trip_participants')
        .select('trip_id');

      if (participantsError) {
        throw new InternalServerErrorException("Can't read trip participants");
      }

      participantCountsByTripId = new Map<string, number>();
      for (const row of (participants ?? []) as Array<{ trip_id: string }>) {
        participantCountsByTripId.set(
          row.trip_id,
          (participantCountsByTripId.get(row.trip_id) ?? 0) + 1,
        );
      }

      return participantCountsByTripId;
    };

    const monthDayCode = (dateStr: string): number | null => {
      if (!dateStr) return null;
      const parts = dateStr.split('-').map(Number);
      if (parts.length < 3) return null;
      const month = parts[1];
      const day = parts[2];
      if (!Number.isFinite(month) || !Number.isFinite(day)) return null;
      return month * 100 + day;
    };

    const toRanges = (start: number, end: number): Array<[number, number]> => {
      if (start <= end) return [[start, end]];
      return [
        [start, 1231],
        [101, end],
      ];
    };

    const hasMonthDayOverlap = (
      filterStart: number,
      filterEnd: number,
      tripStart: number,
      tripEnd: number,
    ): boolean => {
      const filterRanges = toRanges(filterStart, filterEnd);
      const tripRanges = toRanges(tripStart, tripEnd);
      return filterRanges.some(([fs, fe]) =>
        tripRanges.some(([ts, te]) => !(fe < ts || fs > te)),
      );
    };

    // Filter trips by organizer role (profiles.role), then constrain trips.organizer.
    if (normalizedFilters.organizer_role?.value) {
      const organizerRole = String(normalizedFilters.organizer_role.value)
        .trim()
        .toLowerCase();

      const { data: organizers, error: organizerError } = await this.supabaseClient
        .from('profiles')
        .select('id')
        .eq('role', organizerRole);

      if (organizerError) {
        throw new InternalServerErrorException("Can't filter trips by organizer role");
      }

      const organizerIds = ((organizers ?? []) as Array<{ id: string }>).map(
        (row) => row.id,
      );
      normalizedFilters.organizer_role = {
        operator: 'eq',
        value: organizerIds.join(','),
      };
    }

    // Filter trips by destination categories using destinations -> trip_stops -> trips.
    if (normalizedFilters.place_categories?.value) {
      const requestedCategories = String(normalizedFilters.place_categories.value)
        .split(',')
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);

      if (requestedCategories.length) {
        const { data: destinations, error: destinationsError } = await this.supabaseClient
          .from('destinations')
          .select('id')
          .in('category', requestedCategories);

        if (destinationsError) {
          throw new InternalServerErrorException("Can't filter trips by place category");
        }

        const destinationIds = (
          (destinations ?? []) as Array<{ id: string }>
        ).map((row) => row.id);
        let tripIds: string[] = [];

        if (destinationIds.length) {
          const { data: tripStops, error: tripStopsError } = await this.supabaseClient
            .from('trip_stops' as any)
            .select('trip_id')
            .eq('stop_type', TripStopType.Destination)
            .in('destination_id', destinationIds);

          if (tripStopsError) {
            throw new InternalServerErrorException("Can't filter trips by place category");
          }

          tripIds = Array.from(new Set((tripStops ?? []).map((stop: any) => stop.trip_id)));
        }

        normalizedFilters.place_categories = {
          operator: 'eq',
          value: tripIds.join(','),
        };
      }
    }

    // Filter trips by current participant count bands.
    if (normalizedFilters.popularity?.value) {
      const popularityBand = String(normalizedFilters.popularity.value).trim();

      const { data: allTrips, error: allTripsError } = await this.supabaseClient
        .from('trips')
        .select('id');

      if (allTripsError) {
        throw new InternalServerErrorException("Can't filter trips by popularity");
      }

      const countsByTripId = await getParticipantCountsByTrip();

      const matchBand = (count: number): boolean => {
        switch (popularityBand) {
          case 'quiet':
            return count <= 5;
          case 'moderate':
            return count > 5 && count <= 15;
          case 'popular':
            return count > 15 && count <= 50;
          case 'very-popular':
            return count > 50;
          default:
            return true;
        }
      };

      const matchingTripIds = ((allTrips ?? []) as Array<{ id: string }>)
        .map((trip) => trip.id)
        .filter((tripId) => matchBand(countsByTripId.get(tripId) ?? 0));

      normalizedFilters.popularity = {
        operator: 'eq',
        value: matchingTripIds.join(','),
      };
    }

    // Filter trips by currently available spots (max participants - current participants).
    if (normalizedFilters.available_spots?.value !== undefined) {
      const minAvailableSpots = Number(normalizedFilters.available_spots.value) || 0;

      const { data: tripsForSpots, error: tripsForSpotsError } = await this.supabaseClient
        .from('trips')
        .select('id, max_participants');

      if (tripsForSpotsError) {
        throw new InternalServerErrorException("Can't filter trips by available spots");
      }

      const countsByTripId = await getParticipantCountsByTrip();
      const matchingTripIds = ((tripsForSpots ?? []) as Array<{ id: string; max_participants: number | null }>)
        .filter((trip) => {
          const currentCount = countsByTripId.get(trip.id) ?? 0;
          const maxParticipants = trip.max_participants ?? 0;
          return maxParticipants - currentCount >= minAvailableSpots;
        })
        .map((trip) => trip.id);

      normalizedFilters.available_spots = {
        operator: 'eq',
        value: matchingTripIds.join(','),
      };
    }

    // Filter trips by month/day overlap against trip date ranges.
    if (normalizedFilters.month?.value) {
      const [startStr, endStr] = String(normalizedFilters.month.value).split(':');
      const [startMonth, startDay] = (startStr ?? '').split('-').map(Number);
      const [endMonth, endDay] = (endStr ?? '').split('-').map(Number);
      const filterStart = startMonth * 100 + startDay;
      const filterEnd = endMonth * 100 + endDay;

      if (Number.isFinite(filterStart) && Number.isFinite(filterEnd)) {
        const { data: tripsForMonth, error: tripsForMonthError } = await this.supabaseClient
          .from('trips')
          .select('id, start_date, end_date');

        if (tripsForMonthError) {
          throw new InternalServerErrorException("Can't filter trips by month");
        }

        const matchingTripIds = ((tripsForMonth ?? []) as Array<{
          id: string;
          start_date: string;
          end_date: string;
        }>)
          .filter((trip) => {
            const tripStart = monthDayCode(trip.start_date);
            const tripEnd = monthDayCode(trip.end_date);
            if (tripStart === null || tripEnd === null) return false;
            return hasMonthDayOverlap(filterStart, filterEnd, tripStart, tripEnd);
          })
          .map((trip) => trip.id);

        normalizedFilters.month = {
          operator: 'eq',
          value: matchingTripIds.join(','),
        };
      }
    }

    // Filter trips by number of destination stops.
    if (normalizedFilters.min_destinations?.value !== undefined) {
      const minDestinations = Number(normalizedFilters.min_destinations.value) || 0;
      const { data: tripStops, error: tripStopsError } = await this.supabaseClient
        .from('trip_stops' as any)
        .select('trip_id, stop_type')
        .eq('stop_type', TripStopType.Destination);

      if (tripStopsError) {
        throw new InternalServerErrorException("Can't filter trips by destination count");
      }

      const destinationCounts = new Map<string, number>();
      for (const stop of (tripStops ?? []) as Array<{ trip_id: string }>) {
        destinationCounts.set(
          stop.trip_id,
          (destinationCounts.get(stop.trip_id) ?? 0) + 1,
        );
      }

      const matchingTripIds = Array.from(destinationCounts.entries())
        .filter(([, count]) => count >= minDestinations)
        .map(([tripId]) => tripId);

      normalizedFilters.min_destinations = {
        operator: 'eq',
        value: matchingTripIds.join(','),
      };
    }

    // Filter trips by user's bookmarked trips.
    if (normalizedFilters.bookmarks_only?.value) {
      const bookmarksUserId = String(normalizedFilters.bookmarks_only.value);

      const { data: favoriteTripsRows, error: favoriteTripsError } = await this.supabaseClient
        .from('bookmarks' as any)
        .select('trip_id')
        .eq('user_id', bookmarksUserId);

      let favoriteTripIds: string[] = [];
      if (!favoriteTripsError) {
        favoriteTripIds = ((favoriteTripsRows ?? []) as Array<{ trip_id: string }>).map(
          (row) => row.trip_id,
        );
      }

      normalizedFilters.bookmarks_only = {
        operator: 'eq',
        value: favoriteTripIds.join(','),
      };
    }

    const qb = applySupabaseQuery(this.supabaseClient, 'trips', {
      ...query,
      filters: normalizedFilters,
    }, {
      searchFields: ['title', 'description'],
      allowedFilters: [
        'organizer',
        'category',
        'difficulty',
        'price',
        'min_participants',
        'start_date',
        'popularity',
        'available_spots',
        'month',
        'min_destinations',
        'bookmarks_only',
        'organizer_role',
        'place_categories',
      ],
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
      customFilters: {
        organizer_role: (queryBuilder, value) => {
          const organizerIds = String(value)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

          if (!organizerIds.length) {
            return queryBuilder.eq('id', '__no_match__');
          }

          return queryBuilder.in('organizer', organizerIds);
        },
        place_categories: (queryBuilder, value) => {
          const tripIds = String(value)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

          if (!tripIds.length) {
            return queryBuilder.eq('id', '__no_match__');
          }

          return queryBuilder.in('id', tripIds);
        },
        popularity: (queryBuilder, value) => {
          const tripIds = String(value)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

          if (!tripIds.length) {
            return queryBuilder.eq('id', '__no_match__');
          }

          return queryBuilder.in('id', tripIds);
        },
        available_spots: (queryBuilder, value) => {
          const tripIds = String(value)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

          if (!tripIds.length) {
            return queryBuilder.eq('id', '__no_match__');
          }

          return queryBuilder.in('id', tripIds);
        },
        month: (queryBuilder, value) => {
          const tripIds = String(value)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

          if (!tripIds.length) {
            return queryBuilder.eq('id', '__no_match__');
          }

          return queryBuilder.in('id', tripIds);
        },
        min_destinations: (queryBuilder, value) => {
          const tripIds = String(value)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

          if (!tripIds.length) {
            return queryBuilder.eq('id', '__no_match__');
          }

          return queryBuilder.in('id', tripIds);
        },
        bookmarks_only: (queryBuilder, value) => {
          const tripIds = String(value)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

          if (!tripIds.length) {
            return queryBuilder.eq('id', '__no_match__');
          }

          return queryBuilder.in('id', tripIds);
        },
      },
    });

    const { data, error, count } = await qb;

    if (error || !data || count === null) {
      throw new InternalServerErrorException(
        "Can't fetch trips at the instant",
      );
    }

    // Fetch trip_stops (meeting locations) for each trip
    const trips = data as Trip[];
    const enrichedTrips = await Promise.all(
      trips.map(async (trip) => {
        const stops = await this.getTripStops(trip.id);
        return {
          ...trip,
          stops,
        };
      })
    );

    return paginatedResponse(enrichedTrips, count, query);
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

    const stops = await this.getTripStops(tripId);
    return { ...(trip as Trip), stops };
  }

  /// @Return: the added trip
  async addTrip(userId: string, trip: TripCreateDTO): Promise<TripWithStops> {
    const { stops, ...tripPayload } = trip;
    const mediaUrls = Array.isArray(tripPayload.images) ? tripPayload.images : [];

    const { error, data } = await this.supabaseClient
      .from('trips')
      .insert({
        ...(tripPayload as any),
        images: mediaUrls,
        organizer: userId,
      } as any)
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      throw new BadRequestException('Failed to create trip');
    }

    try {
      // @ts-expect-error - table types issue
      await this.replaceTripStops(data.id, stops);
    } catch (stopError) {
      // @ts-expect-error - table types issue
      await this.supabaseClient.from('trips').delete().eq('id', data.id);
      throw stopError;
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

    if (hasTripFields) {
      const { error: updateError } = await this.supabaseClient
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
