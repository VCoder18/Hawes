import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { AuthGuard, Public, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { DestinationsQueryDto } from './dto/query.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('destinations')
@UseGuards(AuthGuard)
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  getDestinations(
    @CurrentUser() user: SupabaseJWTPayload,
    @Query() query: DestinationsQueryDto,
  ) {
    return this.service.getDestinations(user.sub, query);
  }

  @Get(':tripId')
  getDestinationById(@Param('tripId') tripId: string) {
    return this.service.getDestinationById(tripId);
  }

  @Get(':id/nearby-wilayas')
  getNearbyWilayas(
    @Param('id') id: string,
    @Query('maxRadius') maxRadius?: string,
  ) {
    return this.service.getNearbyWilayas(
      id,
      maxRadius ? parseInt(maxRadius, 10) : 500,
    );
  }

  @Get(':id/trips')
  @Public()
  getDestinationTrips(
    @Param('id') id: string,
    @CurrentUser() user: SupabaseJWTPayload | undefined,
  ) {
    return this.service.getDestinationTrips(id, user?.sub ?? null);
  }
}
