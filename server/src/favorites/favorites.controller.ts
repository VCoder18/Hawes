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

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':destinationId')
  async addFavorite(
    @Param('destinationId') destinationId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.favoritesService.addFavorite(user.sub, destinationId);
  }

  @Delete(':destinationId')
  @HttpCode(204)
  async removeFavorite(
    @Param('destinationId') destinationId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.favoritesService.removeFavorite(user.sub, destinationId);
  }

  @Get()
  async getUserFavorites(@CurrentUser() user: SupabaseJWTPayload) {
    const favorites = await this.favoritesService.getUserFavorites(user.sub);
    return { favorites };
  }

  @Get(':destinationId')
  async isFavorited(
    @Param('destinationId') destinationId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    const isFavorited = await this.favoritesService.isFavorited(
      user.sub,
      destinationId,
    );
    return { isFavorited };
  }
}
