import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Search,
  Bell,
  MessageSquare,
  BedDouble,
  Utensils,
  Compass,
  Bus,
  ShieldPlus,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';

interface ProcedureField {
  k: string;
  l: string;
  t: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'phone';
  r: number;
  p?: string;
  o?: string[];
  min?: number;
  max?: number;
}

interface TripService {
  id: number;
  name: string;
  category: string | null;
  procedure: ProcedureField[];
  min_cost: number;
  max_cost: number;
  image: string | null;
  address: string | null;
}

interface ServiceFormValues {
  [serviceId: number]: {
    [fieldKey: string]: string | string[];
  };
}

const serviceCategoryMap: Record<string, { label: string; icon: React.ElementType; badge: string }> = {
  accommodation: { label: 'Accommodation', icon: BedDouble, badge: 'PREMIUM' },
  restauration: { label: 'Food', icon: Utensils, badge: 'ALL-INCLUSIVE' },
  guides: { label: 'Private Guide', icon: MapPin, badge: 'EXPERT' },
  transportation: { label: 'Local Transport', icon: Bus, badge: 'CHAUFFEUR' },
};

const staticCards = [
  { id: 'activities', label: 'Optional activities', icon: Compass, badge: 'CUSTOMIZABLE' },
  { id: 'medical', label: 'Medical Support', icon: ShieldPlus, badge: 'SAFETY FIRST' },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const JoinTripForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormValues>({});
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    additionalDetails: '',
    accommodation: 'Single Room',
    food: 'No restrictions',
    language: 'English',
    adventureLevel: 'Medium',
    activities: 'All activities',
  });

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const response = await fetch(`${API_BASE_URL}/trips/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTrip(data);
        }
      } catch (err) {
        console.error('Failed to fetch trip:', err);
      }
    };
    fetchTrip();
  }, [id]);

  const serviceStops = (trip?.stops || []).filter(
    (s: any) => s.type === 'service' && s.service_data
  );
  const tripServices: TripService[] = serviceStops.map((s: any) => s.service_data);

  const servicesByCategory = tripServices.reduce<Record<string, TripService[]>>((acc, s) => {
    const cat = s.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceFieldChange = (serviceId: number, fieldKey: string, value: string | string[]) => {
    setServiceForm((prev) => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || {}),
        [fieldKey]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('User not authenticated');
        return;
      }
      
      // Get invite code from URL params if present
      const urlParams = new URLSearchParams(window.location.search);
      const inviteCode = urlParams.get('invite');
      
      const response = await fetch(`${API_BASE_URL}/trips/join/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          ...formData, 
          serviceForm,
          invite_code: inviteCode // Include invite code if present
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to join trip', err);
        return;
      }
      navigate(`/trips/${id}`);
    } catch (error) {
      console.error('Error submitting join trip form', error);
    }
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
      activities: 'All activities',
    });
    setServiceForm({});
  };

  const renderProcedureField = (serviceId: number, field: ProcedureField) => {
    // Normalize common field keys/labels to avoid rendering duplicates
    const COMMON_FIELD_KEYS = new Set([
      'email', 'emailaddress', 'email_address', 'e-mail',
      'phone', 'phonenumber', 'phone_number', 'tel', 'telephone',
      'fullname', 'full_name', 'name'
    ]);
    const norm = (s?: string) => (s || '').toString().toLowerCase().replace(/\s|_|-|\./g, '');
    const keyNorm = norm(field.k) || '';
    const labelNorm = norm(field.l) || '';

    // If this procedure field is a common input (email/phone/name), skip it
    if (COMMON_FIELD_KEYS.has(keyNorm) || COMMON_FIELD_KEYS.has(labelNorm) || /email|phone|tel|name/i.test(field.l)) {
      return null;
    }
    const value = serviceForm[serviceId]?.[field.k] || (field.t === 'checkbox' ? [] : '');

    switch (field.t) {
      case 'text':
      case 'phone':
        return (
          <input
            type={field.t === 'phone' ? 'tel' : 'text'}
            placeholder={field.p || `Enter ${field.l}`}
            value={value as string}
            onChange={(e) => handleServiceFieldChange(serviceId, field.k, e.target.value)}
            required
            className="w-full bg-white rounded-2xl px-5 py-4 text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20 border-none shadow-sm"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.p || `Enter ${field.l}`}
            value={value as string}
            onChange={(e) => handleServiceFieldChange(serviceId, field.k, e.target.value)}
            required
            min={field.min}
            max={field.max}
            className="w-full bg-white rounded-2xl px-5 py-4 text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20 border-none shadow-sm"
          />
        );
      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => handleServiceFieldChange(serviceId, field.k, e.target.value)}
            required
            className="w-full appearance-none bg-[#F5F9F1] text-gray-800 text-[13px] font-semibold py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-[#00B70D] outline-none shadow-sm cursor-pointer"
          >
            <option value="">Select {field.l}</option>
            {(field.o || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="flex flex-wrap gap-3">
            {(field.o || []).map((opt) => {
              const selected = value === opt;
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-semibold ${
                    selected
                      ? 'bg-[#00B70D]/10 text-[#00B70D] border border-[#00B70D]/30'
                      : 'bg-[#F5F9F1] text-gray-700 hover:bg-gray-200 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name={`service-${serviceId}-${field.k}`}
                    value={opt}
                    checked={selected}
                    onChange={(e) => handleServiceFieldChange(serviceId, field.k, e.target.value)}
                    required
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                    selected ? 'border-[#00B70D]' : 'border-gray-400'
                  }`}>
                    {selected && <span className="w-2 h-2 rounded-full bg-[#00B70D]" />}
                  </span>
                  {opt}
                </label>
              );
            })}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex flex-wrap gap-3">
            {(field.o || []).map((opt) => {
              const arr = (value as string[]) || [];
              const checked = arr.includes(opt);
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-semibold ${
                    checked
                      ? 'bg-[#00B70D] text-white shadow-sm'
                      : 'bg-[#F5F9F1] text-gray-700 hover:bg-gray-200 shadow-sm'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={checked}
                    onChange={(e) => {
                      const next = checked
                        ? arr.filter((v) => v !== opt)
                        : [...arr, opt];
                      handleServiceFieldChange(serviceId, field.k, next);
                    }}
                    className="sr-only"
                  />
                  {checked && <Check className="w-4 h-4" />}
                  {opt}
                </label>
              );
            })}
          </div>
        );
      default:
        return (
          <input
            type="text"
            placeholder={field.p || `Enter ${field.l}`}
            value={value as string}
            onChange={(e) => handleServiceFieldChange(serviceId, field.k, e.target.value)}
            required
            className="w-full bg-white rounded-2xl px-5 py-4 text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20 border-none shadow-sm"
          />
        );
    }
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
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCF0] via-[#FDFCF0] to-[#F5F2E0] font-sans overflow-x-hidden flex flex-col">
      <main className="flex-1 max-w-[900px] mx-auto w-full p-4 md:p-8 flex flex-col gap-10">
        <div className="mb-2">
          <h1 className="text-[44px] md:text-[56px] font-serif text-[#1A2E05] leading-none mb-1 tracking-tight">Join the trip now</h1>
          <p className="text-[#FF5722] text-sm md:text-base font-medium">start the adventure now</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="bg-[#F2F4E6]/60 rounded-[24px] p-6 space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-[#4A5D35] uppercase tracking-wider mb-2">FULL NAME</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="ENTER YOUR FULL NAME"
                required
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
                  required
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
                  required
                  className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20 border-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[16px] font-bold text-[#1A2E05] mb-3">Additional Details :</label>
              <textarea
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                placeholder="Additional details to take in consideration during the trip such as your medical conditions"
                className="w-full h-[160px] bg-white rounded-2xl p-6 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#00B70D]/20"
              />
            </div>
          </div>

          {/* Mobile Dropdowns */}
          <div className="lg:hidden space-y-4">
            <h3 className="text-[15px] font-bold text-[#1A2E05] mb-2">More details :</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Accommodation', name: 'accommodation', opts: ['Single Room', 'Shared Room 2', 'Shared Room +3'] },
                { label: 'Food', name: 'food', opts: ['No restrictions', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Protein-Free', 'Sea Food'] },
                { label: 'Language', name: 'language', opts: ['Kabyle', 'Arabe', 'English', 'French', 'Spanish', 'others'] },
                { label: 'Adventure level', name: 'adventureLevel', opts: ['Low', 'Medium', 'High'] },
                { label: 'Activities', name: 'activities', opts: ['All activities', 'morning activities only', 'night activities only'] },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between bg-[#F5F9F1] p-1 rounded-xl">
                  <span className="pl-4 text-sm font-semibold text-gray-700">{d.label}</span>
                  <div className="w-[140px]">{renderDropdown(d.label, d.name, d.opts)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Included Services Section */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-[#1A2E05] mb-6">Included services :</h2>
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(serviceCategoryMap)
                .filter(([cat]) => (servicesByCategory[cat] || []).length > 0)
                .map(([cat, def]) => {
                const catServices = servicesByCategory[cat] || [];
                const isExpanded = expandedCategory === cat;
                const IconComponent = def.icon;
                return (
                  <div key={cat}>
                    <button
                      type="button"
                      onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                      className="w-full bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">
                        {def.badge}
                      </div>
                      <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">{def.label}</h3>
                      <p className="text-[10px] text-gray-500 leading-relaxed pr-2">
                        {catServices.length > 0
                          ? `${catServices.length} service${catServices.length > 1 ? 's' : ''} available`
                          : '24/7 dedicated assistance and comprehensive medical coverage.'}
                      </p>
                      {catServices.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-[#00B70D] text-xs font-semibold">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span>{isExpanded ? 'Hide' : 'View'} services</span>
                        </div>
                      )}
                    </button>
                    {isExpanded && catServices.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {catServices.map((svc) => (
                          <div key={svc.id} className="bg-[#F5F9F1] rounded-xl p-3 border border-[#00B70D]/10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#00B70D]/10 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-[#00B70D]" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1A2E05]">{svc.name}</p>
                                <p className="text-[10px] text-gray-500">{svc.min_cost.toLocaleString()} - {svc.max_cost.toLocaleString()} DZD</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {staticCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div key={card.id} className="bg-white rounded-[24px] p-6 border border-transparent hover:border-[#00B70D]/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4 text-[#FF7043]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="inline-block bg-[#F5F5F5] text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded mb-2">
                      {card.badge}
                    </div>
                    <h3 className="text-[15px] font-bold text-[#1A2E05] mb-1.5">{card.label}</h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed pr-2">24/7 dedicated assistance and comprehensive medical coverage.</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Procedure fields from services */}
          {tripServices.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#1A2E05] mb-6">Service Details :</h2>
              <div className="space-y-8">
              {tripServices.map((svc) => (
                  <div key={svc.id} className="bg-[#F2F4E6]/60 rounded-[24px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#00B70D]/10 flex items-center justify-center">
                        <Check className="w-5 h-5 text-[#00B70D]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1A2E05]">{svc.name}</h3>
                        <p className="text-[11px] text-gray-500">{svc.category} • {svc.min_cost.toLocaleString()} - {svc.max_cost.toLocaleString()} DZD</p>
                      </div>
                    </div>
                    <div className="space-y-4">
{Array.isArray(svc.procedure) && svc.procedure.map((field) => (
  <div key={field.k}>
    <label className="block text-[13px] font-bold text-[#4A5D35] uppercase tracking-wider mb-2">
      {field.l} <span className="text-red-500">*</span>
    </label>
    {renderProcedureField(svc.id, field)}
  </div>
))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm">
            <h2 className="text-[22px] font-bold text-[#1A2E05] mb-8">Payment Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
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

            <div className="flex gap-4 justify-center w-full max-w-lg mx-auto mb-8">
              <button
                type="submit"
                className="flex-1 bg-[#00B70D] hover:bg-[#00a00a] text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-green-600/20 uppercase text-sm tracking-wide"
              >
                SUBMIT
              </button>
              <button
                type="button"
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
