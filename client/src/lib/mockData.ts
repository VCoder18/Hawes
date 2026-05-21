/**
 * Client-side mock data loader
 * This file provides mock data functions for the frontend
 */

// Mock data types
export interface TripStop {
  id: string;
  trip_id: string;
  stop_type: string;
  destination_id: string | null;
  location: { lat: number; lng: number } | null;
  label: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Trip {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string;
  start_date: string;
  end_date: string;
  price: number | null;
  min_price?: number | null;
  max_price?: number | null;
  max_participants: number | null;
  min_participants: number | null;
  current_participants?: number | null;
  return_route?: boolean;
  organizer?: string;
  stops?: TripStop[];
  itinerary?: string[];
  activities?: string[];
  included?: string[];
  not_included?: string[];
  what_to_bring?: string[];
  images?: string[];
  [key: string]: unknown;
}

const LOCAL_TRIPS_STORAGE_KEY = "hawes_local_mock_trips";

// Mock trip data
const mockTrips: Trip[] = [
  {
    id: "trip-1",
    title: "Desert Adventure in Tassili n'Ajjer",
    description:
      "Explore one of the most spectacular rock formations in Africa. Trek through ancient plateaus, discover prehistoric cave paintings, and experience authentic Tuareg culture under the stars.",
    category: "desert",
    difficulty: "Moderate",
    start_date: "2026-05-15",
    end_date: "2026-05-22",
    price: 1200,
    min_price: 1100,
    max_price: 1350,
    max_participants: 15,
    min_participants: 8,
    current_participants: 5,
    return_route: true,
    organizer: "Ahmed_Berber",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    stops: [
      {
        id: "stop-1",
        trip_id: "trip-1",
        stop_type: "meeting",
        destination_id: null,
        location: { lat: 24.2465, lng: 9.5000 },
        label: "Djanet, Algeria",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-2",
        trip_id: "trip-1",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 24.5000, lng: 8.5000 },
        label: "Tassili n'Ajjer Plateau",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-5",
        trip_id: "trip-1",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 24.6500, lng: 8.2000 },
        label: "Tamit Canyon",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-6",
        trip_id: "trip-1",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 24.7200, lng: 8.0000 },
        label: "Jabu Rock Art Site",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-7",
        trip_id: "trip-1",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 24.8000, lng: 7.8000 },
        label: "Archei Natural Arch",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-8",
        trip_id: "trip-1",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 24.9000, lng: 7.5000 },
        label: "Tamanrasset Valley",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-9",
        trip_id: "trip-1",
        stop_type: "meeting",
        destination_id: null,
        location: { lat: 24.2465, lng: 9.5000 },
        label: "Return to Djanet",
        created_at: null,
        updated_at: null,
      },
    ],
    itinerary: [
      "Arrival in Djanet\nMeet your guide and acclimate to the desert climate. Visit the local market and enjoy a welcome dinner.",
      "Trek to Tamanrasset Canyon\nHike through stunning rock formations and discover ancient cave paintings dating back 10,000 years.",
      "Plateau Exploration\nExplore the vast Tassili plateau, visit natural arches, and camp under the stars.",
      "Return and Departure\nBegin your journey back to Djanet with stops at scenic viewpoints.",
    ],
    activities: [
      "Trekking",
      "Rock Climbing",
      "Photography",
      "Cultural Exchange",
      "Stargazing",
    ],
    included: [
      "Professional guide",
      "Accommodation (camps & guesthouses)",
      "All meals",
      "2WD vehicle transfers",
      "Travel insurance",
    ],
    not_included: [
      "International flights",
      "Travel to Djanet",
      "Personal equipment",
      "Optional activities",
    ],
    what_to_bring: [
      "Lightweight hiking gear",
      "Sun protection (hat, sunscreen)",
      "Warm clothing for cold nights",
      "Sturdy hiking boots",
      "Water bottle (minimum 2L)",
      "Camera",
      "Medications",
    ],
  },
  {
    id: "trip-2",
    title: "Sahara Sand Dunes Adventure in Erg Chech",
    description:
      "Experience the vast golden sand dunes of Erg Chech. Enjoy camel trekking, watch stunning sunsets, and experience the magic of sleeping under the stars in a traditional Tuareg camp.",
    category: "desert",
    difficulty: "Easy",
    start_date: "2026-06-10",
    end_date: "2026-06-17",
    price: 950,
    min_price: 900,
    max_price: 1050,
    max_participants: 16,
    min_participants: 6,
    current_participants: 7,
    organizer: "Karim_Nomad",
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    ],
    stops: [
      {
        id: "stop-3",
        trip_id: "trip-2",
        stop_type: "meeting",
        destination_id: null,
        location: { lat: 26.9124, lng: 0.6421 },
        label: "Adrar, Algeria",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-4",
        trip_id: "trip-2",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 25.5000, lng: 0.0000 },
        label: "Erg Chech Dunes",
        created_at: null,
        updated_at: null,
      },
    ],
    itinerary: [
      "Arrival in Adrar\nMeet your guides and prepare for your desert adventure. Explore the local market.",
      "Camel Trekking Begins\nStart your journey into the golden dunes of Erg Chech with experienced guides.",
      "Desert Camp Experience\nSettle in a traditional Tuareg camp under the stars with authentic meals.",
      "Return to Adrar\nJourney back with memorable desert experiences.",
    ],
    activities: [
      "Camel Trekking",
      "Stargazing",
      "Desert Photography",
      "Cultural Immersion",
      "Sunset Viewing",
    ],
    included: [
      "Camel rental and handler",
      "Traditional desert camp",
      "All meals",
      "Professional guides",
      "Bedouin hospitality",
    ],
    not_included: [
      "Travel to Adrar",
      "Personal desert gear",
      "Beverages",
      "Tips",
    ],
    what_to_bring: [
      "Sun protection",
      "Light, breathable clothing",
      "Headscarf or turban",
      "Sturdy boots",
      "Water bottles",
      "Camera",
    ],
  },
  {
    id: "trip-3",
    title: "Hoggar Mountains Trekking Expedition",
    description:
      "Trek through the dramatic Hoggar Mountains in southern Algeria. Discover ancient rock formations, meet Tuareg communities, and experience breathtaking mountain landscapes.",
    category: "mountain",
    difficulty: "Hard",
    start_date: "2026-07-01",
    end_date: "2026-07-08",
    price: 1400,
    min_price: 1300,
    max_price: 1600,
    max_participants: 12,
    min_participants: 5,
    current_participants: 4,
    organizer: "Zara_Mountain",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    stops: [
      {
        id: "stop-5",
        trip_id: "trip-3",
        stop_type: "meeting",
        destination_id: null,
        location: { lat: 23.0469, lng: 5.5272 },
        label: "Tamanrasset, Algeria",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-6",
        trip_id: "trip-3",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 23.3667, lng: 5.5000 },
        label: "Hoggar Mountains",
        created_at: null,
        updated_at: null,
      },
    ],
    itinerary: [
      "Arrival in Tamanrasset\nArrive in the heart of the Sahara. Meet your mountain guides and acclimatize.",
      "Mountain Trek Begins\nStart your trek through stunning rock formations and canyons.",
      "Mount Atakoor Summit\nClimb to one of the highest peaks with panoramic views.",
      "Return and Celebration\nDescend with final views and celebrate your achievement.",
    ],
    activities: [
      "Mountain Trekking",
      "Rock Climbing",
      "Photography",
      "Cultural Tours",
      "Stargazing",
    ],
    included: [
      "Mountain guides",
      "Camp accommodation",
      "All meals",
      "Climbing equipment",
      "Transportation",
    ],
    not_included: [
      "Flight to Tamanrasset",
      "Personal gear",
      "Travel insurance",
      "Optional guides",
    ],
    what_to_bring: [
      "Hiking boots",
      "Layers for cold nights",
      "Sun protection",
      "Water containers",
      "Trekking poles",
      "Camera",
    ],
  },
  {
    id: "trip-4",
    title: "Coastal Adventure in Oran",
    description:
      "Explore Algeria's Mediterranean coast. Visit historic sites, enjoy beach activities, taste local cuisine, and experience the vibrant culture of coastal cities.",
    category: "beach",
    difficulty: "Easy",
    start_date: "2026-05-20",
    end_date: "2026-05-27",
    price: 850,
    min_price: 800,
    max_price: 950,
    max_participants: 20,
    min_participants: 8,
    current_participants: 9,
    organizer: "Layla_Coast",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    stops: [
      {
        id: "stop-7",
        trip_id: "trip-4",
        stop_type: "meeting",
        destination_id: null,
        location: { lat: 35.7333, lng: -0.6333 },
        label: "Oran, Algeria",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-8",
        trip_id: "trip-4",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 35.6500, lng: -0.7000 },
        label: "Mediterranean Coast",
        created_at: null,
        updated_at: null,
      },
    ],
    itinerary: [
      "Welcome to Oran\nExplore the historic medina and scenic fort views.",
      "Beach Days\nRelax on beautiful Mediterranean beaches.",
      "Cultural Exploration\nVisit local markets, museums, and historic landmarks.",
      "Farewell Dinner\nCelebrate with traditional Algerian coastal cuisine.",
    ],
    activities: [
      "Beach Relaxation",
      "Swimming",
      "Cultural Tours",
      "Local Cuisine",
      "Photography",
    ],
    included: [
      "Hotel accommodation",
      "Breakfast and dinner",
      "Beach access",
      "Guided tours",
      "Transportation",
    ],
    not_included: [
      "Flights",
      "Travel insurance",
      "Lunch and beverages",
      "Optional activities",
    ],
    what_to_bring: [
      "Swimwear",
      "Sun protection",
      "Light clothing",
      "Comfortable shoes",
      "Hat and sunglasses",
      "Camera",
    ],
  },
  {
    id: "trip-5",
    title: "Constantine Historic City Tour",
    description:
      "Discover Algeria's historic jewel, Constantine. Walk through ancient medinas, visit historic bridges spanning dramatic gorges, and experience the rich cultural heritage of this ancient city.",
    category: "cultural",
    difficulty: "Easy",
    start_date: "2026-04-15",
    end_date: "2026-04-20",
    price: 650,
    min_price: 600,
    max_price: 750,
    max_participants: 25,
    min_participants: 10,
    current_participants: 8,
    organizer: "Rashid_Heritage",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    ],
    stops: [
      {
        id: "stop-9",
        trip_id: "trip-5",
        stop_type: "meeting",
        destination_id: null,
        location: { lat: 36.3650, lng: 6.6147 },
        label: "Constantine, Algeria",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-10",
        trip_id: "trip-5",
        stop_type: "destination",
        destination_id: null,
        location: { lat: 36.3600, lng: 6.6200 },
        label: "Historic Medina",
        created_at: null,
        updated_at: null,
      },
    ],
    itinerary: [
      "Arrival and Orientation\nWelcome to Constantine, explore your accommodation and surrounding areas.",
      "Medina Exploration\nWander through narrow streets, visit historic markets and ancient sites.",
      "Bridge Tours\nVisit iconic bridges with stunning gorge views.",
      "Museum and Culture\nExplore museums and learn about Constantine's rich history.",
      "Farewell\nFinal explorations and goodbyes in this historic city.",
    ],
    activities: [
      "Historical Tours",
      "Medina Walking",
      "Bridge Viewing",
      "Museum Visits",
      "Local Cuisine",
    ],
    included: [
      "Hotel accommodation",
      "Daily breakfast",
      "Guided tours",
      "Museum entries",
      "Transportation",
    ],
    not_included: [
      "Flights",
      "Travel insurance",
      "Meals beyond breakfast",
      "Additional activities",
    ],
    what_to_bring: [
      "Comfortable walking shoes",
      "Light, modest clothing",
      "Sun protection",
      "Camera",
      "Water bottle",
      "Hat",
    ],
  },
];

