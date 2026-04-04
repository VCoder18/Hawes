import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/modules/SupabaseModule';
import { ENV } from './constants';
import { TripsModule } from './trips/trips.module';
import { AuthModule } from './auth/auth.module';
import { DestinationsModule } from './destinations/destinations.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    SupabaseModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        supabaseKey: ENV.supabase.serviceKey,
        supabaseUrl: ENV.supabase.url,
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    TripsModule,
    DestinationsModule,
    ProfilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
