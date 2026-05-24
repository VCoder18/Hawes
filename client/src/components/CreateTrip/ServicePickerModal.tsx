import { useState, useEffect } from "react";
import { Search, X, Compass, Utensils, Building2, Bus, MapPin, Heart, Check } from "lucide-react";
import { useServiceFavorites } from "@/hooks/useServiceFavorites";
import ServiceDetailsModal from "@/components/ServiceDetailsModal";

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

interface ServicePickerModalProps {
  open: boolean;
  onClose: () => void;
  services: any[];
  selectedIds: Set<number>;
  onToggle: (service: any) => void;
  initialCategory?: string;
}

export function ServicePickerModal({ open, onClose, services, selectedIds, onToggle, initialCategory }: ServicePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [detailService, setDetailService] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { isFavorited, toggleFavorite } = useServiceFavorites();

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  if (!open) return null;

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !searchQuery.trim() ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.address || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewMore = (service: any) => {
    setDetailService(service);
    setShowDetail(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative bg-[#FDFCF0] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-xl font-bold text-[#0d2805]">Select Services to Add to Your Trip</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="size-5 text-gray-600" />
            </button>
          </div>

          {/* Search & Category Chips */}
          <div className="p-6 pb-0 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b70d] transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 pb-2">
              {categoryChips.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm ${
                      selectedCategory === cat.id
                        ? "bg-[#00b70d] text-white shadow-lg"
                        : "bg-white text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]"
                    }`}
                  >
                    <IconComponent className="size-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => {
                  const isSelected = selectedIds.has(service.id);
                  const TypeIcon = categoryIcons[service.category?.toLowerCase()] || MapPin;
                  return (
                    <div
                      key={service.id}
                      onClick={() => onToggle(service)}
                      className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 cursor-pointer hover:shadow-lg transition-all ${
                        isSelected ? "border-[#00b70d] ring-2 ring-[#00b70d]/20" : "border-gray-100"
                      }`}
                    >
                      <div className="h-40 bg-gray-200 overflow-hidden relative">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(service.id);
                          }}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                        >
                          <Heart
                            className={`w-5 h-5 ${isFavorited(service.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                          />
                        </button>
                        <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 shadow-md">
                          <TypeIcon className="w-4 h-4 text-[#FF5900]" />
                          <span className="text-xs font-semibold text-gray-700 capitalize">{service.category}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#00b70d]/10 flex items-center justify-center">
                            <div className="w-10 h-10 bg-[#00b70d] rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-800 line-clamp-2 text-base">{service.name}</h3>
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="line-clamp-1">{service.address}</span>
                        </p>
                        <div className="border border-gray-100 mb-3" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm text-gray-600">Price Range</span>
                            <span className="text-base font-bold text-[#FF5900]">
                              {Number(service.min_cost).toLocaleString()} - {Number(service.max_cost).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">DZD</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewMore(service);
                            }}
                            className="bg-[#00B70D] hover:bg-[#009808] text-white font-semibold py-2 px-4 rounded-xl transition text-xs whitespace-nowrap"
                          >
                            View More
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
          </div>

          {/* Footer */}
          <div className="border-t border-[#e2e8f0] p-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">
              {selectedIds.size} service{selectedIds.size !== 1 ? "s" : ""} selected
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#00b70d] text-white rounded-xl font-semibold hover:bg-[#00a00a] transition-colors"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>

      <ServiceDetailsModal
        isOpen={showDetail}
        service={detailService}
        onClose={() => {
          setShowDetail(false);
          setDetailService(null);
        }}
      />
    </>
  );
}