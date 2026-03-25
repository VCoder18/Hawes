import { Heart } from "lucide-react";

interface QuickFiltersProps {
  quickFilter: string;
  onFilterChange: (filter: string) => void;
}

export function QuickFilters({ quickFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFilterChange("all")}
        className={`px-4 py-2 rounded-full font-medium transition-all ${
          quickFilter === "all"
            ? "bg-[#00b70d] text-white"
            : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange("favorites")}
        className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1 ${
          quickFilter === "favorites"
            ? "bg-[#00b70d] text-white"
            : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
        }`}
      >
        <Heart className={`size-4 ${quickFilter === "favorites" ? "fill-white" : ""}`} />
        Favorites
      </button>
    </div>
  );
}


