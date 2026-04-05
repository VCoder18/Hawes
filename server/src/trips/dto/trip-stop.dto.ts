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
import { Type } from 'class-transformer';
import { Geography, GeographyType } from '../entities/trips.entity';

export enum TripStopType {
  Meeting = 'meeting',
  Destination = 'destination',
}

export class TripStopDTO {
  @IsInt()
  @Min(0)
  stop_order: number;

  @IsEnum(TripStopType)
  stop_type: TripStopType;

  @ValidateIf((value: TripStopDTO) => value.stop_type === TripStopType.Destination)
  @IsUUID()
  destination_id?: string | null;

  @ValidateNested()
  @Type(() => Geography)
  location: Geography;

  @IsOptional()
  @IsString()
  label?: string | null;

  constructor() {
    this.stop_order = 0;
    this.stop_type = TripStopType.Meeting;
    this.location = new Geography(GeographyType.Point, [0, 0]);
  }
}
