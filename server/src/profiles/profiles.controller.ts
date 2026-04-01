import {
  Controller,
  Delete,
  Patch,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ProfileUpdateDTO } from './dto/update.dto';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly service: ProfilesService) {}

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

  @Delete()
  deleteProfile(@CurrentUser() user: SupabaseJWTPayload) {
    return this.service.deleteProfile(user.sub);
  }
}
