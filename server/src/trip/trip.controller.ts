import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TripService, type TripDTO } from './trip.service';

@Controller('trip')
export class TripController {
  constructor(private readonly service: TripService) {}

  @Get()
  getTrips() {
    return this.service.getTrips();
  }

  @Get(':tripId')
  getTripById(@Param('tripId') tripId: number) {
    return this.service.getTripById(tripId);
  }

  @Post()
  addTrip(@Body() trip: TripDTO) {
    return this.service.addTrip(trip);
  }

  @Patch(':tripId')
  editTrip(@Param('tripId') tripId: number, @Body() trip: TripDTO) {
    return this.service.updateTrip(tripId, trip);
  }

  @Delete(':tripId')
  deleteTrip(@Param('tripId') tripId: number) {
    return this.service.deleteTrip(tripId);
  }
}
