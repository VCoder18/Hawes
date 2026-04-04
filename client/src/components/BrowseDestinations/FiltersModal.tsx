import { useState } from "react";
import { X } from "lucide-react";

interface FiltersModalProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: {
    rating?: number;
    popularity?: string | null;
    maxDistance?: number;
    month?: string | null;
  };
}

const RATINGS = [0, 3, 3.5, 4, 4.5];
const POPULARITY_LEVELS = [
  { value: "quiet", label: "Quiet" },
  { value: "moderate", label: "Moderate" },
  { value: "popular", label: "Popular" },
  { value: "very-popular", label: "Very Popular" },
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

export function FiltersModal({ onClose, onApply, initialFilters }: FiltersModalProps) {
  const [minRating, setMinRating] = useState(initialFilters?.rating ?? 0);
  const [selectedPopularity, setSelectedPopularity] = useState(initialFilters?.popularity ?? null);
  const [maxDistance, setMaxDistance] = useState(initialFilters?.maxDistance ?? 100);
  const [selectedMonth, setSelectedMonth] = useState(initialFilters?.month ?? null);

  const handleApply = () => {
    onApply({
      rating: minRating,
      popularity: selectedPopularity,
      maxDistance,
      month: selectedMonth,
    });
  };

  const handleReset = () => {
    setMinRating(0);
    setSelectedPopularity(null);
    setMaxDistance(100);
    setSelectedMonth(null);
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
            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Min Rating</h3>
              <div className="space-y-2">
                {RATINGS.map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{rating === 0 ? 'Any' : `${rating}+`}</span>
                  </label>
                ))}
              </div>
            </div>

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
                    className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Any</span>
                </label>
                {POPULARITY_LEVELS.map((level) => (
                  <label key={level.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="popularity"
                      checked={selectedPopularity === level.value}
                      onChange={() => setSelectedPopularity(level.value)}
                      className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Best Time to Visit Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Best Time to Visit</h3>
              <select
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value || null)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Any Month</option>
                <option value="next-30">🔥 Next 30 days (Mar 29 - Apr 28)</option>
                <optgroup label="Months">
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Distance Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Max Distance from City</h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">{maxDistance} km</p>
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


