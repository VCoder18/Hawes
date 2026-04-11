import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TripDifficulty,
  TripStatus,
  TripCategory,
} from '../entities/trips.entity';
import { TripStopDTO } from './stop.dto';

export class TripCreateDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  title: string = '';

  @IsOptional()
  @IsString()
  slug?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsEnum(TripCategory)
  category: TripCategory = TripCategory.Nature;

  @IsEnum(TripDifficulty)
  difficulty: TripDifficulty = TripDifficulty.Easy;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[] | null;

  @IsDateString()
  end_date: string = '';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  itinerary?: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  included?: string[] | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  max_participants?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  min_participants?: number | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  not_included?: string[] | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number | null;

  @IsOptional()
  @IsBoolean()
  returns_to_start?: boolean = false;

  @IsDateString()
  start_date: string = '';

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripStopDTO)
  stops: TripStopDTO[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  what_to_bring?: string[] | null;
}
