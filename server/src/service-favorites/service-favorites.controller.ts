import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ServiceFavoritesService } from './service-favorites.service';
import { ServiceFavorite } from './service-favorite.entity';

@Controller('service-favorites')
@UseGuards(AuthGuard)
export class ServiceFavoritesController {
  constructor(private readonly serviceFavoritesService: ServiceFavoritesService) {}

  @Get()
  async getUserFavorites(
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<ServiceFavorite[]> {
    return this.serviceFavoritesService.getUserFavorites(user.sub);
  }

  @Get(':serviceId')
  async isFavorited(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<boolean> {
    return this.serviceFavoritesService.isFavorited(user.sub, serviceId);
  }

  @Post(':serviceId')
  async addFavorite(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<ServiceFavorite> {
    return this.serviceFavoritesService.addFavorite(user.sub, serviceId);
  }

  @Delete(':serviceId')
  @HttpCode(204)
  async removeFavorite(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<string> {
    return this.serviceFavoritesService.removeFavorite(user.sub, serviceId);
  }
}
