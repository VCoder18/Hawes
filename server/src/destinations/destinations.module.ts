import { Module } from '@nestjs/common';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { SupabaseModule } from '../supabase/modules/SupabaseModule';

@Module({
  imports: [SupabaseModule.injectClient()],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}
