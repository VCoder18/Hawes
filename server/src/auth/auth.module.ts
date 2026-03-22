import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/modules/SupabaseModule';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [SupabaseModule.injectClient()],
  providers: [AuthGuard],
})
export class AuthModule {}
