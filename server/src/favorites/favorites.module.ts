import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/modules/SupabaseModule';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [SupabaseModule.injectClient()],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
