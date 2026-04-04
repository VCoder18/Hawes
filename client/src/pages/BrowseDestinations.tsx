import { useState, useEffect, useRef, useCallback } from "react";
import { DestinationModal } from "@/components/DestinationModal";
import { Search, SlidersHorizontal, Grid3x3, Map as MapIcon, Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { browseDestinationCategories, categoryIconMap } from "@/imports/constants";

// Import extracted components
import { DestinationCard } from "@/components/BrowseDestinations/DestinationCard";
import { FiltersModal } from "@/components/BrowseDestinations/FiltersModal";
import { MapView } from "@/components/BrowseDestinations/MapView";
import { EmptyState } from "@/components/BrowseDestinations/EmptyState";

// Import types
import type { Destination } from "@/imports/types";
import { useFavorites } from "@/hooks/useFavorites";

export default function BrowseDestinations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [selectedPopularity, setSelectedPopularity] = useState<string | null>(null);
  const [hasTripsOnly, setHasTripsOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(100);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { favorites, toggleFavorite, isInitialized } = useFavorites();

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };

    loadUser();
  }, []);

  // Helper to build backend filters object
  const buildBackendFilters = () => {
    const filters: Record<string, any> = {};
    
    if (selectedCategory !== "all") {
      filters.category = { operator: "eq", value: selectedCategory };
    }
    
    if (hasTripsOnly) {
      filters.trip_ids = { operator: "eq", value: "has_trips" };
    }
    
    if (selectedMonth && selectedMonth !== "next-30") {
      const monthNum = selectedMonth.padStart(2, '0');
      const startDay = "01";
      const endDay = monthNum === "02" ? "28" : (["04", "06", "09", "11"].includes(monthNum) ? "30" : "31");
      filters.best_periods = { operator: "eq", value: `${monthNum}-${startDay}:${monthNum}-${endDay}` };
    } else if (selectedMonth === "next-30") {
      filters.best_periods = { operator: "eq", value: "03-01:04-30" };
    }
    
    // Include rating filter
    if (minRating > 0) {
      filters.rating = { operator: "gte", value: minRating };
    }
    
    // Include popularity filter (convert to peopleVisiting ranges)
    if (selectedPopularity) {
      let minPeople = 0, maxPeople = 10000;
      switch (selectedPopularity) {
        case "quiet":
          maxPeople = 50;
          break;
        case "moderate":
          minPeople = 50;
          maxPeople = 200;
          break;
        case "popular":
          minPeople = 200;
          maxPeople = 500;
          break;
        case "very-popular":
          minPeople = 500;
          break;
      }
      filters.peopleVisiting = { operator: "range", value: `${minPeople}:${maxPeople}` };
    }
    
    // Include distance filter
    if (maxDistance < 100) {
      filters.distance_from_center = { operator: "lte", value: maxDistance };
    }

    // Include favorites filter for backend. We pass user id so filtering works
    // even if request user context is missing on public routes.
    if (showFavoritesOnly && userId) {
      filters.favorites_only = { operator: "eq", value: userId };
    }
    
    return filters;
  };

  // Fetch destinations with pagination
  const fetchDestinations = useCallback(
    (pageNum: number) => {
      const isFirstPage = pageNum === 1;
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const LIMIT = 12;
      const offset = (pageNum - 1) * LIMIT;
      
      const filters = buildBackendFilters();
      
      const params = new URLSearchParams();
      params.append('limit', LIMIT.toString());
      params.append('offset', offset.toString());
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (Object.keys(filters).length > 0) {
        params.append('filters', JSON.stringify(filters));
      }
      
      const endpoint = `${API_BASE_URL}/destinations?${params.toString()}`;
      
      const fetchWithAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        
        // Add auth header if user is logged in (for favorites filtering)
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        
        return fetch(endpoint, { headers });
      };
      
      fetchWithAuth()
        .then((res) => {
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          return res.json();
        })
        .then((response) => {
          const fetchedDestinations = response.data || response || [];
          const total = response.total || 0;
          const hasMoreFromApi = response.hasMore ?? false;
          
          if (!Array.isArray(fetchedDestinations)) {
            console.warn("Destinations is not an array:", fetchedDestinations);
          }
          
          const transformed = fetchedDestinations.map((dbDest: any) => {
            const [longitude, latitude] = dbDest.location?.coordinates || [0, 0];
            
            return {
              id: dbDest.id,
              name: dbDest.name,
              type: dbDest.category,
              region: dbDest.region,
              image: dbDest.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
              rating: dbDest.rating || 4.5,
              reviews: Math.floor(Math.random() * 200) + 10,
              peopleVisiting: dbDest.peopleVisiting || Math.floor(Math.random() * 1000) + 50,
              tripsAvailable: dbDest.trip_ids?.length || 0,
              category: dbDest.category,
              description: dbDest.description || "",
              isFavorite: false,
              lat: latitude,
              lng: longitude,
              best_periods: dbDest.best_periods || [],
            };
          });
          
          // Set total results on first page only
          if (isFirstPage) {
            setTotalResults(total);
          }
          
          // Append results or replace for first page
          setDestinations((prev) => (isFirstPage ? transformed : [...prev, ...transformed]));
          
          // Use hasMore from API response
          setHasMore(hasMoreFromApi);
          
          if (isFirstPage) {
            setLoading(false);
          } else {
            setLoadingMore(false);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch destinations from API:", err);
          setError("Could not load destinations");
          // Stop infinite scroll on error
          setHasMore(false);
          if (isFirstPage) {
            setDestinations([]);
            setLoading(false);
          } else {
            setLoadingMore(false);
          }
        });
    },
    [searchQuery, selectedCategory, selectedMonth, hasTripsOnly, minRating, selectedPopularity, maxDistance, showFavoritesOnly, userId]
  );

  // When filters change, reset pagination and fetch page 1
  useEffect(() => {
    setPage(1);
    setDestinations([]);
    setTotalResults(0);
    setHasMore(true);
    fetchDestinations(1);
  }, [searchQuery, selectedCategory, selectedMonth, hasTripsOnly, minRating, selectedPopularity, maxDistance, showFavoritesOnly, fetchDestinations]);

  // Fetch when page changes (for infinite scroll)
  useEffect(() => {
    if (page > 1) {
      fetchDestinations(page);
    }
  }, [page, fetchDestinations]);

  // Infinite scroll: detect when to load more
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

  // All filtering handled by backend
  const filteredDestinations = destinations;

  const handleSaveDestination = (destId: string) => {
    toggleFavorite(destId);
  };

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('browseFilters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setMinRating(filters.rating ?? 0);
        setSelectedPopularity(filters.popularity ?? null);
        setMaxDistance(filters.maxDistance ?? 100);
        setSelectedMonth(filters.month ?? null);
      } catch (e) {
        console.error('Failed to load filters from localStorage:', e);
      }
    }
  }, []);

  const handleApplyFilters = (filters: any) => {
    // Always update values, not just when they're truthy
    setMinRating(filters.rating ?? 0);
    setSelectedPopularity(filters.popularity ?? null);
    setMaxDistance(filters.maxDistance ?? 100);
    setSelectedMonth(filters.month ?? null);
    
    // Save to localStorage
    localStorage.setItem('browseFilters', JSON.stringify({
      rating: filters.rating ?? 0,
      popularity: filters.popularity ?? null,
      maxDistance: filters.maxDistance ?? 100,
      month: filters.month ?? null,
    }));
    
    setFiltersOpen(false);
  };

  const mapPageDestinations = filteredDestinations.slice(0, 6);

  // Map categories to icons
  const getCategoryIcon = (category: string) => {
    return categoryIconMap[category.toLowerCase()] || Compass;
  };

  // Build category chips: "All" + fixed categories
  const categoryChips = [
    { id: "all", label: "All", icon: Compass },
    ...browseDestinationCategories.map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize first letter
      icon: getCategoryIcon(cat)
    }))
  ];

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl lg:text-5xl text-[#0d2805] mb-2">
          Browse Destinations
        </h1>
        <p className="text-lg text-[#757575]">
          Discover amazing places across Algeria
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b70d]" />
            </div>
            <p className="mt-4 text-[#757575] font-medium">Loading destinations...</p>
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
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-text-[#00b70d] placeholder:text-text-[#ff5900] focus:outline-none focus:ring-2 focus:ring-[#00b70d] transition-all"
            />
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-bg-[#ff5900] hover:bg-[#e2e8f0] border border-[#e2e8f0] rounded-xl font-medium text-text-[#00b70d] transition-colors"
          >
            <SlidersHorizontal className="size-5" />
            <span>Filters</span>
          </button>

          {/* View Mode Toggle - Mobile Full Width */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2 bg-bg-[#ff5900] rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-[#00b70d] shadow-sm"
                  : "text-text-[#ff5900]"
              }`}
            >
              <Grid3x3 className="size-5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "map"
                  ? "bg-white text-[#00b70d] shadow-sm"
                  : "text-text-[#ff5900]"
              }`}
            >
              <MapIcon className="size-5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      {isInitialized && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 pb-2">
            {/* All Category Chip */}
            {categoryChips.length > 0 && (
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
            )}

            {/* Favorites Quick Filter */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                showFavoritesOnly
                  ? "bg-[#ff5900] text-white shadow-lg"
                  : "bg-white text-[#ff5900] border border-[#e2e8f0] hover:border-[#ff5900]"
              }`}
            >
              <span className="text-lg">♥</span>
              <span>Favorites</span>
            </button>

            {/* Has Trips Quick Filter */}
            <button
              onClick={() => setHasTripsOnly(!hasTripsOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                hasTripsOnly
                  ? "bg-[#00b70d] text-white shadow-lg"
                  : "bg-white text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]"
              }`}
            >
              <Compass className="size-5" />
              <span>Has Trips</span>
            </button>

            {/* Other Category Chips */}
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
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-text-[#ff5900]">
          <span className="font-bold text-text-[#00b70d]">{totalResults}</span> destinations found
        </p>
      </div>

      {/* Destinations Grid or Map View */}
      {viewMode === "grid" ? (
        <>
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-12">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isSaved={favorites[destination.id.toString()]}
                  onToggleSave={() => handleSaveDestination(destination.id)}
                  onClick={() => setSelectedDestination(destination)}
                />
              ))}
            </div>
          ) : (
            <EmptyState onClearFilters={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setMinRating(0);
              setSelectedPopularity(null);
              setHasTripsOnly(false);
              setMaxDistance(100);
              setSelectedMonth(null);
            }} />
          )}

          {/* Infinite Scroll Loader */}
          {filteredDestinations.length > 0 && (
            <div ref={loaderRef} className="flex justify-center py-12">
              {loadingMore && (
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b70d]" />
                </div>
              )}
              {!hasMore && filteredDestinations.length > 0 && (
                <p className="text-[#757575] font-medium">No more destinations</p>
              )}
            </div>
          )}
        </>
      ) : (
        <MapView 
          destinations={mapPageDestinations}
          savedDestinations={Object.keys(favorites).filter(key => favorites[key])}
          onToggleSave={(id: string) => handleSaveDestination(id)}
          onSelectDestination={setSelectedDestination}
        />
      )}

      {/* Filters Modal */}
      {filtersOpen && (
        <FiltersModal
          onClose={() => setFiltersOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={{
            rating: minRating,
            popularity: selectedPopularity,
            maxDistance,
            month: selectedMonth,
          }}
        />
      )}

      {/* Destination Details Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          isSaved={favorites[selectedDestination.id.toString()]}
          onToggleSave={() => handleSaveDestination(selectedDestination.id)}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </>
  );
}


