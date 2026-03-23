import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { AuthGuard, Public } from 'src/auth/auth.guard';

@Controller('trips')
@UseGuards(AuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Get()
  @Public()
  getTrips() {
    return this.service.getTrips();
  }

  @Public()
  @Get(':tripId')
  getTripById(@Param('tripId') tripId: string) {
    return this.service.getTripById(tripId);
  }

  @Post()
  addTrip(@Req() req) {
    return this.service.addTrip(req.user.id, req.body);
  }

  @Patch(':tripId')
  editTrip(@Req() req, @Param('tripId') tripId: string) {
    return this.service.updateTrip(req.user.id, tripId, req.body);
  }

  @Delete(':tripId')
  deleteTrip(@Req() req, @Param('tripId') tripId: string) {
    return this.service.deleteTrip(req.user.id, tripId);
  }
}
