import { IsEnum, IsOptional } from 'class-validator';
import { TripsQueryDto } from 'src/trips/dto/query.dto';
import { TripStatus } from 'src/trips/entities/trips.entity';

export class DashboardQueryDto extends TripsQueryDto {
  @IsOptional()
  @IsEnum(TripStatus)
  public status?: TripStatus = TripStatus.Draft;
}
