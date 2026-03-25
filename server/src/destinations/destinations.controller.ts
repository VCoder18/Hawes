import { Controller, Get, Param } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('Destinations')
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  getDestinations() {
    return this.service.getDestinations();
  }

  @Get(':tripId')
  getDestinationById(@Param('tripId') tripId: string) {
    return this.service.getDestinationById(tripId);
  }
}
