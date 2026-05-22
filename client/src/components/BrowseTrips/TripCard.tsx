import { MapPin, Users, Calendar, Bookmark, DollarSign, User } from "lucide-react";
import { useState } from "react";

interface TripStop {
  id: string;
  trip_id: string;
  stop_type: string;
  destination_id: string | null;
  location: unknown;
  label: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface TripCardTrip {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string;
  images?: string[];
  start_date: string;
  end_date: string;
  price: number | null;
  min_price?: number | null;
  max_price?: number | null;
  max_participants: number | null;
  min_participants: number | null;
  current_participants?: number | null;
  stops?: TripStop[];
  [key: string]: unknown;
}

interface TripCardProps {
  trip: TripCardTrip;
  isMine?: boolean;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onClick?: () => void;
  showBookmark?: boolean;
}

export function TripCard({
  trip,
  isMine = false,
  isSaved = false,
  onToggleSave,
  onClick,
  showBookmark = true,
}: TripCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave?.();
  };

  // Get cover image from images array
  const coverImage = Array.isArray(trip.images) && trip.images.length > 0 ? trip.images[0] : null;
  const durationDays = trip.start_date && trip.end_date 
    ? Math.ceil(
        (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const formatPrice = () => {
    if (trip.max_price !== null && trip.max_price !== undefined) {
      const minValue = trip.min_price ?? 0;
      const maxValue = trip.max_price;
      if (minValue === 0 && maxValue === 0) {
        return "FREE";
      }
      return `DZD ${minValue} - DZD ${maxValue}`;
    }

    const singlePrice = trip.price ?? 0;
    if (singlePrice === 0) {
      return "FREE";
    }

    return `DZD ${singlePrice}`;
  };

  // Get first meeting location from stops (if available)
  const firstStop = trip.stops?.[0];
  const meetingPoint = firstStop?.label || "Meeting point TBA";

  // Participants tracking
  const currentParticipants = trip.current_participants || 0;
  const minParticipants = trip.min_participants || 0;
  const maxParticipants = trip.max_participants || 1;
  const isUnderMinimum = currentParticipants < minParticipants;
  const progressPercentage = Math.min(
    100,
    Math.max(0, (currentParticipants / maxParticipants) * 100)
  );
  
  // Cutoff line position: (min / max) * 100
  const cutoffPercentage = (minParticipants / maxParticipants) * 100;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {!coverImage || imgError ? (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        ) : (
          <img
            src={coverImage}
            alt={trip.title || "Trip"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {trip.category ? trip.category.charAt(0).toUpperCase() + trip.category.slice(1) : "Trip"}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-center gap-2">
          <div
            className="size-10 rounded-full bg-white/90 border border-white flex items-center justify-center"
            title={isMine ? "Created by me" : "Created by another organizer"}
          >
            {isMine ? (
              <User className="size-5 text-[#0d2805]" />
            ) : (
              <Users className="size-5 text-[#64748b]" />
            )}
          </div>

          {/* Bookmark Button */}
          {showBookmark && (
            <button
              onClick={handleSaveClick}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white transition-all"
            >
              <Bookmark
                className={`size-5 ${
                  isSaved ? "fill-current text-[#ff5900]" : "text-gray-400"
                }`}
              />
            </button>
          )}
        </div>

        {/* Difficulty Badge */}
        {trip.difficulty && (
          <div className="absolute bottom-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            {trip.difficulty.charAt(0).toUpperCase() + trip.difficulty.slice(1)}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 hover:text-green-600 h-14 overflow-hidden">
          {trip.title || "Untitled Trip"}
        </h3>

        {/* Starting Point */}
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 break-words">
              {meetingPoint}
            </p>
          </div>
        </div>

        {/* Dates Row */}
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
          <Calendar className="size-4 text-blue-500 flex-shrink-0" />
          <span>
            {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : "TBA"} - {durationDays} days - {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : "TBA"}
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
          <DollarSign className="size-4 text-green-500 flex-shrink-0" />
          <span className="font-semibold text-gray-900">
            {formatPrice()}
          </span>
        </div>

        {/* Participants Progress Bar */}
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Participants</h4>
          <div className="mb-2">
            <div className="relative pt-4">
              {/* Minimum marker circle at cutoff line */}
              <div
                className="absolute -top-2 h-5 min-w-5 px-1 rounded-full bg-white border border-gray-400 text-[10px] leading-4 font-semibold text-gray-700 flex items-center justify-center"
                style={{
                  left: `${Math.min(cutoffPercentage, 100)}%`,
                  transform: "translateX(-50%)"
                }}
              >
                {minParticipants}
              </div>

              {/* Progress bar with cutoff line */}
              <div className={`relative h-3 rounded-full ${isUnderMinimum ? "bg-orange-200" : "bg-green-200"}`}>
                {/* Filled portion - shows current/max progress */}
                <div
                  className={`absolute h-full rounded-full transition-all ${isUnderMinimum ? "bg-orange-500" : "bg-green-500"}`}
                  style={{
                    width: `${progressPercentage}%`
                  }}
                />

                {/* Cutoff line at minimum threshold */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-500"
                  style={{
                    left: `${Math.min(cutoffPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Participant count label */}
            <div className="text-center text-xs font-semibold text-gray-700 mt-2">
              {currentParticipants}/{maxParticipants}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
