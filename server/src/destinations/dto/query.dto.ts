import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { DestinationCategory } from 'src/trips/entities/trips.entity';

export enum DestinationPopularity {
  QUIET = 'quiet',
  MODERATE = 'moderate',
  POPULAR = 'popular',
  VERY_POPULAR = 'very_popular',
}

export enum DestinationQuickFilter {
  FAVORITES = 'favorites',
  HAS_TRIPS = 'has_trips',
}

export enum MinRating {
  THREE = 3,
  THREE_HALF = 3.5,
  FOUR = 4,
  FOUR_HALF = 4.5,
}

export class DestinationsQueryDto {
  @IsOptional()
  @IsEnum(DestinationQuickFilter)
  quickFilter?: DestinationQuickFilter;

  @IsOptional()
  @IsEnum(DestinationCategory)
  category?: DestinationCategory;

  @IsOptional()
  @Type(() => Number)
  @IsIn([3, 3.5, 4, 4.5])
  minRating?: number;

  @IsOptional()
  @IsEnum(DestinationPopularity)
  popularity?: DestinationPopularity;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxDistanceKm?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 10;
}
