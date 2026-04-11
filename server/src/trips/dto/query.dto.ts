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

export class TripsQueryDto {
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
