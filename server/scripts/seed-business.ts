import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

const SUPABASE_URL = getEnv('SUPABASE_PROJECT_URL');
const SERVICE_KEY = getEnv('SUPABASE_SERVICE_KEY');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log('Seeding business overview mock data...\n');

  // ── 1. Create test auth user (service owner) ──
  const ownerEmail = 'business@hawes.test';
  const ownerPassword = 'Test1234!';

  const { data: existingUsers, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) throw new Error(`Failed to list users: ${listErr.message}`);

  const existing = existingUsers?.users.find((u) => u.email === ownerEmail);
  let ownerId: string;

  if (existing) {
    ownerId = existing.id;
    console.log(`Owner user already exists: ${ownerId}`);
  } else {
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
    });
    if (createErr) throw new Error(`Failed to create user: ${createErr.message}`);
    ownerId = newUser!.user.id;
    console.log(`Created owner user: ${ownerId}`);
  }

  // ── 2. Upsert profile ──
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: ownerId,
    display_name: 'Sahara Expeditions',
    username: 'sahara_expeditions',
    role: 'services',
    bio: 'Premium travel services across Algeria — desert treks, mountain guides, and cultural tours.',
    avatar_url: null,
    banner_url: null,
    confirmed: true,
    location: 'Algiers, Algeria',
  });
  if (profileErr) throw new Error(`Profile upsert failed: ${profileErr.message}`);
  console.log('Profile upserted');

  // ── 3. Create some client profiles (for reviews / bookings) ──
  const clientEmails = [
    'client1@hawes.test',
    'client2@hawes.test',
    'client3@hawes.test',
    'client4@hawes.test',
    'client5@hawes.test',
  ];

  const clientIds: string[] = [];

  for (const email of clientEmails) {
    const existingClient = existingUsers?.users.find((u) => u.email === email);
    if (existingClient) {
      clientIds.push(existingClient.id);
      continue;
    }
    const { data: c, error: ce } = await supabase.auth.admin.createUser({
      email,
      password: 'Test1234!',
      email_confirm: true,
    });
    if (ce) {
      console.warn(`  Skipping ${email}: ${ce.message}`);
      continue;
    }
    clientIds.push(c!.user.id);
  }

  // Upsert client profiles
  const clientProfiles = clientIds.map((id, i) => ({
    id,
    display_name: `Explorer ${i + 1}`,
    username: `explorer${i + 1}`,
    role: 'traveler' as const,
    confirmed: true,
  }));
  const { error: cpErr } = await supabase.from('profiles').upsert(clientProfiles);
  if (cpErr) console.warn('  Client profile upsert warnings:', cpErr.message);
  console.log(`  ${clientIds.length} client profiles ready`);

  // ── 4. Insert services ──
  const services = [
    {
      owner_id: ownerId,
      name: 'Hoggar Desert Camp',
      category: 'accommodation',
      status: 'Available',
      client_limit: 30,
      min_cost: 3500,
      max_cost: 8500,
      monthly_revenue: 12500,
      yearly_revenue: 150000,
      current_revenue: 32000,
      description: 'Luxury desert camp in the heart of the Hoggar massif with traditional Tuareg tents.',
      address: 'Tamanrasset, Algeria',
      location: 'SRID=4326;POINT(5.5 22.8)' as unknown,
      availability: ['weekend'],
      details_informations: [],
      procedure: {},
      procedure_info: [],
    },
    {
      owner_id: ownerId,
      name: 'Atlas Mountain Guides',
      category: 'guides',
      status: 'Available',
      client_limit: 50,
      min_cost: 2000,
      max_cost: 6000,
      monthly_revenue: 18000,
      yearly_revenue: 216000,
      current_revenue: 45000,
      description: 'Expert mountain guides for trekking and climbing expeditions across the Atlas range.',
      address: 'Blida, Algeria',
      location: 'SRID=4326;POINT(2.8 36.5)' as unknown,
    },
    {
      owner_id: ownerId,
      name: 'Coastal Transport Service',
      category: 'transportation',
      status: 'Available',
      client_limit: 100,
      min_cost: 1500,
      max_cost: 4000,
      monthly_revenue: 8500,
      yearly_revenue: 102000,
      current_revenue: 21000,
      description: 'Comfortable 4x4 and minibus transport along Algeria\'s Mediterranean coast.',
      address: 'Algiers, Algeria',
      location: 'SRID=4326;POINT(3.0 36.7)' as unknown,
    },
    {
      owner_id: ownerId,
      name: 'Oasis Restaurant & Catering',
      category: 'restauration',
      status: 'Available',
      client_limit: 40,
      min_cost: 1200,
      max_cost: 3500,
      monthly_revenue: 9500,
      yearly_revenue: 114000,
      current_revenue: 24000,
      description: 'Authentic Algerian cuisine — tagines, couscous, and fresh local produce.',
      address: 'Ghardaïa, Algeria',
      location: 'SRID=4326;POINT(3.7 32.5)' as unknown,
    },
    {
      owner_id: ownerId,
      name: 'Tassili Photo Safari',
      category: 'guides',
      status: 'Available',
      client_limit: 15,
      min_cost: 5000,
      max_cost: 12000,
      monthly_revenue: 6000,
      yearly_revenue: 72000,
      current_revenue: 15000,
      description: 'Photography-focused expeditions with a professional wildlife and landscape photographer.',
      address: 'Djanet, Algeria',
      location: 'SRID=4326;POINT(9.5 24.5)' as unknown,
      availability: ['weekend'],
      details_informations: [],
      procedure: {},
      procedure_info: [],
    },
  ];

  // Delete any existing services for this owner first, then insert fresh
  const { error: delSvcErr } = await supabase.from('services').delete().eq('owner_id', ownerId);
  if (delSvcErr) console.warn('  Could not clear existing services:', delSvcErr.message);

  const { data: insertedServices, error: svcErr } = await supabase
    .from('services')
    .insert(services)
    .select();

  if (svcErr) throw new Error(`Failed to insert services: ${svcErr.message}`);
  const serviceIds = insertedServices!.map((s) => s.id);
  console.log(`Inserted ${serviceIds.length} services`);

  // ── 5. Insert service reviews ──
  const reviewTemplates = [
    { rating: 5, description: 'Absolutely incredible experience! The guides were knowledgeable and the scenery breathtaking.' },
    { rating: 4, description: 'Great service overall. Very professional team and beautiful locations.' },
    { rating: 5, description: 'Exceeded all expectations. Would highly recommend to any traveler.' },
    { rating: 3, description: 'Good but could improve on organization. The facilities were decent.' },
    { rating: 4, description: 'Very good value for money. The staff was friendly and helpful.' },
    { rating: 5, description: 'Unforgettable trip. Every detail was taken care of perfectly.' },
    { rating: 4, description: 'Solid experience. Comfortable accommodations and good food.' },
    { rating: 2, description: 'Average experience. Some logistical issues but the location was amazing.' },
  ];

  const reviews: { service_id: number; author_id: string; rating: number; description: string }[] = [];
  for (const sid of serviceIds) {
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 reviews per service
    for (let i = 0; i < count; i++) {
      const template = reviewTemplates[(sid * 7 + i * 3) % reviewTemplates.length];
      reviews.push({
        service_id: sid,
        author_id: clientIds[i % clientIds.length],
        rating: template.rating,
        description: template.description,
      });
    }
  }

  const { error: revErr } = await supabase.from('service_reviews').insert(reviews);
  if (revErr) console.warn('  Review insert warnings:', revErr.message);
  else console.log(`Inserted ${reviews.length} reviews`);

  // ── 6. Insert service bookings ──
  const bookings: { service_id: number; profile_id: string }[] = [];
  for (const sid of serviceIds) {
    const count = 3 + Math.floor(Math.random() * 6); // 3-8 bookings per service
    for (let i = 0; i < count; i++) {
      bookings.push({
        service_id: sid,
        profile_id: clientIds[(sid * 5 + i * 7) % clientIds.length],
      });
    }
  }

  const { error: bkErr } = await supabase.from('service_bookings').insert(bookings);
  if (bkErr) console.warn('  Booking insert warnings:', bkErr.message);
  else console.log(`Inserted ${bookings.length} bookings`);

  // ── 7. Create trips and trip participants ──
  // Delete any existing trips for this organizer first
  const { error: delTripErr } = await supabase.from('trips').delete().eq('organizer', ownerId);
  if (delTripErr) console.warn('  Could not clear existing trips:', delTripErr.message);
  const trips = [
    {
      organizer: ownerId,
      title: 'Hoggar Circuit',
      description: 'A 7-day loop through the Hoggar massif visiting mountain camps and ancient sites.',
      category: 'adventure',
      difficulty: 'moderate',
      status: 'published',
      visibility: 'public',
      start_date: '2026-06-01',
      end_date: '2026-06-08',
      price: 45000,
      max_participants: 12,
      min_participants: 4,
      images: [],
    },
    {
      organizer: ownerId,
      title: 'Coastal Discovery',
      description: 'Explore Algeria\'s stunning Mediterranean coastline from Algiers to Oran.',
      category: 'cultural',
      difficulty: 'easy',
      status: 'published',
      visibility: 'public',
      start_date: '2026-07-10',
      end_date: '2026-07-15',
      price: 32000,
      max_participants: 20,
      min_participants: 6,
      images: [],
    },
    {
      organizer: ownerId,
      title: 'Tassili Photography Expedition',
      description: 'Photography-focused trek through the Tassili n\'Ajjer with expert guidance.',
      category: 'photography',
      difficulty: 'challenging',
      status: 'published',
      visibility: 'public',
      start_date: '2026-09-05',
      end_date: '2026-09-14',
      price: 80000,
      max_participants: 8,
      min_participants: 3,
      images: [],
    },
  ];

  const { data: insertedTrips, error: tripErr } = await supabase
    .from('trips')
    .insert(trips)
    .select();

  if (tripErr) throw new Error(`Failed to insert trips: ${tripErr.message}`);
  const tripIds = insertedTrips!.map((t) => t.id);
  console.log(`Inserted ${tripIds.length} trips`);

  // ── 8. Insert trip_stops linking services to trips ──
  const tripStops = [
    { trip: tripIds[0], service: serviceIds[0], label: 'Hoggar Desert Camp', index: 0, type: 'service' },
    { trip: tripIds[0], service: serviceIds[1], label: 'Mountain Guide', index: 2, type: 'service' },
    { trip: tripIds[1], service: serviceIds[2], label: 'Coastal Transport', index: 0, type: 'service' },
    { trip: tripIds[1], service: serviceIds[3], label: 'Oasis Restaurant', index: 3, type: 'service' },
    { trip: tripIds[2], service: serviceIds[4], label: 'Photo Safari Guide', index: 0, type: 'service' },
    { trip: tripIds[2], service: serviceIds[0], label: 'Desert Camp Stay', index: 2, type: 'service' },
  ];

  const { error: stopsErr } = await supabase.from('trip_stops').insert(tripStops);
  if (stopsErr) console.warn('  Trip stops warnings:', stopsErr.message);
  else console.log(`Inserted ${tripStops.length} trip stops`);

  // ── 9. Insert trip participants ──
  const participants: { trip_id: string; user_id: string }[] = [];
  for (const tid of tripIds) {
    const count = 3 + Math.floor(Math.random() * 5); // 3-7 participants per trip
    for (let i = 0; i < count; i++) {
      participants.push({
        trip_id: tid,
        user_id: clientIds[(tripIds.indexOf(tid) * 7 + i * 3) % clientIds.length],
      });
    }
  }

  const { error: partErr } = await supabase.from('trip_participants').insert(participants);
  if (partErr) console.warn('  Participant insert warnings:', partErr.message);
  else console.log(`Inserted ${participants.length} trip participants`);

  console.log('\n✓ Seeding complete!');
  console.log(`\nTest login credentials:`);
  console.log(`  Email:    ${ownerEmail}`);
  console.log(`  Password: ${ownerPassword}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
