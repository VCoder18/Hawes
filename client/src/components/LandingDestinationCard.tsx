import { Star, MapPin } from "lucide-react";
import bannerImg from "@/assets/images/banner.jpg";

interface LandingDestinationCardProps {
  destination: {
    id: string | number;
    name: string;
    type: string;
    region: string;
    image: string;
    rating: number;
    category: string;
    peopleVisiting?: number;
  };
  onClick: () => void;
}

export function LandingDestinationCard({ destination, onClick }: LandingDestinationCardProps) {
  return (
    <div
      className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: "#FEFDE808", border: "1px solid #FEFDE812" }}
      onClick={onClick}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-800">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = bannerImg;
          }}
        />
        {destination.type && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "#E8550025", color: "#E85500" }}
          >
            {destination.type.charAt(0).toUpperCase() + destination.type.slice(1)}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2" style={{ fontFamily: "'Fraunces', serif", color: "#FEFDE8" }}>
          {destination.name}
        </h3>

        <div className="flex items-center gap-2 mb-3" style={{ color: "#FEFDE8", opacity: 0.5 }}>
          <MapPin className="size-4" />
          <span className="text-sm font-medium">{destination.region}</span>
        </div>

        <div className="flex items-center gap-2">
          <Star size={14} fill="#FFD700" stroke="#FFD700" />
          <span className="font-bold text-sm" style={{ color: "#FEFDE8" }}>{destination.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
