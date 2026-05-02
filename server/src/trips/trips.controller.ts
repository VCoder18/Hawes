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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TripsService } from './trips.service';
<<<<<<< Updated upstream
import {
  AuthGuard,
  Public,
  type SupabaseJWTPayload,
} from 'src/auth/auth.guard';
=======
import { AuthGuard, Public, type SupabaseJWTPayload } from 'src/auth/auth.guard';
>>>>>>> Stashed changes
import { TripCreateDTO } from './dto/create.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TripUpdateDTO } from './dto/update.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageFilesValidationPipe } from 'src/common/pipes/image-validation.pipe';

@Controller('trips')
@UseGuards(AuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Get()
  @Public()
<<<<<<< Updated upstream
  getTrips(@Query() query: QueryDto) {
    return this.service.getTrips(query);
=======
  getTrips(
    @CurrentUser() user: SupabaseJWTPayload | undefined,
    @Query() query: TripsQueryDto,
  ) {
    return this.service.getTrips(user?.sub ?? null, query);
>>>>>>> Stashed changes
  }

  @Public()
  @Get(':tripId')
  @Public()
  getTripById(@Param('tripId') tripId: string) {
    return this.service.getTripById(tripId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  addTrip(
    @Body() body: TripCreateDTO,
    @CurrentUser() user: SupabaseJWTPayload,
<<<<<<< Updated upstream
    @UploadedFile(new ImageFilesValidationPipe()) files?: Express.Multer.File[],
  ) {
    return this.service.addTrip(user.sub, body, files);
=======
    @UploadedFiles(TripMediaPipe)
    files: { images?: unknown[]; attachment?: unknown[] },
  ) {
    const { images, attachment } = files ?? {};
    return this.service.createTrip(
      user.sub,
      body,
      images as any,
      (attachment?.[0] as any) ?? undefined,
    );
>>>>>>> Stashed changes
  }

  @Patch(':tripId')
  @UseInterceptors(FilesInterceptor('images', 5))
  editTrip(
    @Body() body: TripUpdateDTO,
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('tripId') tripId: string,
    @UploadedFile(new ImageFilesValidationPipe()) files?: Express.Multer.File[],
  ) {
    return this.service.updateTrip(user.sub, tripId, body, files);
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
