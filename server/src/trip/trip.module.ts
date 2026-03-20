import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { SupabaseModule } from 'src/modules/SupabaseModule';

@Module({
  imports: [SupabaseModule.injectClient()],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
