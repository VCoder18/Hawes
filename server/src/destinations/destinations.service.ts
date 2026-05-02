import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import {
  Destination,
  DestinationResponse,
} from './entities/destinations.entity';
import {
  paginatedResponse,
  PaginatedResponseDto,
} from 'src/common/dto/paginated-response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { applySupabaseQuery } from 'src/common/utils/query-builder';

type DestinationsResponse = {
  data: Destination[];
  total: number;
  hasMore: boolean;
};

@Injectable()
export class DestinationsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: all destinations
  async getDestinations(
<<<<<<< Updated upstream
    query: QueryDto,
    userId?: string,
  ): Promise<PaginatedResponseDto<DestinationResponse>> {
    // Extract best_periods dates from filters to handle date range overlap
    const bestPeriodsFilter = query.filters?.['best_periods'];
    const favoritesOnlyFilter = query.filters?.['favorites_only'];
    let modifiedQuery = query;
    
    if ((bestPeriodsFilter || favoritesOnlyFilter) && query.filters) {
      // Remove best_periods and favorites_only from filters using destructuring
      const { best_periods, favorites_only, ...otherFilters } = query.filters;
      modifiedQuery = {
        ...query,
        filters: otherFilters,
      };
=======
    userId: string,
    query: DestinationsQueryDto,
  ): Promise<DestinationsResponse> {
    const {
      search,
      quickFilter,
      category,
      minRating,
      popularity,
      month,
      maxDistanceKm,
      offset,
      limit,
    } = query;

    const idSets: string[][] = [];

    if (quickFilter === DestinationQuickFilter.FAVORITES) {
      const { data, error } = await this.supabaseClient.rpc(
        'filter_destinations_by_favorite',
        { p_user_id: userId },
      );

      if (error || !data) {
        throw new InternalServerErrorException('Failed to filter favorites');
      }

      idSets.push(data.map((r: { destination_id: string }) => r.destination_id));
>>>>>>> Stashed changes
    }

    let qb = applySupabaseQuery(
      this.supabaseClient,
      'destinations',
      modifiedQuery,
      {
        searchFields: ['name', 'description', 'city', 'region'],
        allowedFilters: ['category', 'region', 'city', 'trip_ids'],
        allowedSortFields: [
          'name',
          'created_at',
          'updated_at',
          'city',
          'region',
        ],
        defaultSort: 'created_at',
        // Custom filter for trip_ids array - check if has any trips
        customFilters: {
          trip_ids: (queryBuilder, value) => {
            // If value is 'has_trips', filter for non-empty trip_ids array
            if (value === 'has_trips') {
              return queryBuilder.not('trip_ids', 'is', null);
            }
            return queryBuilder;
          },
        },
      },
    );

    // Handle favorites_only filter - get favorite destination IDs first
    const favoritesUserId =
      userId ||
      (typeof favoritesOnlyFilter?.value === 'string'
        ? favoritesOnlyFilter.value
        : undefined);

<<<<<<< Updated upstream
    if (favoritesOnlyFilter && !favoritesUserId) {
      return paginatedResponse<DestinationResponse>([], 0, modifiedQuery);
=======
      idSets.push(data.map((r: { destination_id: string }) => r.destination_id));
>>>>>>> Stashed changes
    }

    if (favoritesOnlyFilter && favoritesUserId) {
      const { data: favorites, error: favError } = await this.supabaseClient
        .from('favorite_destinations')
        .select('destination_id')
        .eq('user_id', favoritesUserId);

<<<<<<< Updated upstream
      if (favError) {
        throw new InternalServerErrorException(
          "Can't fetch user favorites",
        );
      }

      const favoriteIds = favorites?.map(f => (f as any).destination_id) || [];
      if (favoriteIds.length === 0) {
        // User has no favorites, return empty result
        return paginatedResponse<DestinationResponse>([], 0, modifiedQuery);
=======
      if (error || !data) {
        throw new InternalServerErrorException('Failed to filter by popularity');
      }

      idSets.push(data.map((r: { destination_id: string }) => r.destination_id));
    }

    let destinationsQuery = this.supabaseClient
      .from('destinations')
      .select('*', { count: 'exact' });

    if (idSets.length > 0) {
      const intersected = idSets.reduce((a, b) => a.filter((id) => b.includes(id)));

      if (intersected.length === 0) {
        return {
          data: [],
          total: 0,
          hasMore: false,
        };
>>>>>>> Stashed changes
      }

      qb = qb.in('id', favoriteIds);
    }

    const { data, error, count } = await qb;

    if (error || !data || count === null) {
      throw new InternalServerErrorException(
        "Can't fetch destinations at the instant",
      );
    }

    let destinations = data as Destination[];
    let finalCount = count;

    // Apply best_periods filter for date range overlap if provided
    // Filter checks if user's desired travel period overlaps with destination's best_periods
    if (bestPeriodsFilter && bestPeriodsFilter.value && destinations.length > 0) {
      // bestPeriodsFilter.value format: "MM-DD:MM-DD" (e.g., "07-11:08-28" for July 11 - Aug 28)
      const [startStr, endStr] = String(bestPeriodsFilter.value).split(':');
      destinations = destinations.filter(dest =>
        this.hasPeriodOverlap(startStr, endStr, (dest.best_periods as any) || null)
      );
      // Update count to reflect filtered results
      finalCount = destinations.length;
    }

<<<<<<< Updated upstream
    const normalizedDestinations = destinations.map((destination) =>
      this.normalizeDestination(destination),
    );

    return paginatedResponse<DestinationResponse>(
      normalizedDestinations,
      finalCount,
      modifiedQuery,
    );
  }

  private normalizeDestination(destination: Destination): DestinationResponse {
    const point = this.extractPoint(destination.location);
    return {
      ...destination,
      lat: point?.lat ?? null,
      lng: point?.lng ?? null,
    };
  }

  private extractPoint(
    location: unknown,
  ): { lat: number; lng: number } | null {
    const fromCoordinates = this.extractFromCoordinates(location);
    if (fromCoordinates) return fromCoordinates;

    const fromEwkbHex = this.extractFromEwkbHex(location);
    if (fromEwkbHex) return fromEwkbHex;

    const fromWkt = this.extractFromWkt(location);
    if (fromWkt) return fromWkt;

    const fromXY = this.extractFromXY(location);
    if (fromXY) return fromXY;

    return null;
  }

  private extractFromEwkbHex(
    location: unknown,
  ): { lat: number; lng: number } | null {
    if (typeof location !== 'string') return null;
    const value = location.trim();
    if (!/^[0-9a-fA-F]+$/.test(value) || value.length < 42 || value.length % 2 !== 0) {
      return null;
    }

    try {
      const buffer = Buffer.from(value, 'hex');
      const byteOrder = buffer.readUInt8(0);
      const littleEndian = byteOrder === 1;
      if (!littleEndian && byteOrder !== 0) return null;

      const readUInt32 = (offset: number) =>
        littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
      const readFloat64 = (offset: number) =>
        littleEndian ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);

      const typeWithFlags = readUInt32(1);
      const geometryType = typeWithFlags & 0xff;
      if (geometryType !== 1) return null;

      const hasSrid = (typeWithFlags & 0x20000000) !== 0;
      let offset = 5;
      if (hasSrid) {
        offset += 4;
      }

      if (buffer.length < offset + 16) return null;
      const lng = readFloat64(offset);
      const lat = readFloat64(offset + 8);

      return this.validatePoint(lat, lng) ? { lat, lng } : null;
    } catch {
      return null;
    }
  }

  private extractFromCoordinates(
    location: unknown,
  ): { lat: number; lng: number } | null {
    if (!location || typeof location !== 'object') return null;

    const coords = (location as { coordinates?: unknown }).coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return null;

    const lng = Number(coords[0]);
    const lat = Number(coords[1]);
    return this.validatePoint(lat, lng) ? { lat, lng } : null;
  }

  private extractFromWkt(location: unknown): { lat: number; lng: number } | null {
    if (typeof location !== 'string') return null;

    const match = location.match(
      /POINT\s*\(\s*([+-]?[0-9]*\.?[0-9]+)\s+([+-]?[0-9]*\.?[0-9]+)\s*\)/i,
    );
    if (!match) return null;

    const lng = Number(match[1]);
    const lat = Number(match[2]);
    return this.validatePoint(lat, lng) ? { lat, lng } : null;
  }

  private extractFromXY(location: unknown): { lat: number; lng: number } | null {
    if (!location || typeof location !== 'object') return null;

    const maybeXY = location as { x?: unknown; y?: unknown };
    const lng = Number(maybeXY.x);
    const lat = Number(maybeXY.y);
    return this.validatePoint(lat, lng) ? { lat, lng } : null;
  }

  private validatePoint(lat: number, lng: number): boolean {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  /**
   * Check if a desired travel period overlaps with any of the destination's best_periods.
   * Determines if the destination is good to visit during the user's travel time.
   * Format: "MM-DD" (e.g., "07-11" for July 11)
   */
  private hasPeriodOverlap(
    startStr: string,
    endStr: string,
    bestPeriods: string[] | null,
  ): boolean {
    if (!bestPeriods || bestPeriods.length === 0) return true;

    const [startMonth, startDay] = startStr.split('-').map(Number);
    const [endMonth, endDay] = endStr.split('-').map(Number);

    // Convert to day-of-year for comparison (ignoring year)
    const startDoy = startMonth * 100 + startDay;
    const endDoy = endMonth * 100 + endDay;

    // Check overlap with any best_period range
    return bestPeriods.some(period => {
      const [periodStartStr, periodEndStr] = period.split(':');
      const [pStartMonth, pStartDay] = periodStartStr
        .split('-')
        .map(Number);
      const [pEndMonth, pEndDay] = periodEndStr.split('-').map(Number);

      const pStartDoy = pStartMonth * 100 + pStartDay;
      const pEndDoy = pEndMonth * 100 + pEndDay;

      // Handle year-wrapping periods (e.g., Nov-Feb: 1101 to 0228)
      if (pStartDoy > pEndDoy) {
        // Period wraps around year boundary
        return startDoy >= pStartDoy || endDoy <= pEndDoy;
      }

      // Normal case: no year wrap
      // Ranges overlap if one doesn't end before the other starts
      return !(endDoy < pStartDoy || startDoy > pEndDoy);
    });
=======
    if (minRating) {
      destinationsQuery = destinationsQuery.gte('rating', minRating);
    }

    if (month) {
      // TODO: this will get replaced with intervals
    }

    if (maxDistanceKm !== undefined) {
      // TODO: later
    }

    const to = offset + limit - 1;
    const {
      data: destinations,
      error,
      count,
    } = await destinationsQuery.range(offset, to);

    if (error || !destinations) {
      throw new NotFoundException('No destinations found');
    }

    const total = count ?? 0;

    return {
      data: destinations,
      total,
      hasMore: to + 1 < total,
    };
>>>>>>> Stashed changes
  }

  /// @Return: the destination with the given id
  async getDestinationById(id: string): Promise<DestinationResponse> {
    const { data: destination, error } = await this.supabaseClient
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !destination) {
      throw new NotFoundException('destination not found');
    }
    return this.normalizeDestination(destination as Destination);
  }
}
