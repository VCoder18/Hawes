import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('Destinations')
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  getDestinations(@Query() query: QueryDto) {
    return this.service.getDestinations(query);
  }

  @Get(':tripId')
  getDestinationById(@Param('tripId') tripId: string) {
    return this.service.getDestinationById(tripId);
  }
}
