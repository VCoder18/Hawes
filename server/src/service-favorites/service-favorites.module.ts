import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/modules/SupabaseModule';
import { ServiceFavoritesController } from './service-favorites.controller';
import { ServiceFavoritesService } from './service-favorites.service';

@Module({
  imports: [SupabaseModule.injectClient()],
  controllers: [ServiceFavoritesController],
  providers: [ServiceFavoritesService],
})
export class ServiceFavoritesModule {}
