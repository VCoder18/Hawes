import React, { useState } from 'react';
import { Heart, Share2, X, MapPin, Star, Tent, Leaf, Award, ChevronDown, Calendar, Clock, Download, Users } from 'lucide-react';

interface StayServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StayServiceModal: React.FC<StayServiceModalProps> = ({ isOpen, onClose }) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FCFDF8] rounded-[32px] overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-gray-100 pb-10">
        
        {/* Top Image Section */}
        <div className="relative h-72 w-full p-4">
          <div className="absolute inset-0 px-4 pt-4">
            <img 
              src="https://images.unsplash.com/photo-1534156039819-c89418369a4f?q=80&w=2000&auto=format&fit=crop" 
              alt="The Crimson Dune Sanctuary" 
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl mx-4 mt-4"></div>
          </div>
          
          {/* Top Buttons */}
          <div className="absolute top-8 left-8 flex gap-2">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>

        <div className="px-10 pt-6">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 bg-[#FF5900] text-white text-[11px] font-bold tracking-widest rounded-full uppercase">
              Accommodation
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold text-[#1a2e1e] tracking-tight mb-2">The Crimson Dune Sanctuary</h1>
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#00B70D] font-medium text-sm">
              <MapPin className="w-4 h-4" />
              <span>Sahara Desert, Algeria</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 divide-x divide-gray-200 mb-10">
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <Star className="w-4 h-4 fill-current" />
                <span>4.8</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">14 Reviews</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <Tent className="w-4 h-4" />
                <span>1-2</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Luxury Tents</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <Leaf className="w-4 h-4" />
                <span>100%</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Eco-Energy</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <Award className="w-4 h-4" />
                <span>Top</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rated Host</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">About The Sanctuary</h3>
            </div>
            <div className="text-[13px] text-gray-600 leading-relaxed space-y-4 pr-4">
              <p>Nestled within the undulating waves of the Sahara Desert, The Crimson Dune Sanctuary is a masterpiece in regenerative luxury. Each villa is an architectural homage to the desert rose, designed to minimize thermal gain while maximizing panoramic views of the protected wildlife reserve.</p>
              <p>Here, the silence of the dunes is your soundtrack. Whether watching diveline onyx from your private terrace or dining under a canopy of stars, every moment is curated to foster a deep connection with the majestic landscapes of Algeria.</p>
            </div>
          </div>

          {/* Stay Procedure Timeline */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">Stay Procedure</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative">
              {/* Connecting line */}
              <div className="absolute left-[45px] top-12 bottom-12 w-[1px] bg-gray-200"></div>
              
              <div className="space-y-8 relative">
                <div className="flex gap-6">
                  <div className="w-7 h-7 rounded-full bg-[#FF5900] text-white flex items-center justify-center text-xs font-bold shrink-0 relative z-10">1</div>
                  <div>
                    <h4 className="font-bold text-[#FF5900] mb-1">Check-in</h4>
                    <p className="text-sm text-gray-600">Digital check-in with your app. 4x4 transfer included.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-7 h-7 rounded-full bg-[#FF5900] text-white flex items-center justify-center text-xs font-bold shrink-0 relative z-10">2</div>
                  <div>
                    <h4 className="font-bold text-[#FF5900] mb-1">Room Selection</h4>
                    <p className="text-sm text-gray-600">Choose your dune view or oasis-facing villa upon arrival.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-7 h-7 rounded-full bg-[#FF5900] text-white flex items-center justify-center text-xs font-bold shrink-0 relative z-10">3</div>
                  <div>
                    <h4 className="font-bold text-[#FF5900] mb-1">Conduct</h4>
                    <p className="text-sm text-gray-600">Zero-waste policy. Help us protect our desert reserve.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability & Service */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">Sustainability & Service</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Conservation Tech', icon: Leaf },
                { title: 'Private Host Service', icon: Users },
                { title: '100% Solar Powered', icon: Leaf }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => toggleAccordion(i)}
                    className="w-full flex items-center justify-between p-4 focus:outline-none"
                  >
                    <div className="flex items-center gap-3 font-semibold text-[#1a2e1e] text-sm">
                      <item.icon className="w-4 h-4 text-gray-500" />
                      {item.title}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeAccordion === i ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === i && (
                    <div className="p-4 pt-0 text-sm text-gray-600">
                      Details about {item.title.toLowerCase()} would go here.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1a2e1e]">Reviews</h3>
              <button className="text-xs font-bold text-[#00B70D] text-right">View All 14<br/>Reviews</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex text-[#FF5900] mb-3">
                  <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                </div>
                <p className="text-[13px] text-gray-600 mb-4 italic">"Super clean, perfectly located, and the traditional breakfast was amazing!"</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Rosa" alt="Rosa" /></div>
                  <div>
                    <h5 className="text-[10px] font-bold text-[#1a2e1e]">Rosa</h5>
                    <p className="text-[9px] text-gray-400">August 2024</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex text-[#FF5900] mb-3">
                  <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                </div>
                <p className="text-[13px] text-gray-600 mb-4 italic">"Incredible stay with breathtaking views, and the host made us feel right at home!"</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Kamal" alt="Kamal" /></div>
                  <div>
                    <h5 className="text-[10px] font-bold text-[#1a2e1e]">Kamal</h5>
                    <p className="text-[9px] text-gray-400">July 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#1a2e1e] rounded-2xl p-6 text-white mb-6">
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">Price Range</p>
            <h2 className="text-2xl font-bold mb-1">850<span className="text-sm font-normal">DZD</span> - 1,200<span className="text-sm font-normal">DZD</span></h2>
            <p className="text-xs text-green-200/60">Per night, including transfers and desert activities</p>
          </div>

          {/* Availability & Booking */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <h3 className="font-bold text-[#1a2e1e] mb-4">Check Availability</h3>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Availability</p>
                  <p className="text-sm font-semibold text-[#1a2e1e]">Year-round</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-[#1a2e1e]">Min 2 Nights</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#00B70D] text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
                Book Your Stay
              </button>
              <button className="flex-1 bg-[#1a2e1e] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2a4530] transition-colors">
                Community
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Attachments</p>
            <div className="flex flex-col gap-2">
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-[#1a2e1e]">Lodge Map.pdf</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">Download</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-[#1a2e1e]">Eco Guide.pdf</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">Download</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default StayServiceModal;
