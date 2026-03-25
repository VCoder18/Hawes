import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
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
  Trip,
  TripDifficutly,
  TripStatus,
} from '../entities/trips.entity';

type TripInsert = Omit<
  Database['public']['Tables']['trips']['Insert'],
  'meeting_points'
> & {
  meeting_points: Geography[];
};

type TripCreateShape = Omit<
  TripInsert,
  'id' | 'created_at' | 'updated_at' | 'organizer' | 'images'
>;

export class TripCreateDTO implements TripCreateShape {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[] | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsEnum(TripDifficutly)
  difficulty: TripDifficutly;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  itinerary?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  max_participants?: number | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Geography)
  meeting_points: Geography[];

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

  @IsDateString()
  start_date: string;

  @IsEnum(TripStatus)
  status?: TripStatus;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  what_to_bring?: string | null;

  constructor() {
    this.difficulty = TripDifficutly.Easy;
    this.start_date = '';
    this.end_date = '';
    this.title = '';
    this.meeting_points = [];
  }

  static fromTrip(trip: Trip): TripCreateDTO {
    const dto = new TripCreateDTO();
    const keys: (keyof TripCreateShape)[] = [
      'activities',
      'description',
      'difficulty',
      'end_date',
      'itinerary',
      'max_participants',
      'min_participants',
      'price',
      'start_date',
      'status',
      'title',
      'what_to_bring',
      'meeting_points',
    ];
    for (const key of keys) {
      (dto as any)[key] = trip[key];
    }
    return dto;
  }
}
