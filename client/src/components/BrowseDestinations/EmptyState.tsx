import { MapPin } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 py-12 px-4">
      <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-full p-6 mb-6">
        <MapPin className="size-12 text-[#00b70d]" />
      </div>
      <h3 className="font-['Lato'] font-bold text-2xl text-text-[#00b70d] mb-2">
        No Destinations Found
      </h3>
      <p className="text-text-[#ff5900] text-center mb-6 max-w-md">
        We couldn't find any destinations matching your filters. Try adjusting
        your search criteria or clearing filters to see more results.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-[#00b70d] text-white rounded-xl font-medium hover:bg-[#00b70d]-hover transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}


