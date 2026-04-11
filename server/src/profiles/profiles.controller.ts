import {
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import {
  AuthGuard,
  Public,
  type SupabaseJWTPayload,
} from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ProfileUpdateDTO } from './dto/update.dto';
import { ProfilesQueryDto } from './dto/query.dto';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly service: ProfilesService) {}

  @Get()
  getCurrentUserProfile(@CurrentUser() user: SupabaseJWTPayload) {
    return this.service.getProfile(user.sub);
  }

  @Public()
  @Get(':id')
  getProfileById(@Param('id') id: string) {
    return this.service.getProfile(id);
  }

  @Public()
  @Get('by-username/:username')
  getProfileByUsername(@Query() query: ProfilesQueryDto) {
    return this.service.getProfileByUsername(query);
  }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  updateProfile(
    @CurrentUser() user: SupabaseJWTPayload,
    @Body() profile: ProfileUpdateDTO,
    @UploadedFile(
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
    avatar: Express.Multer.File | undefined,
    @UploadedFile(
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
    banner: Express.Multer.File | undefined,
  ) {
    return this.service.updateProfile(user.sub, profile, avatar, banner);
  }

  @Delete()
  deleteCurrentUserProfile(@CurrentUser() user: SupabaseJWTPayload) {
    return this.service.deleteProfile(user.sub);
  }
}
