import {
  IsInt,
  IsEnum,
  Min,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
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
  index?: number;

  @IsOptional()
  @IsString()
  label?: string | null;

  @ValidateNested()
  @Type(() => Geography)
  location: Geography = new Geography(GeographyType.Point, [0, 0]);

  @IsEnum(TripStopType)
  type: TripStopType = TripStopType.Meeting;

  @ValidateIf((value: TripStopDTO) => value.type === TripStopType.Destination)
  @IsString()
  destination?: string | null;

  @IsOptional()
  @IsString()
  time?: string | null;
}
