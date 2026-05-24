import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { SupabaseModule } from '../supabase/modules/SupabaseModule';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SupabaseModule.injectClient(), NotificationsModule],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
