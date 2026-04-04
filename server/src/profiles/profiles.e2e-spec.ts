/*
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  afterAll,
  beforeEach,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';
import request from 'supertest';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';

import { ENV } from 'src/constants';
import { UserRole } from './entities/profiles.entity';
import { createTestUser, deleteTestUser } from 'test/helpers/auth';
import { Database } from 'src/database.types';
import { AppModule } from 'src/app.module';

describe('ProfilesController (e2e)', () => {
  let app: INestApplication;
  let adminClient: SupabaseClient<Database>;
  let session: Session | undefined;

  beforeAll(async () => {
    adminClient = createClient(ENV.supabase.url, ENV.supabase.privateKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    session = await createTestUser(adminClient, `foo-${Date.now()}@bar.baz`);
    await adminClient
      .from('profiles')
      .update({
        bio: 'I like foo',
        display_name: 'Foo',
        location: 'Foo Street',
        social_links: ['https://social.link/foo'],
        role: 'traveler',
        confirmed: true,
        avatar_url: 'https://ui-avatars.com/api/?name=Foo',
        username: 'foo',
      })
      .eq('id', session.user.id);
  });

  afterEach(async () => {
    if (session) await deleteTestUser(adminClient, session.user.id);
  });

  describe('GET /profiles', () => {
    it('returns 401 when no token is provided', async () => {
      await request(app.getHttpServer()).get('/profiles').expect(401);
    });

    it('returns the authenticated user profile', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      const { body } = await request(app.getHttpServer())
        .get('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .expect(200);

      expect(body).toEqual({
        id: session.user.id,
        bio: 'I like foo',
        display_name: 'Foo',
        location: 'Foo Street',
        social_links: ['https://social.link/foo'],
        role: UserRole.TRAVELER,
        confirmed: true,
        avatar_url: 'https://ui-avatars.com/api/?name=Foo',
        username: 'foo',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });
  });

  describe('PATCH /profiles', () => {
    it('returns 401 when no token is provided', async () => {
      await request(app.getHttpServer())
        .patch('/profiles')
        .send({ display_name: 'Bar' })
        .expect(401);
    });

    it('updates allowed fields and returns the updated profile', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      const payload = {
        display_name: 'Bar',
        bio: 'Baz if my friend',
        location: 'Bar Street',
        role: UserRole.AGENCY,
        social_links: ['https://social.link/bar'],
        avatar_url: 'https://ui-avatars.com/api/?name=Bar',
      };

      const { body } = await request(app.getHttpServer())
        .patch('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .send(payload)
        .expect(200);

      expect(body).toEqual({
        id: session.user.id,
        bio: 'Baz if my friend',
        display_name: 'Bar',
        location: 'Bar Street',
        social_links: ['https://social.link/bar'],
        role: UserRole.AGENCY,
        confirmed: true,
        avatar_url: 'https://ui-avatars.com/api/?name=Bar',
        username: 'foo',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    it('accepts null to clear nullable fields', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      const { body } = await request(app.getHttpServer())
        .patch('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .send({ bio: null })
        .expect(200);

      expect(body).toEqual({
        id: session.user.id,
        bio: null,
        display_name: 'Foo',
        location: 'Foo Street',
        social_links: ['https://social.link/foo'],
        role: UserRole.TRAVELER,
        confirmed: true,
        avatar_url: 'https://ui-avatars.com/api/?name=Foo',
        username: 'foo',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    it('rejects unknown fields (forbidNonWhitelisted)', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      await request(app.getHttpServer())
        .patch('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .send({ username: 'baz' })
        .expect(400);
    });

    it('rejects display_name shorter than 2 characters', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      await request(app.getHttpServer())
        .patch('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .send({ display_name: 'b' })
        .expect(400);
    });

    it('rejects a bio longer than 512 characters', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      await request(app.getHttpServer())
        .patch('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .send({ bio: 'a'.repeat(513) })
        .expect(400);
    });

    it('rejects invalid social_links URLs', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      await request(app.getHttpServer())
        .patch('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .send({ social_links: ['not-a-url'] })
        .expect(400);
    });

    it('rejects an invalid role enum value', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      await request(app.getHttpServer())
        .patch('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .send({ role: 'ALIEN' })
        .expect(400);
    });
  });

  describe('DELETE /profiles', () => {
    it('returns 401 when no token is provided', async () => {
      await request(app.getHttpServer()).delete('/profiles').expect(401);
    });

    it('deletes the authenticated user and returns success', async () => {
      if (!session) throw new Error('Session cannot be undefined');

      await request(app.getHttpServer())
        .delete('/profiles')
        .set('Authorization', `Bearer ${session.access_token}`)
        .expect(200);

      const { data } = await adminClient
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      expect(data).toBeNull();

      session = undefined;
    });
  });
});
*/
