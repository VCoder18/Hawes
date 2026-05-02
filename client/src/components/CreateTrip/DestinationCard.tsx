import { Heart, Info, Check, MapPin } from "lucide-react";
import { useState } from "react";

interface DestinationCardProps {
  destination: any;
  isSelected: boolean;
  onSelect: () => void;
  onDetails: () => void;
}

export function DestinationCard({ destination, isSelected, onSelect, onDetails }: DestinationCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-[#00b70d] bg-[#00b70d]/5"
          : "border-[#e2e8f0] hover:border-[#00b70d]/50"
      }`}
    >
      <button onClick={onSelect} className="text-left w-full">
        <div className="flex items-start gap-3">
          {imageError ? (
            <div className="size-16 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0">
              <div className="w-8 h-8 rounded bg-gray-400 animate-pulse" />
            </div>
          ) : (
            <img
              src={destination.image}
              alt={destination.name}
              className="size-16 rounded-lg object-cover shrink-0"
              onError={() => setImageError(true)}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-text-[#00b70d] line-clamp-1">{destination.name}</h4>
              {destination.isFavorite && (
                <Heart className="size-4 fill-[#ff5900] text-[#ff5900] shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-text-[#ff5900] mt-1">
              <MapPin className="size-3" />
              <span className="text-sm">{destination.region}</span>
            </div>
          </div>
          {isSelected && <Check className="size-5 text-[#00b70d]" />}
        </div>
      </button>

      <button
        onClick={onDetails}
        className="absolute bottom-3 right-3 p-2 bg-white hover:bg-bg-[#ff5900] border border-[#e2e8f0] rounded-lg transition-colors shadow-sm"
        title="View details"
      >
        <Info className="size-4 text-text-[#ff5900]" />
      </button>
    </div>
  );
}


