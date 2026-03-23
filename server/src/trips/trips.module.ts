import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { SupabaseModule } from '../supabase/modules/SupabaseModule';

@Module({
  imports: [SupabaseModule.injectClient()],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
