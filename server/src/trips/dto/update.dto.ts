import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Database } from 'src/database.types';
import {
  Geography,
  TripDifficulty,
  TripStatus,
} from '../entities/trips.entity';

type TripUpdateShape = Omit<
  Database['public']['Tables']['trips']['Update'],
  'id' | 'created_at' | 'updated_at' | 'organizer' | 'meeting_points' | 'images'
> & {
  meeting_points?: Geography[];
};

export class TripUpdateDTO implements TripUpdateShape {
  @IsArray()
  @IsString({ each: true })
  existingImages: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[] | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(TripDifficulty)
  difficulty?: TripDifficulty;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  itinerary?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  max_participants?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Geography)
  meeting_points?: Geography[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  min_participants?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number | null;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  what_to_bring?: string | null;
}
