import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
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
}
