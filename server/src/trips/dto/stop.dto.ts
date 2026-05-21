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
  // Accept stop order from older request format.
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stop_order?: number;

  @IsOptional()
  @IsString()
  label?: string | null;

  @ValidateNested()
  @Type(() => Geography)
  location: Geography = new Geography(GeographyType.Point, [0, 0]);

  // If request sends `stop_type`, use it as `type`.
  @Transform(({ value, obj }) => value ?? obj.stop_type)
  @IsEnum(TripStopType)
  type: TripStopType = TripStopType.Meeting;

  // If request sends `destination_id`, use it as `destination`.
  @Transform(({ value, obj }) => value ?? obj.destination_id)
  @ValidateIf((value: TripStopDTO) => value.type === TripStopType.Destination)
  @IsUUID()
  destination?: string | null;

  // Keep old key accepted so validation doesn't reject it.
  @IsOptional()
  @IsEnum(TripStopType)
  stop_type?: TripStopType;

  // Keep old key accepted so validation doesn't reject it.
  @IsOptional()
  @IsUUID()
  destination_id?: string | null;
}
