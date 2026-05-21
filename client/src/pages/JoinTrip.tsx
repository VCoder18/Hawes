import {
  X,
  MapPin,
  Zap,
  Compass,
  Download,
  Home,
  Utensils,
  Tent,
  Bus,
  Shield,
  User,
  Users,
  Puzzle,
  Calendar,
  Clock,
  Share2,
  ShieldCheck,
  Check,
  ChevronUp,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { TripDetailsMap } from "../components/TripDetailsMap";
import { getTripById } from '@/lib/mockData';




const JoinTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrip = () => {
      const previewTrip = (location.state as { previewTrip?: any } | null)?.previewTrip;

      if (previewTrip) {
        setTrip(previewTrip);
        setError(null);
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Trip ID not found");
        setLoading(false);
        return;
      }

      // Use mock data instead of API
      const data = getTripById(id);
      
      if (data) {
        setTrip(data);
      } else {
        setError("Trip not found");
      }
      
      setLoading(false);
    };

    loadTrip();
  }, [id, location.state]);

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="relative bg-[#FDFCF0] rounded-3xl w-[95vw] h-[95vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b70d]" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="relative bg-[#FDFCF0] rounded-3xl p-8 text-center">
          <p className="text-red-500 mb-4">{error || "Trip not found"}</p>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-[#00b70d] text-white rounded-lg hover:bg-[#00a00a]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const coverImage =
    (Array.isArray(trip.images) && trip.images.length > 0 ? trip.images[0] : null) ||
    trip.coverImage;
  const destinations = (trip.stops || []).map((stop: any) => stop.label || "").filter(Boolean);
  const itinerary = trip.itinerary || [];
  const activities = trip.activities || [];
  const included = trip.included || [];
  const notIncluded = trip.not_included || [];
  const whatToBring = trip.what_to_bring || [];
  const currentParticipants = trip.current_participants || 0;
  const maxParticipants = trip.max_participants || 1;
  const availableSpots = Math.max(0, maxParticipants - currentParticipants);
  const pricePerPerson = trip.price || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="relative bg-[#FDFCF0] rounded-3xl w-[95vw] h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
        >
          <X className="w-6 h-6 text-[#1A2E05]" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-full"
        >
      
      {/* Cover Image Section */}
      <div className="relative bg-center h-[350px] w-full">
        {!coverImage ? (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        ) : (
          <img 
            src={coverImage} 
            className="w-full h-full object-cover"
            alt={trip.title}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-8 left-6 md:left-12 text-white">
          <div className="flex gap-2 mb-4">
            <Badge className="bg-[#2D3E20]/80 hover:bg-[#2D3E20] border-none text-[10px] py-1 px-3 flex items-center gap-1">
              <Compass className="w-4 h-4" /> {trip.category || "Adventure"}
            </Badge>
            <Badge className="bg-[#FF5722] hover:bg-[#FF5722] border-none text-[10px] py-1 px-3 flex items-center gap-1">
              <Zap className="w-4 h-4" /> {trip.difficulty || "Moderate"}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{trip.title}</h1>
          <p className="flex items-center gap-1 text-[11px] font-medium text-white/90">
            <MapPin className="w-4 h-4 text-[#FDFCF0]" /> {destinations.join(", ") || "Multiple locations"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10 space-y-12">
        
        {/* TRIP OVERVIEW  */}
        <section>
          <h2 className="text-xl font-bold mb-4">Trip Overview</h2>
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            {trip.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {activities.slice(0, 5).map((activity: string) => (
              <Badge key={activity} className="bg-[#E8F5E9] hover:bg-[#E8F5E9] text-[#4CAF50] border-none rounded-lg px-3 py-1.5 text-[10px] font-bold">
                {activity}
              </Badge>
            ))}
          </div>
        </section>

        {/* TRIP MAP */}
        {trip && (
          <section>
            <h2 className="text-xl font-bold mb-6">Trip Map</h2>
            <TripDetailsMap trip={trip} />
          </section>
        )}

        {/* DAILY ITINERARY  */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1A2E05]">Daily Itinerary</h2>
          </div>
          
          <div className="relative bg-white border border-gray-50 rounded-[35px] p-8 shadow-sm">
            <div className="space-y-8">
              {itinerary.map((item: any, i: number) => {
                const itemText = typeof item === 'string' ? item : item.summary || '';
                const parts = itemText.split('\n');
                const dayTitle = parts[0] || '';
                const dayDesc = parts.slice(1).join('\n').trim();
                
                return (
                  <div key={i} className="relative pl-10">
                    {i < itinerary.length - 1 && (
                      <div className="absolute left-[14px] top-4 bottom-[-34px] w-[1.5px] bg-[#4CAF50]/40" />
                    )}
                    <div className="absolute left-[9px] top-1 w-3 h-3 rounded-full bg-[#4CAF50] border-[3px] border-white z-10 shadow-[0_0_0_1px_rgba(74,175,80,0.3)]" />
                    <div className="flex justify-between items-center group cursor-pointer">
                      <span className="font-bold text-[14px]">Day {i + 1}: {dayTitle}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-[#E8F5E9]`}>
                         <ChevronUp className="w-4 h-4 text-[#4CAF50]" />
                      </div>
                    </div>
                    {dayDesc && (
                      <p className="mt-4 text-gray-500 text-[12px] leading-relaxed max-w-2xl">
                        {dayDesc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#D7EBD8] border-none rounded-xl text-[10px] font-bold gap-1 h-9">
              <Download className="w-4 h-4" /> Download Document
            </Button>
          </div>
        </section>

        {/*WHAT'S INCLUDED*/}
        <section>
          <h2 className="text-xl font-bold mb-6">What's Included & Excluded</h2>
          
          {/* Grille d'icônes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              {icon: Home, label: "Accommodation"}, {icon: Utensils, label: "Meals"}, 
              {icon: Tent, label: "Equipment"}, {icon: Users, label: "Entertainment"},
              {icon: Puzzle, label: "Miscellaneous"}, {icon: User, label: "Guide"},
              {icon: Shield, label: "Insurance"}, {icon: Bus, label: "Transport"}
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="bg-white border border-gray-100 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
                  <span className="text-lg bg-[#F1F8E9] p-1.5 rounded-xl"><IconComponent className="w-5 h-5 text-gray-700" /></span>
                  <span className="text-[11px] font-bold text-gray-700">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boîte Inclus */}
            <div className="bg-white border border-[#E8F5E9] rounded-[30px] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 font-bold text-[13px]">
                   <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center"><Check className="w-4 h-4" /></div>
                   Included
                </div>
                <ChevronUp className="w-5 h-5 text-gray-300" />
              </div>
              <ul className="space-y-4">
                {included.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 text-[11px] leading-relaxed">
                    <Check className="w-4 h-4 text-[#4CAF50] mt-0.5 shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Boîte Exclus */}
            <div className="bg-white border border-[#FBE9E7] rounded-[30px] p-6 shadow-sm h-fit">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 font-bold text-[13px] text-gray-400">
                   <div className="w-6 h-6 rounded-full bg-[#FBE9E7] text-[#FF5722] flex items-center justify-center"><X className="w-4 h-4" /></div>
                   Not Included
                </div>
                <ChevronUp className="w-5 h-5 text-gray-300" />
              </div>
              <ul className="space-y-4">
                {notIncluded.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 text-[11px] leading-relaxed">
                    <X className="w-4 h-4 text-[#FF5722] mt-0.5 shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/*  WHAT TO BRING  */}
        <section>
          <h2 className="text-xl font-bold mb-6">What to Bring</h2>
          <div className="bg-white border border-gray-50 rounded-[35px] p-10 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              {whatToBring.map((item: string) => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*  PRICING & BOOKING  */}
        <div className="pt-8 pb-16">
          <Card className="bg-[#FDFCF0] border border-[#FF5722]/30 rounded-[45px] p-8 shadow-xl shadow-orange-900/5">
             <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Total Price</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-5xl font-black">{pricePerPerson}</span>
                    <span className="text-2xl font-bold">DA</span>
                    <span className="text-gray-400 text-xs font-bold ml-2">/ person</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50"><Calendar className="w-5 h-5 text-gray-600" /></div>
                      <div>
                        <p className="text-[13px] font-bold">{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'TBD'} - {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'TBD'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Fixed Departure</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50"><Clock className="w-5 h-5 text-gray-600" /></div>
                      <div>
                        <p className="text-[13px] font-bold">{trip.startDate && trip.endDate ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0} Days / {trip.startDate && trip.endDate ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) - 1 : 0} Nights</p>
                        <p className="text-[10px] text-gray-400 font-medium">Immersive Experience</p>
                      </div>
                   </div>
                </div>

                <div className="bg-[#D1F2D1]/50 p-5 rounded-[25px] flex justify-between items-center border border-[#B8EBB8]">
                  <div className="text-[12px] font-bold">
                    <p className="text-[#1A2E05]">Limited Availability</p>
                    <p className="text-[#1A2E05]/80 text-[10px]">{currentParticipants} participants</p>
                    <p className="text-[#1A2E05]/60 text-[10px]">{availableSpots} spots available</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-[11px] font-black">
                    {availableSpots}
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/trips/${id}/book`)}
                  className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-8 rounded-[22px] text-base shadow-lg shadow-orange-200 uppercase tracking-wide"
                >
                  Join This Trip →
                </Button>
                
                <div className="flex justify-center gap-8 text-[10px] font-bold text-gray-400">
                   <span className="flex items-center gap-1 cursor-pointer hover:text-green-600"><ShieldCheck className="w-4 h-4" /> Secure Booking</span>
                   <span className="flex items-center gap-1 cursor-pointer hover:text-green-600"><Share2 className="w-4 h-4" /> Share</span>
                </div>
             </div>
          </Card>
        </div>

      </div>
      </div>
      </div>
    </div>
  );
};

export default JoinTrip;