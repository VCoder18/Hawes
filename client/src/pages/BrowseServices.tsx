import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Grid3x3, Map as MapIcon, Compass, Utensils, Building2, Bus, MapPin, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FiltersModal } from "@/components/BrowseDestinations/FiltersModal";
import ServiceDetailsModal from "@/components/ServiceDetailsModal";
import { useServiceFavorites } from "@/hooks/useServiceFavorites";

const categoryChips = [
  { id: "all", label: "All", icon: Compass },
  { id: "restauration", label: "Restauration", icon: Utensils },
  { id: "accommodation", label: "Accommodation", icon: Building2 },
  { id: "transportation", label: "Transportation", icon: Bus },
  { id: "guides", label: "Guides", icon: MapPin },
];

const categoryIcons: Record<string, React.ElementType> = {
  restauration: Utensils,
  accommodation: Building2,
  guides: MapPin,
  transportation: Bus,
};

const ExclusiveServices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [minRating, setMinRating] = useState(0);
  const [selectedPopularity, setSelectedPopularity] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(100);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const { isFavorited, toggleFavorite } = useServiceFavorites();

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (!error && data) {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (service.address || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyFilters = (filters: any) => {
    setMinRating(filters.rating ?? 0);
    setSelectedPopularity(filters.popularity ?? null);
    setMaxDistance(filters.maxDistance ?? 100);
    setSelectedMonth(filters.month ?? null);
    setFiltersOpen(false);
  };

  const handleViewMore = (service: any) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl lg:text-5xl text-[#0d2805] mb-2">
          Exclusive Services
        </h1>
        <p className="text-gray-500 text-sm md:text-base">Premium services for your journey across Algeria</p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search services..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b70d] transition-all"
            />
          </div>

          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#e2e8f0] rounded-xl font-medium text-[#00b70d] hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="size-5" />
            <span>Filters</span>
          </button>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-[#00b70d] shadow-sm"
                  : "text-gray-600"
              }`}
            >
              <Grid3x3 className="size-5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "map"
                  ? "bg-white text-[#00b70d] shadow-sm"
                  : "text-gray-600"
              }`}
            >
              <MapIcon className="size-5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 pb-2">
          {categoryChips.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#00b70d] text-white shadow-lg"
                    : "bg-white text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]"
                }`}
              >
                <IconComponent className="size-5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
           {filteredServices.map((service) => {
             const TypeIcon = categoryIcons[service.category?.toLowerCase()] || MapPin;
             return (
             <div key={service.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewMore(service)}>
               <div className="h-48 bg-gray-200 overflow-hidden relative">
                 <img
                   src={service.image}
                   alt={service.name}
                   className="w-full h-full object-cover hover:scale-105 transition-transform"
                 />
                 <button
                   onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id); }}
                   className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                 >
                   <Heart className={`w-5 h-5 ${isFavorited(service.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                 </button>
                 <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 shadow-md">
                   <TypeIcon className="w-4 h-4 text-[#FF5900]" />
                   <span className="text-xs font-semibold text-gray-700 capitalize">{service.category}</span>
                 </div>
               </div>

               <div className="p-5">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-gray-800 line-clamp-2 text-lg">{service.name}</h3>
                 </div>

                 <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                   <MapPin className="w-4 h-4 shrink-0" />
                   <span className="line-clamp-1">{service.address}</span>
                 </p>

                 <div className="border border-gray-100 mb-4"></div>

                 <div className="flex items-center justify-between">
                   <div className="flex items-baseline gap-1.5">
                     <span className="text-sm text-gray-600">Price Range</span>
                     <span className="text-lg font-bold text-[#FF5900]">
                       {Number(service.min_cost).toLocaleString()} - {Number(service.max_cost).toLocaleString()}
                     </span>
                     <span className="text-xs text-gray-500">DZD</span>
                   </div>

                   <button
                     onClick={(e) => { e.stopPropagation(); setSelectedService(service); setShowServiceModal(true); }}
                     className="bg-[#00B70D] hover:bg-[#009808] text-white font-semibold py-2.5 px-5 rounded-xl transition text-sm whitespace-nowrap"
                   >
                     View Reviews
                   </button>
                 </div>
               </div>
             </div>
             );
           })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found</p>
        </div>
      )}

      {/* Filters Modal */}
      {filtersOpen && (
        <FiltersModal
          onClose={() => setFiltersOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={{
            rating: minRating,
            popularity: selectedPopularity,
            maxDistance,
            month: selectedMonth,
          }}
        />
      )}

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        service={selectedService}
      />
    </div>
  );
};

export default ExclusiveServices;
