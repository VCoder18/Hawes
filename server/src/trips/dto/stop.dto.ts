import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Geography, GeographyType } from '../entities/trips.entity';

export enum TripStopType {
  Destination = 'destination',
  Meeting = 'meeting',
}

export class TripStopDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Transform(({ value, obj }) => value ?? obj.stop_order)
  index?: number;

  @IsOptional()
  @IsString()
  label?: string | null;

  @ValidateNested()
  @Type(() => Geography)
  location: Geography = new Geography(GeographyType.Point, [0, 0]);

  @IsOptional()
  @IsString()
  time?: string | null;
  @Transform(({ value, obj }) => value ?? obj.stop_type)
  @IsEnum(TripStopType)
  type: TripStopType = TripStopType.Meeting;

  @Transform(({ value, obj }) => value ?? obj.destination_id)
  @ValidateIf((value: TripStopDTO) => value.type === TripStopType.Destination)
  @IsString() // Using string instead of UUID as some destinations might have slug/string IDs in certain contexts, or be handled as string
  destination?: string | null;

  // Service ID for service-type stops
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  service?: number | null;

  // Acceptance of old keys for compatibility during transition
  @IsOptional()
  @IsInt()
  stop_order?: number;
  @IsOptional()
  @IsEnum(TripStopType)
  stop_type?: TripStopType;

  @IsOptional()
  @IsString()
  destination_id?: string | null;
}
