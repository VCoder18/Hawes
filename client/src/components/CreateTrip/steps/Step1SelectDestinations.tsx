import { Search, SlidersHorizontal, Compass } from "lucide-react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { FiltersModal } from "@/components/BrowseDestinations/FiltersModal";
import { DestinationCard } from "@/components/CreateTrip/DestinationCard";
import { SelectedTag } from "@/components/CreateTrip/SelectedTag";
import { PaginationControls } from "@/components/CreateTrip/PaginationControls";
import type { Destination } from "@/imports/types";

interface Step1Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedPopularity: string | null;
  setSelectedPopularity: (popularity: string | null) => void;
  hasTripsOnly: boolean;
  setHasTripsOnly: (has: boolean) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  loading: boolean;
  error: string | null;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  tripData: any;
  onToggleDestination: (destination: Destination) => void;
  onRemoveDestinationByName: (name: string) => void;
  setSelectedDestination: (dest: Destination) => void;
  paginatedDestinations: Destination[];
  totalPages: number;
  totalDestinationResults: number;
  isInitialized: boolean;
  browseDestinationCategories: string[];
  getCategoryIcon: (category: string) => any;
}

export function Step1SelectDestinations({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  selectedCategory,
  setSelectedCategory,
  minRating,
  setMinRating,
  selectedPopularity,
  setSelectedPopularity,
  hasTripsOnly,
  setHasTripsOnly,
  maxDistance,
  setMaxDistance,
  selectedMonth,
  setSelectedMonth,
  showFavoritesOnly,
  setShowFavoritesOnly,
  loading,
  error,
  showFilters,
  setShowFilters,
  tripData,
  onToggleDestination,
  onRemoveDestinationByName,
  setSelectedDestination,
  paginatedDestinations,
  totalPages,
  totalDestinationResults,
  isInitialized,
  browseDestinationCategories,
  getCategoryIcon,
}: Step1Props) {

  return (
    <div className="space-y-6">
      <StepHeader
        title="Select Destinations"
        description="Choose one or more destinations for your trip"
      />

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

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-[#ff5900]" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
            showFilters
              ? "border-[#00b70d] bg-[#00b70d]/10 text-[#00b70d]"
              : "border-[#e2e8f0] text-text-[#ff5900] hover:border-[#00b70d]/50"
          }`}
        >
          <SlidersHorizontal className="size-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <FiltersModal
          onClose={() => setShowFilters(false)}
          onApply={(appliedFilters) => {
            setMinRating(appliedFilters.rating ?? minRating);
            setSelectedPopularity(appliedFilters.popularity ?? null);
            setMaxDistance(appliedFilters.maxDistance ?? maxDistance);
            setSelectedMonth(appliedFilters.month ?? null);
            setShowFilters(false);
          }}
          initialFilters={{
            rating: minRating,
            popularity: selectedPopularity,
            maxDistance,
            month: selectedMonth,
          }}
        />
      )}

      {/* Quick Filter Chips */}
      {isInitialized && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 pb-2">
            {/* All Category Chip */}
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
            {browseDestinationCategories.map((catId) => {
              const IconComponent = getCategoryIcon(catId);
              return (
                <button
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === catId
                      ? "bg-[#00b70d] text-white shadow-lg"
                      : "bg-white text-text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]"
                  }`}
                >
                  {IconComponent && <IconComponent className="size-5" />}
                  {catId.charAt(0).toUpperCase() + catId.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Destinations */}
      {tripData.destinations.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-text-[#00b70d]">Selected Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {tripData.destinations.map((dest: string) => (
              <SelectedTag
                key={dest}
                label={dest}
                onRemove={() => onRemoveDestinationByName(dest)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-[#757575]">
        <span className="font-semibold text-[#00b70d]">{totalDestinationResults}</span> destinations found
      </div>

      {/* Destination List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedDestinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            isSelected={tripData.destinations.includes(dest.name)}
            onSelect={() => onToggleDestination(dest)}
            onDetails={() => setSelectedDestination(dest)}
          />
        ))}
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
