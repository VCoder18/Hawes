import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import {
  AuthGuard,
  Public,
  type SupabaseJWTPayload,
} from 'src/auth/auth.guard';
import { TripCreateDTO } from './dto/create.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TripUpdateDTO } from './dto/update.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('trips')
@UseGuards(AuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Get()
  @Public()
  getTrips(@Query() query: QueryDto) {
    return this.service.getTrips(query);
  }

  @Public()
  @Get(':tripId')
  getTripById(@Param('tripId') tripId: string) {
    return this.service.getTripById(tripId);
  }

  @Post()
  addTrip(
    @Body() body: TripCreateDTO,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.service.addTrip(user.sub, body);
  }

  @Patch(':tripId')
  editTrip(
    @Body() body: TripUpdateDTO,
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.service.updateTrip(user.sub, tripId, body);
  }

  @Delete(':tripId')
  deleteTrip(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.service.deleteTrip(user.sub, tripId);
  }

  @Get('/join/:tripId')
  joinTrip(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.service.joinTrip(user.sub, tripId);
  }

  @Get('/leave/:affiliationId')
  leaveTrip(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('affiliationId') affiliationId: string,
  ) {
    return this.service.leaveTrip(user.sub, affiliationId);
  }
}
