/**
 * Mock Data for Hawes Application
 * This file provides mock trip data for frontend development
 * while the backend API is being designed
 */

export interface TripStop {
  id: string;
  trip_id: string;
  stop_order: number;
  stop_type: string;
  destination_id: string | null;
  location: unknown;
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
  cover_image: string | null;
  start_date: string;
  end_date: string;
  price: number | null;
  max_participants: number | null;
  min_participants: number | null;
  stops?: TripStop[];
  destinations?: string[];
  itinerary?: string[];
  activities?: string[];
  included?: string[];
  not_included?: string[];
  what_to_bring?: string[];
  images?: string[];
  [key: string]: unknown;
}

// Mock trip data for list view
export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    title: "Desert Adventure in Tassili n'Ajjer",
    description:
      "Explore one of the most spectacular rock formations in Africa. Trek through ancient plateaus, discover prehistoric cave paintings, and experience authentic Tuareg culture under the stars.",
    category: "desert",
    difficulty: "Moderate",
    cover_image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    start_date: "2026-05-15",
    end_date: "2026-05-22",
    price: 1200,
    max_participants: 15,
    min_participants: 8,
    stops: [
      {
        id: "stop-1",
        trip_id: "trip-1",
        stop_order: 1,
        stop_type: "meeting",
        destination_id: null,
        location: null,
        label: "Djanet, Algeria",
        created_at: null,
        updated_at: null,
      },
      {
        id: "stop-2",
        trip_id: "trip-1",
        stop_order: 2,
        stop_type: "destination",
        destination_id: null,
        location: null,
        label: "Tassili n'Ajjer Plateau",
        created_at: null,
        updated_at: null,
      },
    ],
    destinations: ["Djanet, Algeria", "Tassili n'Ajjer"],
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
    title: "Amazon Rainforest Expedition",
    description:
      "Discover the world's largest rainforest. Navigate the mighty Amazon River, spot exotic wildlife, and learn about sustainable tourism from expert naturalists.",
    category: "jungle",
    difficulty: "Hard",
    cover_image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    start_date: "2026-06-10",
    end_date: "2026-06-20",
    price: 1800,
    max_participants: 12,
    min_participants: 6,
    stops: [
      {
        id: "stop-3",
        trip_id: "trip-2",
        stop_order: 1,
        stop_type: "meeting",
        destination_id: null,
        location: null,
        label: "Iquitos, Peru",
        created_at: null,
        updated_at: null,
      },
    ],
    destinations: ["Iquitos, Peru", "Amazon River"],
    itinerary: [
      "Arrival and Orientation\nFly into Iquitos and board your riverboat. Settle in and meet fellow adventurers.",
      "River Navigation\nCruise upstream spotting pink river dolphins, macaws, and other wildlife.",
      "Jungle Trek\nHike through dense jungle with expert guides identifying species and ecosystems.",
      "Cultural Village Visit\nMeet indigenous communities and learn about their traditions.",
      "Return Journey\nFinal spotting opportunities before heading back to Iquitos.",
    ],
    activities: [
      "River Cruising",
      "Wildlife Spotting",
      "Jungle Trekking",
      "Cultural Immersion",
      "Photography",
    ],
    included: [
      "Riverboat accommodation",
      "All meals",
      "Expert naturalist guides",
      "Jungle lodge stays",
      "Park entrance fees",
    ],
    not_included: [
      "International flights",
      "Travel insurance",
      "Alcoholic beverages",
      "Souvenir purchases",
    ],
    what_to_bring: [
      "High-SPF sunscreen",
      "Insect repellent",
      "Waterproof bags",
      "Quick-dry clothing",
      "Binoculars",
      "Headlamp",
    ],
  },
  {
    id: "trip-3",
    title: "Mount Kilimanjaro Climbing Challenge",
    description:
      "Climb Africa's highest peak. A challenging but rewarding journey to 5,895m with acclimatization stages and experienced mountaineering support.",
    category: "mountain",
    difficulty: "Expert",
    cover_image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    start_date: "2026-07-01",
    end_date: "2026-07-08",
    price: 2500,
    max_participants: 10,
    min_participants: 4,
    stops: [
      {
        id: "stop-5",
        trip_id: "trip-3",
        stop_order: 1,
        stop_type: "meeting",
        destination_id: null,
        location: null,
        label: "Moshi, Tanzania",
        created_at: null,
        updated_at: null,
      },
    ],
    destinations: ["Moshi, Tanzania", "Mount Kilimanjaro"],
    itinerary: [
      "Arrival in Tanzania\nArrive in Moshi and prepare climbing equipment with your experienced guides.",
      "Gate to Camp\nStart your trek from the Marangu Gate to Mandara Hut.",
      "Acclimatization Days\nAcclimatize while trekking through different zones (rainforest, moorland).",
      "Summit Push\nEarly morning departure for the summit push. Reach Uhuru Peak at sunrise.",
      "Descent and Rest\nDescend to Horombo Hut and rest before the final descent.",
      "Return\nFinal descent to the gate and return to Moshi with certificates.",
    ],
    activities: [
      "Mountain Climbing",
      "Trekking",
      "Acclimatization Training",
      "Sunrise Photography",
    ],
    included: [
      "Mount climbing fees",
      "Professional mountain guides",
      "Porters",
      "Accommodation in mountain huts",
      "All meals",
      "Climbing permits",
    ],
    not_included: [
      "International flights",
      "Travel insurance",
      "Pre-climb training",
      "Personal climbing gear",
    ],
    what_to_bring: [
      "Layered clothing",
      "Trekking boots (broken in)",
      "Altitude sickness medication",
      "Thermal sleeping bag",
      "Hiking poles",
      "Hat and gloves",
      "Sunglasses",
    ],
  },
  {
    id: "trip-4",
    title: "Norwegian Fjords Hiking Adventure",
    description:
      "Experience the majestic fjords of Norway. Hike through stunning mountain landscapes, stay in cozy mountain lodges, and witness the midnight sun.",
    category: "mountain",
    difficulty: "Easy",
    cover_image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    start_date: "2026-06-15",
    end_date: "2026-06-25",
    price: 1500,
    max_participants: 20,
    min_participants: 10,
    stops: [
      {
        id: "stop-7",
        trip_id: "trip-4",
        stop_order: 1,
        stop_type: "meeting",
        destination_id: null,
        location: null,
        label: "Bergen, Norway",
        created_at: null,
        updated_at: null,
      },
    ],
    destinations: ["Bergen, Norway", "Geirangerfjord", "Sognefjord"],
    itinerary: [
      "Arrival in Bergen\nExplore the colorful Bryggen wharf and acclimate.",
      "Geirangerfjord\nHike along the fjord with spectacular views of waterfalls.",
      "Mountain Ridge Walk\nWalk along mountain ridges with panoramic fjord views.",
      "Sognefjord\nExplore Norway's longest and deepest fjord.",
      "Return Journey\nFinal day of exploration before returning to Bergen.",
    ],
    activities: [
      "Hiking",
      "Photography",
      "Scenic Viewpoints",
      "Cultural Tours",
      "Dining",
    ],
    included: [
      "Mountain lodge accommodations",
      "Breakfast and dinner",
      "Professional guides",
      "Transportation between locations",
      "Activity fees",
    ],
    not_included: [
      "International flights",
      "Travel insurance",
      "Lunch",
      "Optional activities",
    ],
    what_to_bring: [
      "Waterproof jacket",
      "Hiking boots",
      "Warm layers",
      "Rain pants",
      "Comfortable walking shoes",
      "Camera",
    ],
  },
  {
    id: "trip-5",
    title: "Moroccan Desert & Medina Experience",
    description:
      "Immerse yourself in Moroccan culture. Explore ancient medinas, ride camels in the Sahara Desert, and stay with local families.",
    category: "desert",
    difficulty: "Easy",
    cover_image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    start_date: "2026-04-20",
    end_date: "2026-04-28",
    price: 950,
    max_participants: 18,
    min_participants: 8,
    stops: [
      {
        id: "stop-9",
        trip_id: "trip-5",
        stop_order: 1,
        stop_type: "meeting",
        destination_id: null,
        location: null,
        label: "Marrakech, Morocco",
        created_at: null,
        updated_at: null,
      },
    ],
    destinations: ["Marrakech", "Fez", "Sahara Desert"],
    itinerary: [
      "Marrakech Exploration\nTour the bustling Jemaa el-Fnaa square and historic medina.",
      "Atlas Mountains\nDrive through the beautiful Atlas Mountains to a Berber village.",
      "Sahara Experience\nCamel trekking and overnight in a traditional desert camp.",
      "Fez Medina\nExplore the world's oldest continuously inhabited city.",
      "Return to Marrakech\nFinal shopping and exploration before departure.",
    ],
    activities: [
      "Cultural Tours",
      "Camel Trekking",
      "Medina Exploration",
      "Traditional Cooking",
      "Shopping",
    ],
    included: [
      "Riads (traditional house) accommodation",
      "Breakfast daily",
      "Guided tours",
      "Camel trekking",
      "Desert camp overnight",
    ],
    not_included: [
      "International flights",
      "Travel insurance",
      "Some meals",
      "Souvenirs",
    ],
    what_to_bring: [
      "Light, breathable clothing",
      "Sandals",
      "Headscarf",
      "Sun hat",
      "Sunscreen",
      "Comfortable walking shoes",
      "Camera",
    ],
  },
];

