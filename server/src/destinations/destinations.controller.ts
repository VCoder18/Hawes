import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/auth.guard';

@Controller('destinations')
@UseGuards(AuthGuard)
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  @Public()
  getDestinations(@Query() query: QueryDto) {
    return this.service.getDestinations(query);
  }

  @Get(':tripId')
  getDestinationById(@Param('tripId') tripId: string) {
    return this.service.getDestinationById(tripId);
  }
}
