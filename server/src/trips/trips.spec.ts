import { Test } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { SupabaseModule } from 'src/supabase/modules/SupabaseModule';
import { ENV } from 'src/constants';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { createTestUser, deleteTestUser } from 'test/helpers/auth';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TripCreateDTO } from './dto/create.dto';
import { TripDifficulty, TripStatus } from './entities/trips.entity';

describe('TripsService', () => {
  let service: TripsService;
  let supabase: SupabaseClient<Database>; // service role
  let userSupabase: SupabaseClient<Database>; // authenticated user

  let jwt: string;
  let userId: string;
  let otherUserId: string;

  let createdTripId: string;

  const testTrips: TripCreateDTO[] = [
    {
      title: 'Hiking in Djurdjura',
      description: 'A scenic hike through the Djurdjura National Park.',
      difficulty: TripDifficulty.Easy,
      status: TripStatus.Draft,
      start_date: '2026-04-01',
      end_date: '2026-04-03',
      meeting_points: [],
      price: 5000,
      min_participants: 2,
      max_participants: 10,
      activities: ['hiking', 'photography'],
      what_to_bring: 'Water, snacks, sunscreen',
      itinerary: 'Day 1: arrival, Day 2: hike, Day 3: return',
    },
    {
      title: 'Sahara Desert Camp',
      description: 'Two nights camping under the stars in Tamanrasset.',
      difficulty: TripDifficulty.Easy,
      status: TripStatus.Draft,
      start_date: '2026-05-10',
      end_date: '2026-05-12',
      meeting_points: [],
      price: 15000,
      min_participants: 4,
      max_participants: 15,
      activities: ['camping', 'camel riding', 'stargazing'],
      what_to_bring: 'Warm clothes, sleeping bag, boots',
      itinerary:
        'Day 1: drive to camp, Day 2: desert exploration, Day 3: return',
    },
    {
      title: 'Kabylie Cultural Tour',
      description: 'Explore the villages and culture of Greater Kabylie.',
      difficulty: TripDifficulty.Easy,
      status: TripStatus.Draft,
      start_date: '2026-06-15',
      end_date: '2026-06-17',
      meeting_points: [],
      price: 3000,
      min_participants: 2,
      max_participants: 8,
      activities: ['sightseeing', 'local cuisine', 'hiking'],
      what_to_bring: 'Comfortable shoes, camera',
      itinerary: 'Day 1: Tizi Ouzou, Day 2: village tours, Day 3: return',
    },
  ];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        SupabaseModule.forRootAsync({
          imports: [],
          inject: [],
          useFactory: () => ({
            supabaseKey: ENV.supabase.serviceKey,
            supabaseUrl: ENV.supabase.url,
          }),
        }),
        SupabaseModule.injectClient(),
      ],
      providers: [TripsService],
    }).compile();

    service = module.get(TripsService);
    supabase = module.get(SupabaseClient<Database>);
    if (!service || !(service as any).supabaseClient || !supabase)
      throw new Error('failed to resolve module providers');

    ({
      access_token: jwt,
      user: { id: userId },
    } = await createTestUser(supabase, 'ctf@player.web'));
    userSupabase = createClient<Database>(
      ENV.supabase.url,
      ENV.supabase.anonKey,
    );
    await userSupabase.auth.setSession({
      access_token: jwt,
      refresh_token: '',
    });
    ({
      user: { id: otherUserId },
    } = await createTestUser(supabase, 'trips-other@example.com'));

    const { error, data } = await supabase
      .from('trips')
      .insert(testTrips.map((t) => ({ ...t, organizer: userId, images: [] })))
      .select();
    if (error || !data || data.length != testTrips.length)
      throw new Error('failed to insert test trips');

    createdTripId = data[0].id;
  });

  afterAll(async () => {
    await supabase.from('trips').delete().eq('organizer', userId);
    await supabase.from('trips').delete().eq('organizer', otherUserId);
    await deleteTestUser(supabase, userId);
    await deleteTestUser(supabase, otherUserId);
  });

  describe('getTrips', () => {
    // it('should return all trips', async () => {
    //   const trips = await service.getTrips();
    //   expect(trips).not.toBeNull();
    //   expect(Array.isArray(trips)).toBe(true);
    //   expect(trips.length).toBeGreaterThanOrEqual(3);
    // });
  });

  describe('getTripById', () => {
    it('should return a trip by id', async () => {
      const trip = await service.getTripById(createdTripId);
      expect(trip).not.toBeNull();
      expect(trip.id).toBe(createdTripId);
    });

    it('should throw NotFoundException for non-existent id', async () => {
      await expect(
        service.getTripById('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addTrip', () => {
    it('should create a trip', async () => {
      const newTrip: TripCreateDTO = {
        title: 'New Test Trip',
        difficulty: TripDifficulty.Easy,
        status: TripStatus.Draft,
        start_date: '2026-07-01',
        end_date: '2026-07-03',
        meeting_points: [],
      };

      const result = await service.addTrip(userId, newTrip);
      expect(result).toBeDefined();

      await supabase.from('trips').delete().eq('id', result.id);
    });
  });

  describe('updateTrip', () => {
    it('should update a trip', async () => {
      const updated = await service.updateTrip(userId, createdTripId, {
        title: 'Updated Title',
      });
      expect(updated.title).toBe('Updated Title');
    });

    it('should throw NotFoundException for non-existent trip', async () => {
      await expect(
        service.updateTrip(userId, '00000000-0000-0000-0000-000000000000', {
          title: 'x',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the organizer', async () => {
      await expect(
        service.updateTrip(otherUserId, createdTripId, { title: 'x' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteTrip', () => {
    it('should throw UnauthorizedException if user is not the organizer', async () => {
      await expect(
        service.deleteTrip(otherUserId, createdTripId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException for non-existent trip', async () => {
      await expect(
        service.deleteTrip(userId, '00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete a trip', async () => {
      const result = await service.deleteTrip(userId, createdTripId);
      expect(result).toBe(createdTripId);

      // verify it's gone
      await expect(service.getTripById(createdTripId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