function readLocalMockTrips(): Trip[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_TRIPS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Trip[]) : [];
  } catch {
    return [];
  }
}

function writeLocalMockTrips(trips: Trip[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LOCAL_TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch {
    // Ignore storage write failures and keep in-memory mock behavior.
  }
}

function getMockTrips(): Trip[] {
  const localTrips = readLocalMockTrips();
  return [...localTrips, ...mockTrips];
}

export function addMockTrip(trip: Trip): Trip {
  const localTrips = readLocalMockTrips();
  const withoutSameId = localTrips.filter((existing) => existing.id !== trip.id);
  const nextLocalTrips = [trip, ...withoutSameId];
  writeLocalMockTrips(nextLocalTrips);
  return trip;
}

export function getAllTrips(limit: number = 12, offset: number = 0) {
  const allTrips = getMockTrips();
  const total = allTrips.length;
  const data = allTrips.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return {
    data,
    total,
    hasMore,
  };
}

export function getTripById(id: string) {
  return getMockTrips().find((t) => t.id === id) || null;
}

export function searchTrips(query: string, limit: number = 12, offset: number = 0) {
  const filtered = getMockTrips().filter(
    (trip) =>
      trip.title.toLowerCase().includes(query.toLowerCase()) ||
      trip.description?.toLowerCase().includes(query.toLowerCase()) ||
      trip.category?.toLowerCase().includes(query.toLowerCase())
  );

  const total = filtered.length;
  const data = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return {
    data,
    total,
    hasMore,
  };
}

export function filterTrips(
  filters: Record<string, any>,
  limit: number = 12,
  offset: number = 0
) {
  let filtered = getMockTrips();

  if (filters.category?.value) {
    filtered = filtered.filter(
      (t) => t.category?.toLowerCase() === filters.category.value.toLowerCase()
    );
  }

  if (filters.difficulty?.value) {
    filtered = filtered.filter(
      (t) => t.difficulty?.toLowerCase() === filters.difficulty.value.toLowerCase()
    );
  }

  if (filters.price?.value) {
    const [minPrice, maxPrice] = filters.price.value.split(":").map(Number);
    filtered = filtered.filter(
      (t) => (t.price || 0) >= minPrice && (t.price || 0) <= maxPrice
    );
  }

  if (filters.start_date?.value) {
    const filterDate = new Date(filters.start_date.value);
    filtered = filtered.filter((t) => new Date(t.start_date) >= filterDate);
  }

  if (filters.available_spots?.value) {
    const minSpots = filters.available_spots.value;
    filtered = filtered.filter(
      (t) => ((t.max_participants || 0) - (t.min_participants || 0)) >= minSpots
    );
  }

  if (filters.min_destinations?.value) {
    const minDestinations = filters.min_destinations.value;
    filtered = filtered.filter((t) => (t.stops?.length || 0) >= minDestinations);
  }

  const total = filtered.length;
  const data = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return {
    data,
    total,
    hasMore,
  };
}
