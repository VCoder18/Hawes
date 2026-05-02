import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Compass, Plus, SlidersHorizontal, User, Heart, Mountain, Leaf, Camera, Users, Backpack, Factory, BookOpen, Coffee, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

// Import extracted components
import { TripCard } from "@/components/BrowseTrips/TripCard";
import { TripsFiltersModal } from "@/components/BrowseTrips/TripsFiltersModal";
import { EmptyState } from "@/components/BrowseDestinations/EmptyState";

// Import types and constants
import type { UserRole } from "@/imports/types";
import { tripCategories } from "@/imports/constants";
import { getAllTrips, searchTrips, filterTrips } from "@/lib/mockData";

interface TripStop {
  id: string;
  trip_id: string;
  stop_type: string;
  destination_id: string | null;
  location: unknown;
  label: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface TripRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string;
  images?: string[];
  start_date: string;
  end_date: string;
  price: number | null;
  min_price?: number | null;
  max_price?: number | null;
  max_participants: number | null;
  min_participants: number | null;
  current_participants?: number | null;
  organizer?: string | null;
  stops?: TripStop[];
  [key: string]: unknown;
}

const tripDifficulties = ["Easy", "Moderate", "Hard", "Expert"];

export default function BrowseTrips() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchQuery, setSearchQuery] = useState(state?.searchQuery || "");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showCreatedByMeOnly, setShowCreatedByMeOnly] = useState(false);
  const [selectedOrganizerRole, setSelectedOrganizerRole] = useState<
    Extract<UserRole, "traveler" | "organization" | "agency"> | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedPopularity, setSelectedPopularity] = useState<string | null>(null);
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState<string | null>(null);
  const [minSpotsAvailable, setMinSpotsAvailable] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [minDestinations, setMinDestinations] = useState(1);
  const [minDuration, setMinDuration] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [savedTrips, setSavedTrips] = useState<Set<string>>(new Set());
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch user id for local "created by me" filtering
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };

    loadUser();
  }, []);

  // Load bookmarked trips (mock)
  useEffect(() => {
    // With mock data, bookmarks are stored in local state
    // No need to fetch from API
    setSavedTrips(new Set());
  }, []);

  // Fetch trips from mock data only
  const fetchTrips = useCallback(
    async (pageNum: number) => {
      const isFirstPage = pageNum === 1;
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const LIMIT = 12;
      const offset = (pageNum - 1) * LIMIT;

      const applyMockFallback = () => {
        const mockFilters: Record<string, any> = {};

        if (selectedCategory !== "all") {
          mockFilters.category = { operator: "eq", value: selectedCategory };
        }

        if (selectedDifficulty) {
          mockFilters.difficulty = { operator: "eq", value: selectedDifficulty };
        }

        if (priceRange[1] < 10000 || priceRange[0] > 0) {
          mockFilters.price = {
            operator: "range",
            value: `${priceRange[0]}:${priceRange[1]}`,
          };
        }

        if (minSpotsAvailable > 0) {
          mockFilters.available_spots = { operator: "gte", value: minSpotsAvailable };
        }

        if (minDestinations > 1) {
          mockFilters.min_destinations = { operator: "gte", value: minDestinations };
        }

        let fallback;
        if (searchQuery.trim()) {
          fallback = searchTrips(searchQuery.trim(), LIMIT, offset);
        } else if (Object.keys(mockFilters).length > 0) {
          fallback = filterTrips(mockFilters, LIMIT, offset);
        } else {
          fallback = getAllTrips(LIMIT, offset);
        }

        const fallbackTrips = (fallback.data || []) as TripRow[];
        const withCreatedByMeFilter =
          showCreatedByMeOnly && userId
            ? fallbackTrips.filter((trip) => trip.organizer === userId)
            : fallbackTrips;
        const withDurationFilter =
          minDuration > 0
            ? withCreatedByMeFilter.filter((trip) => {
                if (!trip.start_date || !trip.end_date) return false;
                const durationDays = Math.ceil(
                  (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return durationDays >= minDuration;
              })
            : withCreatedByMeFilter;
        const fallbackHasMore = fallback.hasMore ?? false;

        setTrips((prev) => (isFirstPage ? withDurationFilter : [...prev, ...withDurationFilter]));
        if (isFirstPage) {
          setTotalResults(fallback.total || withDurationFilter.length);
        }
        setHasMore(fallbackHasMore);
        setError(null);
      };

      try {
        applyMockFallback();
      } catch (err: any) {
        console.warn("Failed to load trips from mock data:", err);
        applyMockFallback();
      } finally {
        if (isFirstPage) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [
      searchQuery,
      selectedCategory,
      selectedDifficulty,
      showCreatedByMeOnly,
      priceRange,
      minSpotsAvailable,
      selectedMonth,
      minDestinations,
      minDuration,
      userId,
    ]
  );

  // When filters change, reset pagination
  useEffect(() => {
    setPage(1);
    setTrips([]);
    setTotalResults(0);
    setHasMore(true);
    fetchTrips(1);
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedOrganizerRole, showCreatedByMeOnly, selectedPlaceCategory, priceRange, selectedPopularity, minSpotsAvailable, selectedMonth, minDestinations, minDuration, showFavoritesOnly, fetchTrips]);

  // Fetch when page changes
  useEffect(() => {
    if (page > 1) {
      fetchTrips(page);
    }
  }, [page, fetchTrips]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, loadingMore]);

  const handleToggleSave = useCallback(
    (tripId: string) => {
      // Mock save functionality - just toggle the local state
      setSavedTrips((prev) => {
        const next = new Set(prev);
        if (next.has(tripId)) {
          next.delete(tripId);
        } else {
          next.add(tripId);
        }
        return next;
      });
    },
    []
  );

  const categoryChips = [
    { id: "all", label: "All", icon: Compass },
  ];
  
  const categoryIcons: Record<string, LucideIcon> = {
    "Adventure": Mountain,
    "Cultural": Users,
    "Nature": Leaf,
    "Historical": BookOpen,
    "Relaxation": Coffee,
    "Photography": Camera,
  };

  tripCategories.forEach((cat) => {
    categoryChips.push({
      id: cat.toLowerCase(),
      label: cat,
      icon: categoryIcons[cat] || Compass,
    });
  });

  const organizerRoleChips: Array<{ id: Extract<UserRole, "traveler" | "organization" | "agency">; label: string; icon?: LucideIcon }> = [
    { id: "traveler", label: "Traveler", icon: Backpack },
    { id: "organization", label: "Organization", icon: Factory },
    { id: "agency", label: "Agency", icon: Users },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl lg:text-5xl text-[#0d2805] mb-2">
          Discover Algerian Wonders
        </h1>
        <p className="text-lg text-[#757575]">
          Explore amazing trips across Algeria
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b70d]" />
            </div>
            <p className="mt-4 text-[#757575] font-medium">Loading trips...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-[#ff5900]" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-text-[#00b70d] placeholder:text-text-[#ff5900] focus:outline-none focus:ring-2 focus:ring-[#00b70d] transition-all"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e2e8f0] hover:border-[#00b70d] text-[#00b70d] font-bold rounded-xl transition-colors shadow-sm"
          >
            <SlidersHorizontal className="size-5" />
            <span className="text-sm">Filters</span>
          </button>

          {/* Create Trip Button */}
          <button
            onClick={() => navigate("/create-trip")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00b70d] hover:bg-[#00a00a] text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-lg"
          >
            <Plus className="size-5" />
            <span>Create Trip</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 pb-3">
          <span className="text-xs font-bold uppercase tracking-wide text-[#757575]">Trip Type</span>

          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#00b70d] text-white shadow-lg"
                : "bg-white text-text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]"
            }`}
          >
            <Compass className="size-5" />
            <span>All</span>
          </button>

          {categoryChips.slice(1).map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#00b70d] text-white shadow-lg"
                    : "bg-white text-text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]"
                }`}
              >
                {IconComponent && <IconComponent className="size-5" />}
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="h-px bg-[#e2e8f0]" />

        <div className="flex flex-wrap items-center gap-3 py-3">
          <span className="text-xs font-bold uppercase tracking-wide text-[#757575]">Quick Filters</span>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              showFavoritesOnly
                ? "bg-[#ff5900] text-white shadow-lg"
                : "bg-white text-[#ff5900] border border-[#e2e8f0] hover:border-[#ff5900]"
            }`}
          >
            <Heart className="size-5" />
            <span>Bookmarks</span>
          </button>

          <button
            onClick={() => setShowCreatedByMeOnly(!showCreatedByMeOnly)}
            title="Created by me"
            aria-label="Filter trips created by me"
            className={`flex items-center justify-center size-10 rounded-full border transition-all ${
              showCreatedByMeOnly
                ? "bg-[#0d2805] text-white border-[#0d2805] shadow-lg"
                : "bg-white text-[#0d2805] border-[#e2e8f0] hover:border-[#0d2805]"
            }`}
          >
            <User className="size-5" />
          </button>

          {organizerRoleChips.map((roleChip) => {
            const IconComponent = roleChip.icon;
            return (
              <button
                key={roleChip.id}
                onClick={() =>
                  setSelectedOrganizerRole((prev) =>
                    prev === roleChip.id ? null : roleChip.id
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedOrganizerRole === roleChip.id
                    ? "bg-[#0d2805] text-white shadow-lg"
                    : "bg-white text-[#0d2805] border border-[#e2e8f0] hover:border-[#0d2805]"
                }`}
              >
                {IconComponent && <IconComponent className="size-5" />}
                <span>{roleChip.label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-px bg-[#e2e8f0]" />

        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-xs font-bold uppercase tracking-wide text-[#757575]">Difficulty</span>
          {tripDifficulties.map((diff) => (
            <button
              key={diff}
              onClick={() =>
                setSelectedDifficulty(
                  selectedDifficulty === diff.toLowerCase() ? null : diff.toLowerCase()
                )
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDifficulty === diff.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "bg-white text-text-[#00b70d] border border-[#e2e8f0] hover:border-blue-500"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-text-[#ff5900]">
          <span className="font-bold text-text-[#00b70d]">{totalResults}</span> trips found
        </p>
      </div>

      {/* Trips Grid View */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-12">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isMine={Boolean((trip as any).organizer && userId && (trip as any).organizer === userId)}
              isSaved={savedTrips.has(trip.id)}
              onToggleSave={() => handleToggleSave(trip.id)}
              onClick={() => navigate(`/trips/${trip.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          onClearFilters={() => {
            setSelectedCategory("all");
            setSearchQuery("");
            setSelectedDifficulty(null);
            setShowCreatedByMeOnly(false);
            setSelectedOrganizerRole(null);
            setSelectedPopularity(null);
            setSelectedPlaceCategory(null);
            setMinSpotsAvailable(0);
            setSelectedMonth(null);
            setMinDestinations(1);
            setPriceRange([0, 10000]);
          }}
        />
      )}

      {/* Infinite Scroll Loader */}
      {trips.length > 0 && (
        <div ref={loaderRef} className="flex justify-center py-12">
          {loadingMore && (
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b70d]" />
            </div>
          )}
          {!hasMore && trips.length > 0 && (
            <p className="text-[#757575] font-medium">No more trips</p>
          )}
        </div>
      )}

      {/* Filters Modal */}
      {filtersOpen && (
        <TripsFiltersModal
          onClose={() => setFiltersOpen(false)}
          onApply={(filters) => {
            setSelectedPopularity(filters.popularity);
            setSelectedPlaceCategory(filters.placeCategory);
            setMinSpotsAvailable(filters.spotsAvailable);
            setSelectedMonth(filters.month);
            setMinDestinations(filters.numDestinations);
            setMinDuration(filters.minDuration);
            setPriceRange(filters.priceRange);
          }}
          initialFilters={{
            popularity: selectedPopularity,
            placeCategory: selectedPlaceCategory,
            spotsAvailable: minSpotsAvailable,
            month: selectedMonth,
            numDestinations: minDestinations,
            minDuration,
            priceRange,
          }}
        />
      )}
    </>
  );
}
