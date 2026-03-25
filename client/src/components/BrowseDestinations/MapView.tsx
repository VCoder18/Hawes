import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import type { Destination } from "@/imports/types";
import { DestinationCard } from "./DestinationCard";

interface MapViewProps {
  destinations: Destination[];
  savedDestinations: string[];
  onToggleSave: (id: string) => void;
  onSelectDestination: (destination: Destination) => void;
}

export function MapView({
  destinations,
  savedDestinations,
  onToggleSave,
  onSelectDestination,
}: MapViewProps) {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(destinations.length / itemsPerPage);
  const paginatedDestinations = destinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Map Placeholder */}
      <div className="lg:col-span-2 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-96 lg:min-h-full">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-52 bg-white rounded-full" />
          <div className="absolute bottom-20 right-20 size-32 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 size-40 bg-white rounded-full" />
        </div>
        <div className="relative text-center">
          <MapPin className="size-16 mx-auto mb-4 text-[#00b70d]" />
          <p className="text-text-[#00b70d] font-semibold text-lg">
            Interactive Map Coming Soon
          </p>
          <p className="text-text-[#ff5900] text-sm mt-2">
            View {destinations.length} destinations on the map
          </p>
        </div>
      </div>

      {/* Destinations List Sidebar */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#e2e8f0]">
          <h3 className="font-semibold text-text-[#00b70d]">
            Destinations ({destinations.length})
          </h3>
        </div>

        {/* Destinations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-4">
            {paginatedDestinations.length > 0 ? (
              paginatedDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isSaved={savedDestinations.includes(String(destination.id))}
                  onToggleSave={() => onToggleSave(String(destination.id))}
                  onClick={() => onSelectDestination(destination)}
                />
              ))
            ) : (
              <p className="text-center text-text-[#ff5900] py-8">
                No destinations found
              </p>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="border-t border-[#e2e8f0] p-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-bg-[#ff5900] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="size-5" />
            </button>
            <span className="text-sm text-text-[#ff5900]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-bg-[#ff5900] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


