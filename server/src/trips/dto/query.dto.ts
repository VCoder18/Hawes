import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DestinationCategory,
  TripCategory,
  TripDifficulty,
} from '../entities/trips.entity';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export enum QuickFilter {
  BOOKMARKS = 'bookmarks',
  TRAVELER = 'traveler',
  ORGANIZATION = 'organization',
  AGENCY = 'agency',
}

export enum ParticipantsRange {
  ZERO_TO_FIVE = '0-5',
  FIVE_TO_FIFTEEN = '5-15',
  FIFTEEN_TO_FIFTY = '15-50',
  FIFTY_PLUS = '50+',
}

export enum DestinationsCount {
  ONE = '1',
  TWO_PLUS = '2+',
  THREE_PLUS = '3+',
  FIVE_PLUS = '5+',
}

export abstract class TripsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsEnum(TripCategory)
  tripType?: TripCategory;

  @IsOptional()
  @IsEnum(QuickFilter)
  quickFilter?: QuickFilter;

  @IsOptional()
  @IsEnum(TripDifficulty)
  difficulty?: TripDifficulty;

  @IsOptional()
  @IsEnum(ParticipantsRange)
  participants?: ParticipantsRange;

  @IsOptional()
  @IsEnum(DestinationCategory)
  placeType?: DestinationCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minSpots?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsEnum(DestinationsCount)
  destinationsCount?: DestinationsCount;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10_000_000)
  priceMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 10;
}

export class TripsQueryFilter {
  constructor(
    protected query: TripsQueryDto,
    private supabaseClient: SupabaseClient<Database>,
  ) {}

  public async apply(tripsQuery, userId: string) {
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
    } = this.query;

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

    tripsQuery = tripsQuery.range(offset, offset + limit);

    return tripsQuery;
  }
}
