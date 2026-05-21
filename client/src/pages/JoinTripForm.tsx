import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Search, 
  Bell, 
  MessageSquare, 
  Menu,
  BedDouble,
  Utensils,
  Compass,
  Bus,
  ShieldPlus,
  ChevronDown
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const JoinTripForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States for form
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    additionalDetails: '',
    accommodation: 'Single Room',
    food: 'No restrictions',
    language: 'English',
    adventureLevel: 'Medium',
    activities: 'All activities'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit logic
    console.log("Submitted", formData);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      additionalDetails: '',
      accommodation: 'Single Room',
      food: 'No restrictions',
      language: 'English',
      adventureLevel: 'Medium',
      activities: 'All activities'
    });
  };

  const renderDropdown = (label: string, name: string, options: string[]) => {
    return (
      <div className="relative w-full">
        <select 
          name={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          className="w-full appearance-none bg-[#F5F9F1] text-gray-800 text-[13px] font-semibold py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-[#00B70D] outline-none shadow-sm cursor-pointer"
        >
          {options.map(opt => (
             <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-green-600">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans overflow-x-hidden flex flex-col">
      {/* Header removed to avoid duplication with global navbar */}

      {/* Main Content */}
      <main className="flex-1 max-w-[900px] mx-auto w-full p-4 md:p-8 flex flex-col gap-10">
        
        <div className="mb-2">
          <h1 className="text-[44px] md:text-[56px] font-serif text-[#1A2E05] leading-none mb-1 tracking-tight">Join the trip now</h1>
          <p className="text-[#FF5722] text-sm md:text-base font-medium">start the adventure now</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Form Inputs Left Box */}
            <div className="flex-1 bg-[#F2F4E6]/60 rounded-[24px] p-6 space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-[#4A5D35] uppercase tracking-wider mb-2">FULL NAME</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="ENTER YOUR FULL NAME"
                  className="w-full bg-white rounded-2xl px-5 py-4 text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20 border-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#4A5D35] uppercase tracking-wider mb-2">PHONE NUMBER</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+ 213 560 59 58 57"
                    className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20 border-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#4A5D35] uppercase tracking-wider mb-2">EMAIL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold text-lg">@</span>
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20 border-none"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details Box */}
            <div className="flex-1 flex flex-col">
              <label className="block text-[16px] font-bold text-[#1A2E05] mb-3">Additional Details :</label>
              <div className="bg-[#F2F4E6]/60 rounded-[24px] p-5 flex-1 min-h-[280px]">
                <textarea 
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                  placeholder="Additional details to take in consideration during the trip such as your medical conditions"
                  className="w-full h-full bg-white rounded-2xl p-6 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Mobile Dropdowns Section */}
          <div className="lg:hidden space-y-4">
            <h3 className="text-[15px] font-bold text-[#1A2E05] mb-2">More details :</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-[#F5F9F1] p-1 rounded-xl">
                <span className="pl-4 text-sm font-semibold text-gray-700">Accommodation</span>
                <div className="w-[140px]">{renderDropdown('Accommodation', 'accommodation', ['Single Room', 'Shared Room 2', 'Shared Room +3'])}</div>
              </div>
              <div className="flex items-center justify-between bg-[#F5F9F1] p-1 rounded-xl">
                <span className="pl-4 text-sm font-semibold text-gray-700">Food</span>
                <div className="w-[140px]">{renderDropdown('Food', 'food', ['No restrictions', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Protein-Free', 'Sea Food'])}</div>
              </div>
              <div className="flex items-center justify-between bg-[#F5F9F1] p-1 rounded-xl">
                <span className="pl-4 text-sm font-semibold text-gray-700">Language</span>
                <div className="w-[140px]">{renderDropdown('Language', 'language', ['Kabyle', 'Arabe', 'English', 'French', 'Spanish', 'others'])}</div>
              </div>
              <div className="flex items-center justify-between bg-[#F5F9F1] p-1 rounded-xl">
                <span className="pl-4 text-sm font-semibold text-gray-700">Adventure level</span>
                <div className="w-[140px]">{renderDropdown('Adventure level', 'adventureLevel', ['Low', 'Medium', 'High'])}</div>
              </div>
              <div className="flex items-center justify-between bg-[#F5F9F1] p-1 rounded-xl">
                <span className="pl-4 text-sm font-semibold text-gray-700">Activities</span>
                <div className="w-[140px]">{renderDropdown('Activities', 'activities', ['All activities', 'morning activities only', 'night activities only'])}</div>
              </div>
            </div>
          </div>

          {/* Included Services Section (Desktop layout) */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-[#1A2E05] mb-6">Included services :</h2>
            <div className="grid grid-cols-3 gap-6">
              
              <div className="bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]"><BedDouble className="w-5 h-5" /></div>
                <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">PREMIUM</div>
                <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">Accommodation</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed pr-2">24/7 dedicated assistance and comprehensive medical coverage.</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]"><Utensils className="w-5 h-5" /></div>
                <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">ALL-INCLUSIVE</div>
                <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">Food</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed pr-2">24/7 dedicated assistance and comprehensive medical coverage.</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]"><Compass className="w-5 h-5" /></div>
                <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">CUSTOMIZABLE</div>
                <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">Optional activities</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed pr-2">24/7 dedicated assistance and comprehensive medical coverage.</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]"><MapPin className="w-5 h-5" /></div>
                <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">EXPERT</div>
                <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">Private Guide</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed pr-2">24/7 dedicated assistance and comprehensive medical coverage.</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]"><Bus className="w-5 h-5" /></div>
                <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">CHAUFFEUR</div>
                <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">Local Transport</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed pr-2">24/7 dedicated assistance and comprehensive medical coverage.</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]"><ShieldPlus className="w-5 h-5" /></div>
                <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">SAFETY FIRST</div>
                <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">Medical Support</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed pr-2">24/7 dedicated assistance and comprehensive medical coverage.</p>
              </div>

            </div>
          </div>

          {/* Payment Summary Panel */}
          <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm">
            <h2 className="text-[22px] font-bold text-[#1A2E05] mb-8">Payment Summery</h2>

            {/* Summary Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
              
              {/* Accommodation Item */}
              <div className="flex items-center gap-4 bg-[#FDFCF0] p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[#F5F4EA] flex items-center justify-center shrink-0">
                  <BedDouble className="w-6 h-6 text-[#FF7043]/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#1A2E05] truncate">Accommodation</p>
                  <p className="text-[11px] text-gray-500 truncate">Single Room Premium</p>
                </div>
                <div className="text-[16px] font-black whitespace-nowrap">+150 DZD</div>
              </div>

              {/* Taxes & Fees Item */}
              <div className="flex items-center gap-4 bg-[#FDFCF0] p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[#F5F4EA] flex items-center justify-center shrink-0">
                  <ShieldPlus className="w-6 h-6 text-[#FF7043]/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#1A2E05] truncate">Taxes & Fees</p>
                  <p className="text-[11px] text-gray-500 truncate">Service & Booking</p>
                </div>
                <div className="text-[16px] font-black whitespace-nowrap">+500 DZD</div>
              </div>

              {/* Trans Cost Item */}
              <div className="flex items-center gap-4 bg-[#FDFCF0] p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[#F5F4EA] flex items-center justify-center shrink-0">
                  <Bus className="w-6 h-6 text-[#FF7043]/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#1A2E05] truncate">Trans Cost</p>
                  <p className="text-[11px] text-gray-500 truncate">trans & Essentials</p>
                </div>
                <div className="text-[16px] font-black whitespace-nowrap">+800 DZD</div>
              </div>

              {/* Optional Activities Item */}
              <div className="flex items-center gap-4 bg-[#FDFCF0] p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[#F5F4EA] flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6 text-[#FF7043]/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#1A2E05] truncate">Optional Activities</p>
                  <p className="text-[11px] text-gray-500 leading-tight">Area Tour & traditional<br/>food tasting</p>
                </div>
                <div className="text-[16px] font-black whitespace-nowrap">+220 DZD</div>
              </div>
            </div>

            {/* Total Block */}
            <div className="bg-gradient-to-r from-[#00A80B] to-[#006006] rounded-[24px] p-8 text-white mb-8 shadow-lg shadow-green-900/20 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.33-.89-2.43-1.84H7.81c.1 1.74 1.5 2.84 3.09 3.21V19h2.38v-1.66c1.6-.3 2.86-1.31 2.86-2.9 0-2-1.56-2.82-3.83-3.3z"/></svg>
              </div>
              
              <p className="text-[12px] font-bold uppercase tracking-[2px] text-white/80 mb-2">TOTAL ESTIMATED COST</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[54px] font-black leading-none tracking-tight">2000</span>
                <span className="text-[24px] font-bold">DZD</span>
                <span className="text-[14px] text-white/80 font-medium ml-1">/per person</span>
              </div>
              
              <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full absolute bottom-6 right-6">
                 <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-wider">DYNAMIC REAL-TIME RATE</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center w-full max-w-lg mx-auto mb-8">
              <button 
                onClick={handleSubmit}
                className="flex-1 bg-[#00B70D] hover:bg-[#00a00a] text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-green-600/20 uppercase text-sm tracking-wide"
              >
                SUBMIT
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] font-bold py-4 rounded-xl transition-colors text-sm uppercase tracking-wide border border-[#A5D6A7]/50"
              >
                RESET
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-6">
              <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                <span className="text-[9px] text-gray-500 font-bold">i</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Final prices may vary slightly based on actual conversion rates at the time of booking. We use transparent pricing with no hidden charges.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default JoinTripForm;
