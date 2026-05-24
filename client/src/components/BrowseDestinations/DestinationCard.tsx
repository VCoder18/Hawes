import { MapPin, Star, Heart, Users, Luggage } from "lucide-react";
import type { Destination } from "@/imports/types";
import bannerImg from "@/assets/images/banner.jpg";

interface DestinationCardProps {
  destination: Destination;
  isSaved: boolean;
  onToggleSave: () => void;
  onClick: () => void;
}

export function DestinationCard({ 
  destination, 
  isSaved, 
  onToggleSave, 
  onClick,
}: DestinationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow" onClick={onClick}>
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = bannerImg;
          }}
        />
        
        {/* Badge */}
        {destination.type && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {destination.type.charAt(0).toUpperCase() + destination.type.slice(1)}
          </div>
        )}
        
        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white transition-all"
        >
          <Heart className={`size-5 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {destination.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="size-4 text-gray-400" />
          <span className="text-sm font-medium">{destination.region}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="size-5 fill-orange-500 text-orange-500" />
          <span className="font-bold text-gray-900">{destination.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({destination.reviews} reviews)</span>
        </div>

        {/* Stats */}
        <div className="space-y-3 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <Users className="size-4 text-gray-400" />
            <span>{destination.peopleVisiting.toLocaleString()} visiting</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <Luggage className="size-4 text-gray-400" />
            <span>{destination.tripsAvailable} trips available</span>
          </div>
        </div>
      </div>
    </div>
  );
}


