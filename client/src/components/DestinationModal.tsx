import { X, Heart, Share2, MapPin, Star, Users, Calendar, Route, Sun, Wind, ChevronRight, CloudRain, Tent, UtensilsCrossed, Map, MessageCircle, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DestinationModalProps {
  destination: {
    id: string | number;
    name: string;
    type: string;
    region: string;
    city?: string;
    image: string;
    images?: string[];
    rating: number;
    reviews: number;
    peopleVisiting: number;
    tripsAvailable: number;
    category: string;
    description?: string;
    best_periods?: string[];
  };
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}

export function DestinationModal({ destination, isSaved, onToggleSave, onClose }: DestinationModalProps) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  
  // Use images array from database, fall back to single image repeated if not available
  const images = destination.images && destination.images.length > 0 
    ? destination.images 
    : [destination.image, destination.image, destination.image];

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  // Convert MM-DD:MM-DD format to readable month names
  const formatBestPeriod = (period: string): string => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    try {
      const [startStr, endStr] = period.split(":");
      const [startMonth, startDay] = startStr.split("-").map(Number);
      const [endMonth, endDay] = endStr.split("-").map(Number);
      
      const start = monthNames[startMonth - 1] || "";
      const end = monthNames[endMonth - 1] || "";
      
      return `${start} ${startDay} - ${end} ${endDay}`;
    } catch {
      return period;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-2 sm:inset-6 md:inset-y-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[#ffffe8] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Hero Image with Carousel */}
        <div className="relative h-64 sm:h-80 shrink-0 bg-gray-200">
          {failedImages.has(currentImageIndex) ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-lg bg-gray-400 mx-auto animate-pulse" />
                <p className="text-gray-500 text-sm">Image unavailable</p>
              </div>
            </div>
          ) : (
            <img 
              src={images[currentImageIndex]} 
              alt={destination.name}
              className="w-full h-full object-cover"
              onError={() => handleImageError(currentImageIndex)}
            />
          )}
          
          {/* Image Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`size-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? "bg-white w-6" 
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Top Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave();
                }}
                className={`p-2.5 rounded-full backdrop-blur-sm transition-all ${
                  isSaved ? "bg-[#00b70d] text-white" : "bg-white/90 text-text-[#ff5900]"
                }`}
              >
                <Heart className={`size-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 bg-white/90 hover:bg-white rounded-full backdrop-blur-sm transition-all"
              >
                <Share2 className="size-5 text-text-[#ff5900]" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/90 hover:bg-white rounded-full backdrop-blur-sm transition-all"
            >
              <X className="size-5 text-text-[#ff5900]" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto destination-modal-scrollbar">
          <div className="p-6 space-y-6">
            {/* Title and Location */}
            <div>
              <h2 className="font-['Inter'] font-black text-3xl sm:text-4xl text-[#0d2805] mb-3">
                {destination.name}
              </h2>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#6a7282]">
                  <MapPin className="size-5 text-[#ff5900]" />
                  <span className="font-bold text-lg">
                    {destination.city || destination.region}, Algeria
                  </span>
                </div>
                <span className="px-4 py-1.5 bg-[#00b70d]/10 border border-[#00b70d]/20 text-[#00b70d] rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                  {destination.category}
                </span>
              </div>
            </div>

            {/* Horizontal Divider */}
            <div className="border-t border-[#d6d0c4]" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="size-4 fill-[#ff5900] text-[#ff5900]" />
                  <span className="font-bold text-[#0d2805]">{destination.rating}</span>
                </div>
                <p className="text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  {destination.reviews} Reviews
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Route className="size-4 text-[#00b70d]" />
                  <span className="font-bold text-[#0d2805]">{destination.tripsAvailable}</span>
                </div>
                <p className="text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Avail. Trips
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Users className="size-4 text-[#99a1af]" />
                  <span className="font-bold text-[#0d2805]">{destination.peopleVisiting.toLocaleString()}</span>
                </div>
                <p className="text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Visiting Now
                </p>
              </div>


            </div>

            {/* The Experience */}
            <div className="border-l-2 border-[#c4bea9] pl-6">
              <h3 className="font-['Inter'] font-bold text-[#0d2805] text-sm uppercase tracking-wider mb-3">
                — The Experience
              </h3>
              <p className="text-[#0d2805] leading-relaxed">
                {destination.description || "Discover the unique charm and natural beauty of this remarkable destination. Explore local culture, stunning landscapes, and unforgettable experiences."}
              </p>
            </div>

            {/* Live Weather & Best Period */}
            <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Live Weather */}
                <div>
                  <h3 className="font-bold text-[#6a7282] text-sm uppercase tracking-wider mb-3">
                    Live Weather
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Sun className="size-8 text-[#ff5900]" />
                      <div>
                        <p className="font-bold text-2xl text-[#0d2805]">28°C</p>
                        <p className="text-xs text-[#6a7282]">Clear Sky</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <CloudRain className="size-4 text-[#6a7282]" />
                        <span className="text-[#6a7282]">0%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="size-4 text-[#6a7282]" />
                        <span className="text-[#6a7282]">16 km/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Period */}
                <div className="border-l-2 border-[#c4bea9] pl-6">
                  <h3 className="font-bold text-[#6a7282] text-sm uppercase tracking-wider mb-3">
                    Best Period to Visit
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.best_periods && destination.best_periods.length > 0 ? (
                      destination.best_periods.map((period, index) => (
                        <div key={index} className="bg-white border border-[#d6d0c4] rounded-lg px-3 py-2 shadow-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-[#00b70d]" />
                            <span className="font-bold text-sm text-[#0d2805]">{formatBestPeriod(period)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-[#d6d0c4] rounded-lg px-3 py-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-[#6a7282]" />
                          <span className="font-bold text-sm text-[#6a7282]">Year-round</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Distance from Major Cities */}
            <div>
              <h3 className="font-bold text-[#0d2805] text-xl mb-4">
                Distance from major cities
              </h3>
              <div className="flex flex-wrap gap-2">
                <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-full px-5 py-3 shadow-sm flex items-center gap-2">
                  <span className="font-bold text-[#0d2805]">Algiers</span>
                  <div className="size-1.5 rounded-full bg-[#00b70d]" />
                  <span className="font-black text-[#00b70d]">1,981 km</span>
                </div>
                <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-full px-5 py-3 shadow-sm flex items-center gap-2">
                  <span className="font-bold text-[#0d2805]">Oran</span>
                  <div className="size-1.5 rounded-full bg-[#00b70d]" />
                  <span className="font-black text-[#00b70d]">1,950 km</span>
                </div>
                <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-full px-5 py-3 shadow-sm flex items-center gap-2">
                  <span className="font-bold text-[#0d2805]">Illizi</span>
                  <div className="size-1.5 rounded-full bg-[#00b70d]" />
                  <span className="font-black text-[#00b70d]">1,050 km</span>
                </div>
              </div>
            </div>

            {/* Curated Services */}
            <div>
              <h3 className="font-bold text-[#0d2805] text-xl mb-4">
                Curated Services
              </h3>
              <div className="space-y-3">
                <ServiceItem icon={Tent} title="Desert Camps" />
                <ServiceItem icon={UtensilsCrossed} title="Traditional Food" />
                <ServiceItem icon={Map} title="Tuareg Guides" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {/* Row 1: Join Trip (full width) */}
              <button className="w-full px-6 py-4 bg-[#00b70d] hover:bg-[#00b70d]-hover text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 sm:col-span-2">
                Join Trip
                <ChevronRight className="size-5" />
              </button>
              
              {/* Row 2: Create Trip / Community */}
              <button 
                onClick={() => {
                  navigate("/create-trip", { 
                    state: { selectedDestination: destination } 
                  });
                  onClose();
                }}
                className="w-full px-6 py-4 bg-[#ff5900] hover:bg-[#e54f00] text-white rounded-xl font-bold transition-colors"
              >
                Create Trip
              </button>
              <button className="w-full px-6 py-4 bg-white border-2 border-[#d6d0c4] hover:border-[#00b70d] text-[#0d2805] rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="size-5" />
                Community
              </button>
              
              {/* Row 3: Nearby Destinations / Stats & Details */}
              <button className="w-full px-6 py-4 bg-white border-2 border-[#d6d0c4] hover:border-[#00b70d] text-[#0d2805] rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <Map className="size-5" />
                Nearby Destinations
                <ChevronRight className="size-5" />
              </button>
              <button className="w-full px-6 py-4 bg-white border-2 border-[#d6d0c4] hover:border-[#00b70d] text-[#0d2805] rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <BarChart3 className="size-5" />
                Stats & Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ServiceItem({ icon: IconComponent, title }: { icon: any; title: string }) {
  return (
    <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-2xl p-4 flex items-center justify-between group hover:border-[#00b70d] transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="bg-[#efece8] border border-[#d6d0c4] rounded-xl size-12 flex items-center justify-center text-2xl shadow-sm">
          <IconComponent className="size-6 text-[#00b70d]" />
        </div>
        <span className="font-bold text-[#364153]">{title}</span>
      </div>
      <ChevronRight className="size-5 text-[#00b70d] opacity-50 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}



