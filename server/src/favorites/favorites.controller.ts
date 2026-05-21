import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorite.entity';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getUserFavorites(
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<Favorite[]> {
    return this.favoritesService.getUserFavorites(user.sub);
  }

  @Get(':destinationId')
  async getFavorite(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('destinationId') destinationId: string,
  ): Promise<boolean> {
    return this.favoritesService.isFavorited(user.sub, destinationId);
  }

  @Post(':destinationId')
  async addFavorite(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('destinationId') destinationId: string,
  ): Promise<Favorite> {
    return this.favoritesService.addFavorite(user.sub, destinationId);
  }

  @Delete(':destinationId')
  @HttpCode(204)
  async removeFavorite(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('destinationId') destinationId: string,
  ): Promise<string> {
    return this.favoritesService.removeFavorite(user.sub, destinationId);
  }
}
