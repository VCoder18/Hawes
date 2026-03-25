import { MapPin, Star, Users, Calendar, Route, Heart } from "lucide-react";
import type { Destination } from "@/imports/types";

interface DestinationCardProps {
  destination: Destination;
  isSaved: boolean;
  onToggleSave: () => void;
  onClick: () => void;
}

export function DestinationCard({ destination, isSaved, onToggleSave, onClick }: DestinationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1" onClick={onClick}>
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-all ${
            isSaved 
              ? "bg-[#00b70d] text-white" 
              : "bg-white/90 text-text-[#ff5900] hover:bg-white"
          }`}
        >
          <Heart className={`size-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-['Lato'] font-bold text-xl text-text-[#00b70d] flex-1">
            {destination.name}
          </h3>
          <span className="bg-[#00b70d]/10 text-[#00b70d] px-3 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap">
            {destination.type}
          </span>
        </div>

        <div className="flex items-center gap-2 text-text-[#ff5900] mb-4">
          <MapPin className="size-4" />
          <span className="text-sm">{destination.region}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-[#ff5900] text-[#ff5900]" />
            <span className="font-bold text-text-[#00b70d]">{destination.rating}</span>
          </div>
          <span className="text-sm text-text-[#ff5900]">({destination.reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 text-text-[#ff5900]">
            <Users className="size-4" />
            <span className="text-sm">{destination.peopleVisiting.toLocaleString()} visiting</span>
          </div>
          {destination.availableEvents > 0 && (
            <div className="flex items-center gap-1.5 text-[#00b70d]">
              <Calendar className="size-4" />
              <span className="text-sm font-medium">{destination.availableEvents} {destination.availableEvents === 1 ? 'event' : 'events'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-text-[#00b70d] pt-3">
          <Route className="size-4" />
          <span className="text-sm font-medium">{destination.tripsAvailable} trips available</span>
        </div>
      </div>
    </div>
  );
}


