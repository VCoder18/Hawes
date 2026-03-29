import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SupabaseModule } from '../supabase/modules/SupabaseModule';

@Module({
  imports: [SupabaseModule.injectClient()],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