// Function to get all trips with pagination
export function getAllTrips(limit: number = 12, offset: number = 0): {
  data: Trip[];
  total: number;
  hasMore: boolean;
} {
  const total = mockTrips.length;
  const data = mockTrips.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return {
    data,
    total,
    hasMore,
  };
}

// Function to get a single trip by ID
export function getTripById(id: string): Trip | null {
  const trip = mockTrips.find((t) => t.id === id);
  return trip || null;
}

// Function to search trips
export function searchTrips(
  query: string,
  limit: number = 12,
  offset: number = 0
): {
  data: Trip[];
  total: number;
  hasMore: boolean;
} {
  const filtered = mockTrips.filter(
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

// Function to filter trips by criteria
export function filterTrips(
  filters: Record<string, any>,
  limit: number = 12,
  offset: number = 0
): {
  data: Trip[];
  total: number;
  hasMore: boolean;
} {
  let filtered = mockTrips;

  // Category filter
  if (filters.category?.value) {
    filtered = filtered.filter(
      (t) => t.category?.toLowerCase() === filters.category.value.toLowerCase()
    );
  }

  // Difficulty filter
  if (filters.difficulty?.value) {
    filtered = filtered.filter(
      (t) => t.difficulty?.toLowerCase() === filters.difficulty.value.toLowerCase()
    );
  }

  // Price range filter
  if (filters.price?.value) {
    const [minPrice, maxPrice] = filters.price.value.split(":").map(Number);
    filtered = filtered.filter(
      (t) => (t.price || 0) >= minPrice && (t.price || 0) <= maxPrice
    );
  }

  // Start date filter (upcoming trips)
  if (filters.start_date?.value) {
    const filterDate = new Date(filters.start_date.value);
    filtered = filtered.filter((t) => new Date(t.start_date) >= filterDate);
  }

  // Available spots filter
  if (filters.available_spots?.value) {
    const minSpots = filters.available_spots.value;
    filtered = filtered.filter(
      (t) => ((t.max_participants || 0) - (t.min_participants || 0)) >= minSpots
    );
  }

  // Min destinations filter
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
