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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { AuthGuard, Public, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ProfileUpdateDTO } from './dto/update.dto';
import { ProfileMediaUploadDTO } from './dto/upload-media.dto';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly service: ProfilesService) {}

  @Public()
  @Get('username/:username')
  getProfileByUsername(@Param('username') username: string) {
    return this.service.getProfileByUsername(username);
  }

  @Public()
  @Get('id/:id')
  getProfileById(@Param('id') id: string) {
    return this.service.getProfile(id);
  }

  @Get()
  getProfile(@CurrentUser() user: SupabaseJWTPayload) {
    return this.service.getProfile(user.sub);
  }

  @Patch()
  editProfile(
    @Body() body: ProfileUpdateDTO,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.service.updateProfile(user.sub, body);
  }

  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfileMedia(
    @Body() body: ProfileMediaUploadDTO,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.service.uploadProfileMedia(user.sub, body, file);
  }

  @Delete()
  deleteProfile(@CurrentUser() user: SupabaseJWTPayload) {
    return this.service.deleteProfile(user.sub);
  }
}
