import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { DestinationModal } from "@/components/DestinationModal";
import { Search, SlidersHorizontal, Grid3x3, Map as MapIcon } from "lucide-react";

// Import extracted components
import { DestinationCard } from "@/components/BrowseDestinations/DestinationCard";
import { FiltersModal } from "@/components/BrowseDestinations/FiltersModal";
import { MapView } from "@/components/BrowseDestinations/MapView";
import { EmptyState } from "@/components/BrowseDestinations/EmptyState";

// Import constants and types
import { destinationCategories, destinationsList } from "@/imports/constants";
import type { Destination, Filters } from "@/imports/types";

export default function BrowseDestinations() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(9);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<Filters>({
    type: [],
    services: [],
    events: "all",
    distance: "all",
    rating: 0,
  });

  // Update searchQuery when URL parameter changes
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  // Filter destinations
  const filteredDestinations = destinationsList.filter((dest) => {
    // Search filter
    if (searchQuery && !dest.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !dest.region.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory === "favorites") {
      return savedDestinations.includes(String(dest.id));
    }
    if (selectedCategory !== "all" && dest.category !== selectedCategory) {
      return false;
    }
    
    // Type filter
    if (filters.type.length > 0 && !filters.type.some(t => dest.type.toLowerCase().includes(t.toLowerCase()))) {
      return false;
    }
    
    // Events filter
    if (filters.events === "none" && dest.availableEvents > 0) {
      return false;
    }
    if (filters.events !== "all" && filters.events !== "none" && dest.availableEvents === 0) {
      return false;
    }
    
    // Rating filter
    if (filters.rating > 0 && dest.rating < filters.rating) {
      return false;
    }
    
    return true;
  });

  // Infinite scroll for grid view
  useEffect(() => {
    if (viewMode !== "grid") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filteredDestinations.length) {
          setDisplayCount(prev => Math.min(prev + 6, filteredDestinations.length));
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayCount, filteredDestinations.length, viewMode]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(9);
  }, [filteredDestinations.length, searchQuery, selectedCategory, filters]);

  const toggleSave = (id: string) => {
    setSavedDestinations(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const mapPageDestinations = filteredDestinations.slice(0, 6);

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

      {/* Category Chips */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 pb-2">
          {destinationCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? "bg-[#00b70d] text-white shadow-lg"
                  : "bg-white text-text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]"
              }`}
            >
              <category.icon className="size-5" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-text-[#ff5900]">
          <span className="font-bold text-text-[#00b70d]">{filteredDestinations.length}</span> destinations found
        </p>
      </div>

      {/* Destinations Grid or Map View */}
      {viewMode === "grid" ? (
        <>
          {filteredDestinations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredDestinations.slice(0, displayCount).map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    isSaved={savedDestinations.includes(String(destination.id))}
                    onToggleSave={() => toggleSave(String(destination.id))}
                    onClick={() => setSelectedDestination(destination)}
                  />
                ))}
              </div>
              
              {/* Infinite Scroll Trigger */}
              {displayCount < filteredDestinations.length && (
                <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                  <div className="animate-spin size-8 border-4 border-[#00b70d] border-t-transparent rounded-full"></div>
                </div>
              )}
            </>
          ) : (
            <EmptyState onClearFilters={() => {
              setFilters({
                type: [],
                services: [],
                events: "all",
                distance: "all",
                rating: 0,
              });
              setSelectedCategory("all");
              setSearchQuery("");
            }} />
          )}
        </>
      ) : (
        <MapView 
          destinations={mapPageDestinations}
          savedDestinations={savedDestinations}
          onToggleSave={toggleSave}
          onSelectDestination={setSelectedDestination}
        />
      )}

      {/* Filters Modal */}
      {filtersOpen && (
        <FiltersModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      {/* Destination Details Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination as any}
          isSaved={savedDestinations.includes(String(selectedDestination.id))}
          onToggleSave={() => toggleSave(String(selectedDestination.id))}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </>
  );
}


