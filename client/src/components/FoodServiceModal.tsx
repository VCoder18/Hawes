import React, { useState } from 'react';
import { Heart, Share2, X, MapPin, Star, Utensils, ShieldCheck, Users, ChevronDown, Calendar, Clock, Download } from 'lucide-react';

interface FoodServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FoodServiceModal: React.FC<FoodServiceModalProps> = ({ isOpen, onClose }) => {
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
              src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=2000&auto=format&fit=crop" 
              alt="Dar El Djazair" 
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
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>

        <div className="px-10 pt-6">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 bg-[#FF5900] text-white text-[11px] font-bold tracking-widest rounded-full uppercase">
              Restaurant
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold text-[#1a2e1e] tracking-tight mb-2">Dar El Djazair</h1>
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#00B70D] font-medium text-sm">
              <MapPin className="w-4 h-4" />
              <span>Didouche Mourad, Algiers, Algeria</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 divide-x divide-gray-200 mb-10">
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <Star className="w-4 h-4 fill-current" />
                <span>4.7</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">342 Reviews</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <Utensils className="w-4 h-4" />
                <span>1000 DZD</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price Level</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>100%</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Halal Certified</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                <Users className="w-4 h-4" />
                <span>Friendly</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Atmosphere</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">About The Restaurant</h3>
            </div>
            <div className="text-[13px] text-gray-600 leading-relaxed space-y-4 pr-4">
              <p>Experience authentic Algerian cuisine in an elegant setting that honors centuries of culinary tradition. Our chef, trained by his grandmother in the art of traditional cooking, sources ingredients from local markets and family farms across Algeria.</p>
              <p>Each dish tells a story of our rich cultural heritage, from the aromatic spices of the southern desert to the fresh Mediterranean flavors of the coast. Enjoy an unforgettable dining experience in the heart of Algiers.</p>
            </div>
          </div>

          {/* Culinary Journey Timeline */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">Culinary Journey</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative">
              {/* Connecting line */}
              <div className="absolute left-[45px] top-12 bottom-12 w-[1px] bg-gray-200"></div>
              
              <div className="space-y-8 relative">
                <div className="flex gap-6">
                  <div className="w-7 h-7 rounded-full bg-[#FF5900] text-white flex items-center justify-center text-xs font-bold shrink-0 relative z-10">1</div>
                  <div>
                    <h4 className="font-bold text-[#FF5900] mb-1">Initial Request</h4>
                    <p className="text-sm text-gray-600">Submit your preferred date and guest count. Our concierge will review the estate's private events calendar.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-7 h-7 rounded-full bg-[#FF5900] text-white flex items-center justify-center text-xs font-bold shrink-0 relative z-10">2</div>
                  <div>
                    <h4 className="font-bold text-[#FF5900] mb-1">Menu Selection</h4>
                    <p className="text-sm text-gray-600">Begin with vibrant salads, traditional chorba, and freshly baked kesra bread.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-7 h-7 rounded-full bg-[#FF5900] text-white flex items-center justify-center text-xs font-bold shrink-0 relative z-10">3</div>
                  <div>
                    <h4 className="font-bold text-[#FF5900] mb-1">Estate Confirmation</h4>
                    <p className="text-sm text-gray-600">Receive your personalized digital itinerary and arrival instructions via our concierge app.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Policies & Amenities */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">Policies & Amenities</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Family Friendly & Special Occasions', icon: Users },
                { title: 'Dietary Accommodations', icon: Utensils },
                { title: 'Beverage Selection', icon: Utensils }
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
              <button className="text-xs font-bold text-[#00B70D] text-right">View All 124<br/>Reviews</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex text-[#FF5900] mb-3">
                  <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                </div>
                <p className="text-[13px] text-gray-600 mb-4 italic">"An otherworldly experience. Dining as the sun set over the dunes was while sipping their home-grown kherwa is a memory we will never forget."</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Amina+Farhat" alt="Amina" /></div>
                  <div>
                    <h5 className="text-[10px] font-bold text-[#1a2e1e]">Amina Farhat</h5>
                    <p className="text-[9px] text-gray-400">August 2024</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex text-[#FF5900] mb-3">
                  <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                </div>
                <p className="text-[13px] text-gray-600 mb-4 italic">"The attention to detail in the food and wine pairings was world-class. Truly a premium 'farm to table' experience that feels authentic."</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Jalal+Lukman" alt="Jalal" /></div>
                  <div>
                    <h5 className="text-[10px] font-bold text-[#1a2e1e]">Jalal Lukman</h5>
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
            <p className="text-xs text-green-200/60">Per person, minimum 2 people per group</p>
          </div>

          {/* Availability & Booking */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <h3 className="font-bold text-[#1a2e1e] mb-4">Check Availability</h3>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Availability</p>
                  <p className="text-sm font-semibold text-[#1a2e1e]">Daily, 12:00 PM - 11:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-[#1a2e1e]">Recommended for Dinner</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#00B70D] text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
                Book Dinner
              </button>
              <button className="flex-1 bg-[#1a2e1e] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2a4530] transition-colors">
                Community
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Attachments</p>
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-[#1a2e1e]">Full Menu.pdf</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">Download</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FoodServiceModal;
