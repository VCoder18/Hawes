import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/modules/SupabaseModule';
import { ENV } from './constants';
import { ConfigModule } from '@nestjs/config';
import { TripsModule } from './trips/trips.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        supabaseKey: ENV.supabase.serviceKey,
        supabaseUrl: ENV.supabase.url,
      }),
    }),
    TripsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
