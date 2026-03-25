import { useState } from "react";
import { X, Star } from "lucide-react";
import type { Filters } from "@/imports/types";

interface FiltersModalProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onClose: () => void;
}

export function FiltersModal({ filters, setFilters, onClose }: FiltersModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      type: [],
      services: [],
      events: "all",
      distance: "all",
      rating: 0,
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Lato'] font-bold text-2xl text-text-[#00b70d]">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-[#ff5900] rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Filter Sections */}
          <div className="space-y-6">
            {/* Type Filter */}
            <div>
              <h3 className="font-semibold text-text-[#00b70d] mb-3">Destination Type</h3>
              <div className="space-y-2">
                {["Desert", "Beach", "Mountain", "Historic", "Cultural", "Nature"].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.type.includes(type)}
                      onChange={(e) => {
                        setLocalFilters({
                          ...localFilters,
                          type: e.target.checked
                            ? [...localFilters.type, type]
                            : localFilters.type.filter((t: string) => t !== type)
                        });
                      }}
                      className="size-4 rounded border-[#e2e8f0] text-[#00b70d] focus:ring-[#00b70d]"
                    />
                    <span className="text-text-[#00b70d]">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Services Available */}
            <div>
              <h3 className="font-semibold text-text-[#00b70d] mb-3">Services Available</h3>
              <div className="space-y-2">
                {["Restaurant", "Hotel", "Transport", "Guide", "Camping"].map((service) => (
                  <label key={service} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.services.includes(service)}
                      onChange={(e) => {
                        setLocalFilters({
                          ...localFilters,
                          services: e.target.checked
                            ? [...localFilters.services, service]
                            : localFilters.services.filter((s: string) => s !== service)
                        });
                      }}
                      className="size-4 rounded border-[#e2e8f0] text-[#00b70d] focus:ring-[#00b70d]"
                    />
                    <span className="text-text-[#00b70d]">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Events Filter */}
            <div>
              <h3 className="font-semibold text-text-[#00b70d] mb-3">Events</h3>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All" },
                  { value: "none", label: "None" },
                  { value: "cultural", label: "Cultural" },
                  { value: "historic", label: "Historic" },
                  { value: "adventure", label: "Adventure" },
                ].map((event) => (
                  <label key={event.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="events"
                      checked={localFilters.events === event.value}
                      onChange={() => setLocalFilters({ ...localFilters, events: event.value })}
                      className="size-4 border-[#e2e8f0] text-[#00b70d] focus:ring-[#00b70d]"
                    />
                    <span className="text-text-[#00b70d]">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-text-[#00b70d] mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={localFilters.rating === rating}
                      onChange={() => setLocalFilters({ ...localFilters, rating })}
                      className="size-4 border-[#e2e8f0] text-[#00b70d] focus:ring-[#00b70d]"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-[#ff5900] text-[#ff5900]" />
                      <span className="text-text-[#00b70d]">{rating}+</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div>
              <h3 className="font-semibold text-text-[#00b70d] mb-3">Distance</h3>
              <select
                value={localFilters.distance}
                onChange={(e) => setLocalFilters({ ...localFilters, distance: e.target.value })}
                className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
              >
                <option value="all">All Distances</option>
                <option value="50">Within 50 km</option>
                <option value="100">Within 100 km</option>
                <option value="200">Within 200 km</option>
                <option value="500">Within 500 km</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-[#e2e8f0]">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 border border-[#e2e8f0] rounded-xl font-medium text-text-[#00b70d] hover:bg-bg-[#ff5900] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-6 py-3 bg-[#00b70d] text-white rounded-xl font-medium hover:bg-[#00b70d]-hover transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


