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
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFiles,
  HttpCode,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TripsService } from './trips.service';
import { AuthGuard, Public, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { TripCreateDTO } from './dto/create.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TripUpdateDTO } from './dto/update.dto';
import { TripsQueryDto } from './dto/query.dto';
import { TripMediaPipe } from './pipes/trip-media.pipe';

@Controller('trips')
@UseGuards(AuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Get()
  @Public()
  getTrips(
    @CurrentUser() user: SupabaseJWTPayload | undefined,
    @Query() query: TripsQueryDto,
  ) {
    return this.service.getTrips(user?.sub ?? null, query);
  }

  @Get(':tripId')
  @Public()
  getTripById(
    @Param('tripId') tripId: string,
    @CurrentUser() user: SupabaseJWTPayload | undefined,
    @Query('invite') inviteCode?: string,
  ) {
    return this.service.getTripById(tripId, user?.sub ?? null, inviteCode);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 6 },
      { name: 'attachment', maxCount: 1 },
    ]),
  )
  createTrip(
    @Body() body: TripCreateDTO,
    @CurrentUser() user: SupabaseJWTPayload,
    @UploadedFiles(TripMediaPipe)
    files: { images?: Express.Multer.File[]; attachment?: Express.Multer.File[] },
  ) {
    const { images, attachment } = files ?? {};
    return this.service.createTrip(
      user.sub,
      body,
      images,
      attachment?.[0],
    );
  }

  @Patch(':tripId')
  updateTrip(
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

  @Post('/join/:tripId')
  joinTrip(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
    @Body() body: { invite_code?: string },
  ) {
    return this.service.joinTrip(user.sub, tripId, body.invite_code);
  }

  @Get('/participation/:tripId')
  checkParticipation(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.service.checkParticipation(user.sub, tripId);
  }

  @Post('/leave')
  @HttpCode(200)
  leaveTripByTripId(
    @CurrentUser() user: SupabaseJWTPayload,
    @Body() body: { trip_id: string },
  ) {
    return this.service.leaveTripByTripId(user.sub, body.trip_id);
  }

  @Get('/leave/:affiliationId')
  leaveTrip(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('affiliationId') affiliationId: string,
  ) {
    return this.service.leaveTrip(user.sub, affiliationId);
  }

  @Get(':tripId/invite')
  @UseGuards(AuthGuard)
  getInviteCode(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.service.getInviteCode(user.sub, tripId);
  }

  @Post(':tripId/invite-user')
  @HttpCode(200)
  sendTripInvite(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
    @Body() body: { recipient_id: string },
  ) {
    return this.service.sendTripInvite(user.sub, tripId, body.recipient_id);
  }
}
