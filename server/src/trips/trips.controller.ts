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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TripsService } from './trips.service';
import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { TripCreateDTO } from './dto/create.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TripUpdateDTO } from './dto/update.dto';
import { TripsQueryDto } from './dto/query.dto';

@Controller('trips')
@UseGuards(AuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Get()
  getTrips(
    @CurrentUser() user: SupabaseJWTPayload,
    @Query() query: TripsQueryDto,
  ) {
    return this.service.getTrips(user.sub, query);
  }

  @Get(':tripId')
  getTripById(@Param('tripId') tripId: string) {
    return this.service.getTripById(tripId);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 5 },
      { name: 'attachment', maxCount: 1 },
    ]),
  )
  createTrip(
    @Body() body: TripCreateDTO,
    @CurrentUser() user: SupabaseJWTPayload,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(image\/jpeg|image\/png|image\/webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    images: Array<Express.Multer.File> | undefined,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
        })
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    attachment: Express.Multer.File | undefined,
  ) {
    return this.service.createTrip(user.sub, body, images, attachment);
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
