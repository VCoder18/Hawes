import { useState } from "react";
import { X } from "lucide-react";

interface TripsFiltersModalProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: {
    popularity?: string | null;
    placeCategory?: string | null;
    spotsAvailable?: number;
    month?: string | null;
    numDestinations?: number;
    minDuration?: number;
    priceRange?: [number, number];
  };
};

const POPULARITY_LEVELS = [
  { value: "quiet", label: "0-5 participants" },
  { value: "moderate", label: "5-15 participants" },
  { value: "popular", label: "15-50 participants" },
  { value: "very-popular", label: "50+ participants" },
];

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const PLACE_CATEGORIES = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "desert", label: "Desert" },
  { value: "forest", label: "Forest" },
  { value: "historic", label: "Historic" },
  { value: "city", label: "City" },
];

const DESTINATION_COUNT_OPTIONS = [
  { value: 1, label: "Any" },
  { value: 1, label: "1 destination" },
  { value: 2, label: "2+ destinations" },
  { value: 3, label: "3+ destinations" },
  { value: 5, label: "5+ destinations" },
];

export function TripsFiltersModal({ onClose, onApply, initialFilters }: TripsFiltersModalProps) {
  const [selectedPopularity, setSelectedPopularity] = useState(initialFilters?.popularity ?? null);
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState(
    initialFilters?.placeCategory ?? null
  );
  const [minSpotsAvailable, setMinSpotsAvailable] = useState(initialFilters?.spotsAvailable ?? 0);
  const [selectedMonth, setSelectedMonth] = useState(initialFilters?.month ?? null);
  const [minDestinations, setMinDestinations] = useState(initialFilters?.numDestinations ?? 1);
  const [minDuration, setMinDuration] = useState(initialFilters?.minDuration ?? 0);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange ?? [0, 10000]
  );

  const clampPrice = (value: number) => {
    if (Number.isNaN(value)) return 0;
    return Math.min(10000, Math.max(0, value));
  };

  const normalizeMin = (candidateMin: number, currentMax: number) => {
    const safeMax = Math.min(10000, Math.max(1, currentMax));
    return Math.min(safeMax - 1, Math.max(0, candidateMin));
  };

  const normalizeMax = (candidateMax: number, currentMin: number) => {
    const safeMin = Math.max(0, Math.min(9999, currentMin));
    return Math.max(safeMin + 1, Math.min(10000, candidateMax));
  };

  const sliderMin = Math.min(priceRange[0], priceRange[1]);
  const sliderMax = Math.max(priceRange[0], priceRange[1]);

  const handleApply = () => {
    onApply({
      popularity: selectedPopularity,
      placeCategory: selectedPlaceCategory,
      spotsAvailable: minSpotsAvailable,
      month: selectedMonth,
      numDestinations: minDestinations,
      minDuration,
      priceRange,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedPopularity(null);
    setSelectedPlaceCategory(null);
    setMinSpotsAvailable(0);
    setSelectedMonth(null);
    setMinDestinations(1);
    setMinDuration(0);
    setPriceRange([0, 10000]);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto overflow-x-hidden">
        <div className="p-6 w-full max-w-full overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Filter Sections */}
          <div className="space-y-6">
            {/* Popularity Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Popularity</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="popularity"
                    checked={selectedPopularity === null}
                    onChange={() => setSelectedPopularity(null)}
                    className="size-4 border-gray-300 text-[#00b70d] focus:ring-[#00b70d]"
                  />
                  <span className="text-gray-700 break-words">Any</span>
                </label>
                {POPULARITY_LEVELS.map((level) => (
                  <label key={level.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="popularity"
                      checked={selectedPopularity === level.value}
                      onChange={() => setSelectedPopularity(level.value)}
                      className="size-4 border-gray-300 text-[#00b70d] focus:ring-[#00b70d]"
                    />
                    <span className="text-gray-700 break-words">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Places Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Places</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="place-category"
                    checked={selectedPlaceCategory === null}
                    onChange={() => setSelectedPlaceCategory(null)}
                    className="size-4 border-gray-300 text-[#00b70d] focus:ring-[#00b70d]"
                  />
                  <span className="text-gray-700 break-words">Any</span>
                </label>
                {PLACE_CATEGORIES.map((place) => (
                  <label key={place.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="place-category"
                      checked={selectedPlaceCategory === place.value}
                      onChange={() => setSelectedPlaceCategory(place.value)}
                      className="size-4 border-gray-300 text-[#00b70d] focus:ring-[#00b70d]"
                    />
                    <span className="text-gray-700 break-words">{place.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Spots Available Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Minimum Spots Available</h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={minSpotsAvailable}
                  onChange={(e) => setMinSpotsAvailable(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">{minSpotsAvailable} spot{minSpotsAvailable !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Upcoming Month Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Trip Month</h3>
              <select
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value || null)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent bg-white"
              >
                <option value="">Any Month</option>
                <optgroup label="Months">
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Number of Destinations Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Destinations</h3>
              <div className="space-y-2">
                {DESTINATION_COUNT_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="destinations"
                      checked={minDestinations === option.value}
                      onChange={() => setMinDestinations(option.value)}
                      className="size-4 border-gray-300 text-[#00b70d] focus:ring-[#00b70d]"
                    />
                    <span className="text-gray-700 break-words">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trip Duration Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Trip Duration (days)</h3>
              <input
                type="number"
                min="0"
                step="1"
                value={minDuration}
                onChange={(e) => setMinDuration(Math.max(0, Math.floor(parseInt(e.target.value) || 0)))}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
              />
              <p className="text-sm text-gray-600 mt-2">{minDuration} day{minDuration !== 1 ? 's' : ''}</p>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Price Range (DA/person)</h3>
              <div className="space-y-3">
                <div className="flex gap-2 min-w-0">
                  <input
                    type="number"
                    value={priceRange[0]}
                    min={0}
                    max={9999}
                    onChange={(e) => {
                      const raw = clampPrice(parseInt(e.target.value, 10));
                      const nextMin = normalizeMin(raw, priceRange[1]);
                      setPriceRange([nextMin, priceRange[1]]);
                    }}
                    placeholder="Min"
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                  />
                  <span className="flex items-center text-gray-600">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    min={1}
                    max={10000}
                    onChange={(e) => {
                      const raw = clampPrice(parseInt(e.target.value, 10));
                      const nextMax = normalizeMax(raw, priceRange[0]);
                      setPriceRange([priceRange[0], nextMax]);
                    }}
                    placeholder="Max"
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                  />
                </div>
                <input
                  type="range"
                  min={sliderMin}
                  max={sliderMax}
                  step="100"
                  value={Math.min(Math.max(priceRange[1], sliderMin), sliderMax)}
                  onChange={(e) => {
                    const raw = clampPrice(parseInt(e.target.value, 10));
                    const nextMax = normalizeMax(raw, priceRange[0]);
                    setPriceRange([priceRange[0], nextMax]);
                  }}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  DA {priceRange[0].toLocaleString()} - DA {priceRange[1].toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00a00a] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
