import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Heart, Share2, X, MapPin, Star, Tent, Utensils, ShieldCheck, Users, Globe, Award, Leaf, Building2, Bus, ChevronDown, Calendar, Clock, Download, Plus, Minus, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Map, { Marker, Source, Layer, type MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import { parseDestinationCoordinates } from "@/lib/create-trip-utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { supabase } from "@/lib/supabase";
import { useServiceFavorites } from "@/hooks/useServiceFavorites";

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: {
    id: number;
    name: string;
    description: string;
    category: string;
    address: string;
    location: unknown;
    min_cost: number;
    max_cost: number;
    image: string;
    images: string[] | null;
    status: string;
    availability: string[];
    additional_stat: string | null;
  };
}

const ALGERIA_CENTER = { lat: 28.0339, lng: 1.6596 };
const ALGERIA_BOUNDS: [[number, number], [number, number]] = [
  [-10.0, 16.0],
  [13.5, 37.5],
];
const MIN_ALGERIA_ZOOM = 0.8;
const ZOOM_IN_STEP = 0.2;
const ZOOM_OUT_STEP = 1.5;

const MINIMAL_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    minimal: {
      type: "raster",
      tiles: ["https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "OpenStreetMap contributors, CARTO",
    },
  },
  layers: [{ id: "minimal-raster", type: "raster", source: "minimal", paint: { "raster-opacity": 0.96 } }],
};

const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-raster",
      type: "raster",
      source: "osm",
      paint: {
        "raster-opacity": 0.92,
        "raster-brightness-min": 0.08,
        "raster-brightness-max": 0.98,
        "raster-saturation": -0.25,
      },
    },
  ],
};

const OSM_DARK_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osmDark: {
      type: "raster",
      tiles: ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "OpenStreetMap contributors, CARTO",
    },
  },
  layers: [
    {
      id: "osm-dark-raster",
      type: "raster",
      source: "osmDark",
      paint: {
        "raster-opacity": 0.94,
      },
    },
  ],
};

const categoryIcons: Record<string, React.ElementType> = {
  restauration: Utensils,
  accommodation: Building2,
  guides: MapPin,
  transportation: Bus,
};
const categoryColors: Record<string, string> = {
  restauration: 'bg-orange-500',
  accommodation: 'bg-blue-500',
  guides: 'bg-green-500',
  transportation: 'bg-purple-500',
};

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ isOpen, onClose, service }) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [algeriaBorder, setAlgeriaBorder] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'tiled' | 'minimal' | 'dark'>('minimal');
  const [cinematicMode, setCinematicMode] = useState(false);
  const mapPitch = cinematicMode ? 50 : 0;
  const mapBearing = cinematicMode ? -25 : 0;
  const mapStyleUrl = mapStyle === 'dark' ? OSM_DARK_RASTER_STYLE : mapStyle === 'minimal' ? MINIMAL_STYLE : OSM_RASTER_STYLE;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const serviceImages = service?.images && service.images.length > 0 ? service.images : service?.image ? [service.image] : [];
  const reviewsRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Array<any>>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const { isFavorited, toggleFavorite } = useServiceFavorites();

  const coords = useMemo(() => {
    if (!service) return null;
    return parseDestinationCoordinates(service as any);
  }, [service]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAlgeriaBorder = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
          { signal: controller.signal }
        );
        if (!response.ok) return;
        const world = (await response.json()) as any;
        const algeriaFeature = world.features.find((feature: any) => {
          const properties = feature?.properties || {};
          const name = String(properties.name || properties.ADMIN || properties.NAME_EN || "").toLowerCase();
          const iso3 = String(properties.ISO_A3 || properties.iso_a3 || "").toUpperCase();
          return name === "algeria" || iso3 === "DZA";
        });
        if (!algeriaFeature) return;
        setAlgeriaBorder({ type: "FeatureCollection", features: [algeriaFeature] });
      } catch {}
    };
    void fetchAlgeriaBorder();
    return () => controller.abort();
  }, []);

  // Fetch reviews for this service
  const fetchReviews = useCallback(async () => {
    if (!service) return;
    setReviewsLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_reviews')
        .select('*, author:profiles!author_id(id, display_name, avatar_url)')
        .eq('service_id', service.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching service reviews:', err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [service?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Submit review
  const submitReview = async () => {
    if (!service || reviewRating === 0) return;
    
    setReviewLoading(true);
    setReviewError(null);
    
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('service_reviews')
        .insert({
          service_id: service.id,
          author_id: session.user.id,
          rating: reviewRating,
          description: reviewText.trim() || null,
        });
      
      if (error) throw error;
      
      setReviewSuccess(true);
      setReviewRating(0);
      setReviewText('');
      // Refresh reviews list
      await fetchReviews();
      
      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleZoomIn = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.easeTo({ zoom: map.getZoom() + ZOOM_IN_STEP, duration: 250 });
  };

  const handleZoomOut = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const currentZoom = map.getZoom();
    if (currentZoom <= MIN_ALGERIA_ZOOM + 0.15) {
      map.fitBounds(ALGERIA_BOUNDS, { padding: 30, duration: 300 });
      return;
    }
    map.easeTo({ zoom: Math.max(MIN_ALGERIA_ZOOM, currentZoom - ZOOM_OUT_STEP), duration: 250 });
  };

  const handleAdjustView = () => {
    if (!mapRef.current || !coords) return;
    mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 13, duration: 500 });
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const getCategoryLabel = () => {
    if (!service) return '';
    switch (service.category.toLowerCase()) {
      case 'restauration': return 'Restaurant';
      case 'accommodation': return 'Accommodation';
      case 'guides': return 'Local Guide';
      case 'transportation': return 'Transportation';
      default: return service.category;
    }
  };

  const getReviewsSummary = () => {
    if (reviews.length === 0) return { avg: '--', count: '0 Reviews' };
    const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
    return { avg: avg.toFixed(1), count: `${reviews.length} Review${reviews.length !== 1 ? 's' : ''}` };
  };

  const stats = useMemo(() => {
    const summary = getReviewsSummary();
    const items = [
      { icon: Star, value: summary.avg, subLabel: summary.count },
    ];
    if (service?.additional_stat) {
      items.push({ icon: Info, value: service.additional_stat, subLabel: '' });
    }
    return items;
  }, [reviews, service?.additional_stat]);

  const gridCols = stats.length === 2 ? 'grid-cols-2' : 'grid-cols-1';

  if (!isOpen || !service) return null;

  const getAboutTitle = () => {
    switch (service.category.toLowerCase()) {
      case 'restauration': return 'About The Restaurant';
      case 'accommodation': return 'About The Sanctuary';
      case 'guides': return 'About The Tour';
      default: return 'About This Service';
    }
  };

  const getTimelineTitle = () => {
    switch (service.category.toLowerCase()) {
      case 'restauration': return 'Culinary Journey';
      case 'accommodation': return 'Stay Procedure';
      case 'guides': return 'Tour Itinerary';
      default: return 'How It Works';
    }
  };

  const getTimelineSteps = () => {
    switch (service.category.toLowerCase()) {
      case 'restauration':
        return [
          { title: 'Initial Request', desc: 'Submit your preferred date and guest count.' },
          { title: 'Menu Selection', desc: 'Review available menu options and selections.' },
          { title: 'Confirmation', desc: 'Receive your personalized itinerary.' }
        ];
      case 'accommodation':
        return [
          { title: 'Check-in', desc: 'Digital check-in with your app.' },
          { title: 'Room Selection', desc: 'Choose your preferred accommodation upon arrival.' },
          { title: 'Enjoy', desc: 'Experience your stay with all amenities included.' }
        ];
      case 'guides':
        return [
          { title: 'Meet Your Guide', desc: 'Connect with your expert local guide.' },
          { title: 'Explore', desc: 'Discover hidden gems and local culture.' },
          { title: 'Reflect', desc: 'Enjoy traditional refreshments and share memories.' }
        ];
      default:
        return [
          { title: 'Browse & Select', desc: 'Explore available options that suit your needs.' },
          { title: 'Confirm Details', desc: 'Review and confirm your booking details.' },
          { title: 'Enjoy!', desc: 'Get confirmation and enjoy your experience.' }
        ];
    }
  };

  const getAccordionItems = () => {
    switch (service.category.toLowerCase()) {
      case 'restauration':
        return [
          { title: 'Family Friendly & Special Occasions', icon: Users },
          { title: 'Dietary Accommodations', icon: Utensils },
          { title: 'Beverage Selection', icon: Utensils }
        ];
      case 'accommodation':
        return [
          { title: 'Conservation Tech', icon: Leaf },
          { title: 'Private Host Service', icon: Users },
          { title: '100% Solar Powered', icon: Leaf }
        ];
      case 'guides':
        return [
          { title: 'Local Heritage Expert', icon: Users },
          { title: 'Refreshments Included', icon: Clock },
          { title: 'Moderate Walking', icon: MapPin }
        ];
      default:
        return [
          { title: 'Policies & Terms', icon: Calendar },
          { title: 'Amenities & Features', icon: Star },
          { title: 'Additional Information', icon: MapPin }
        ];
    }
  };

  const accordionItems = getAccordionItems();

  const getBookingButtonText = () => {
    switch (service.category.toLowerCase()) {
      case 'restauration': return 'Book Dinner';
      case 'accommodation': return 'Book Your Stay';
      case 'guides': return 'Book Tour';
      default: return 'Reserve Now';
    }
  };

  const getAvailabilityText = () => {
    if (service.availability && service.availability.length > 0) {
      return service.availability.join(', ');
    }
    return 'Contact for availability';
  };

  const getDurationText = () => {
    switch (service.category.toLowerCase()) {
      case 'restauration': return 'Recommended for Dinner';
      case 'accommodation': return 'Min 2 Nights';
      case 'guides': return '4 hours';
      default: return 'Flexible';
    }
  };

  const getPricingNote = () => {
    switch (service.category.toLowerCase()) {
      case 'restauration': return 'Per person, minimum 2 people per group';
      case 'accommodation': return 'Per night, including transfers and desert activities';
      case 'guides': return 'Per person, maximum 8 people per group';
      default: return 'Final price may vary based on specific requirements';
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div ref={modalContentRef} className="relative w-full max-w-2xl bg-[#FCFDF8] rounded-[32px] shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-gray-100 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Image Section */}
        <div className="relative h-72 w-full p-4">
          <div className="absolute inset-0 px-4 pt-4">
            <div className="w-full h-full rounded-3xl overflow-hidden relative">
              {serviceImages.length > 0 && (
                <img 
                  src={serviceImages[currentImageIndex]}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
          
          {/* Carousel Arrows */}
          {serviceImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(i => (i - 1 + serviceImages.length) % serviceImages.length)}
                className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-[#1a2e1e]" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(i => (i + 1) % serviceImages.length)}
                className="absolute right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-[#1a2e1e]" />
              </button>
            </>
          )}
          
          {/* Top Buttons */}
          <div className="absolute top-8 left-8 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id); }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorited(service.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <div className={`w-10 h-10 ${categoryColors[service.category?.toLowerCase()] || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
              {(() => {
                const IconComponent = categoryIcons[service.category?.toLowerCase()];
                return IconComponent ? <IconComponent className="w-5 h-5 text-white" /> : <MapPin className="w-5 h-5 text-white" />;
              })()}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Carousel Dots */}
          {serviceImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {serviceImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-10 pt-6">
          {/* Badge */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="px-4 py-1 bg-[#FF5900] text-white text-[11px] font-bold tracking-widest rounded-full uppercase">
              {getCategoryLabel()}
            </span>
            {service.status && (
              <span className={`px-3 py-1 text-[11px] font-bold tracking-widest rounded-full uppercase ${
                service.status === 'Available'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {service.status}
              </span>
            )}
          </div>

          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold text-[#1a2e1e] tracking-tight mb-2">{service.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#00B70D] font-medium text-sm">
              <MapPin className="w-4 h-4" />
              <span>{service.address}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`grid ${gridCols} divide-x divide-gray-200 mb-10`}>
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center px-2 text-center">
                <div className="flex items-center gap-1 font-bold text-gray-900 mb-1">
                  <stat.icon className="w-4 h-4" />
                  <span>{stat.value}</span>
                </div>
                {stat.subLabel && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.subLabel}</span>
                )}
              </div>
            ))}
          </div>

          {/* About Section */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">{getAboutTitle()}</h3>
            </div>
            <div className="text-[13px] text-gray-600 leading-relaxed space-y-4 pr-4">
              <p>{service.description}</p>
            </div>
          </div>

          {/* Map Section */}
          {coords && (
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-6 h-0.5 bg-[#00B70D]"></div>
                <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">Location</h3>
              </div>

              <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                <div className="border-b border-[#e2e8f0] px-3 py-2 flex flex-wrap items-center gap-2 bg-[#fcfdf9]">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => setCinematicMode(!cinematicMode)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        cinematicMode
                          ? "bg-[#0a84ff] text-white"
                          : "bg-[#e2e8f0] text-[#6a7282] hover:bg-[#d1d5db]"
                      }`}
                    >
                      {cinematicMode ? "Cinematic" : "Normal"} View
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const modes: Array<'tiled' | 'minimal' | 'dark'> = ['tiled', 'minimal', 'dark'];
                        const currentIndex = modes.indexOf(mapStyle);
                        const nextIndex = (currentIndex + 1) % modes.length;
                        setMapStyle(modes[nextIndex]);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-150 cursor-pointer hover:shadow-sm active:scale-95 ${
                        mapStyle === 'dark'
                          ? "bg-[#0d2805] text-white hover:bg-[#0f3508]"
                          : mapStyle === 'minimal'
                            ? "bg-[#f5f5f5] text-[#333333] hover:bg-[#e8e8e8]"
                            : "bg-[#e2e8f0] text-[#6a7282] hover:bg-[#d1d5db]"
                      }`}
                    >
                      {mapStyle === 'tiled' ? "Tiled" : mapStyle === 'minimal' ? "Minimal" : "Dark"} Mode
                    </button>
                    <button
                      type="button"
                      onClick={handleAdjustView}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-[#e2e8f0] text-[#6a7282] hover:bg-[#d1d5db] transition-all duration-150 cursor-pointer hover:shadow-sm active:scale-95"
                    >
                      Adjust
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[300px]">
                  <Map
                    ref={mapRef}
                    mapLib={maplibregl}
                    mapStyle={mapStyleUrl}
                    initialViewState={{
                      latitude: coords.lat,
                      longitude: coords.lng,
                      zoom: 13,
                    }}
                    pitch={mapPitch}
                    bearing={mapBearing}
                    minZoom={MIN_ALGERIA_ZOOM}
                    maxBounds={ALGERIA_BOUNDS}
                    style={{ width: "100%", height: "300px" }}
                  >
                    {algeriaBorder && (
                      <Source id="algeria-border" type="geojson" data={algeriaBorder}>
                        <Layer
                          id="algeria-border-line"
                          type="line"
                          paint={{
                            "line-color": "#dc2626",
                            "line-width": 4,
                            "line-opacity": 0.95,
                          }}
                        />
                      </Source>
                    )}

                    <Marker longitude={coords.lng} latitude={coords.lat} anchor="bottom">
                      <svg width="32" height="40" viewBox="0 0 32 40" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                        <path
                          d="M 16 0 C 8 0 2 6 2 14 C 2 24 16 40 16 40 C 16 40 30 24 30 14 C 30 6 24 0 16 0 Z"
                          fill="#00b70d"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <circle cx="16" cy="12" r="6" fill="white" />
                      </svg>
                    </Marker>
                  </Map>

                  <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      className="size-9 rounded-lg bg-white/95 border border-[#d1d5db] shadow-sm hover:bg-white transition-colors flex items-center justify-center"
                      aria-label="Zoom in"
                    >
                      <Plus className="size-4 text-[#0d2805]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      className="size-9 rounded-lg bg-white/95 border border-[#d1d5db] shadow-sm hover:bg-white transition-colors flex items-center justify-center"
                      aria-label="Zoom out"
                    >
                      <Minus className="size-4 text-[#0d2805]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">{getTimelineTitle()}</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative">
              <div className="absolute left-[45px] top-12 bottom-12 w-[1px] bg-gray-200"></div>
              
              <div className="space-y-8 relative">
                {getTimelineSteps().map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-7 h-7 rounded-full bg-[#FF5900] text-white flex items-center justify-center text-xs font-bold shrink-0 relative z-10">{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-[#FF5900] mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accordion Section */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-0.5 bg-[#00B70D]"></div>
              <h3 className="text-xs font-bold text-[#1a2e1e] tracking-widest uppercase">Details & Information</h3>
            </div>
            
            <div className="space-y-3">
              {accordionItems.map((item, i) => (
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
          <div ref={reviewsRef} className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1a2e1e]">Reviews</h3>
              <button
                onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-xs font-bold text-[#00B70D] text-right"
              >View All<br/>Reviews</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex text-[#FF5900] mb-3">
                  <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                </div>
                <p className="text-[13px] text-gray-600 mb-4 italic">"Excellent experience! Highly recommended for anyone looking for quality service."</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Verified" alt="Reviewer" /></div>
                  <div>
                    <h5 className="text-[10px] font-bold text-[#1a2e1e]">Verified Customer</h5>
                    <p className="text-[9px] text-gray-400">Recent</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex text-[#FF5900] mb-3">
                  <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                </div>
                <p className="text-[13px] text-gray-600 mb-4 italic">"Amazing! The attention to detail and professionalism was outstanding."</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Happy" alt="Happy" /></div>
                  <div>
                    <h5 className="text-[10px] font-bold text-[#1a2e1e]">Happy Client</h5>
                    <p className="text-[9px] text-gray-400">Last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#1a2e1e] rounded-2xl p-6 text-white mb-6">
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">Price Range</p>
            <h2 className="text-2xl font-bold mb-1">{service.min_cost.toLocaleString()}<span className="text-sm font-normal">DZD</span> - {service.max_cost.toLocaleString()}<span className="text-sm font-normal">DZD</span></h2>
            <p className="text-xs text-green-200/60">{getPricingNote()}</p>
          </div>

          {/* Availability & Booking */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
            <h3 className="font-bold text-[#1a2e1e] mb-4">Check Availability</h3>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Availability</p>
                  <p className="text-sm font-semibold text-[#1a2e1e]">{getAvailabilityText()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-[#1a2e1e]">{getDurationText()}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#00B70D] text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
                {getBookingButtonText()}
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
                <span className="text-sm font-semibold text-[#1a2e1e]">Service Details.pdf</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">Download</span>
            </div>
          </div>
          
          {/* Review Submission Modal */}
          {showReviewModal && (
            <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
              <div className="relative w-full max-w-md bg-[#FCFDF8] rounded-[32px] overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                <div className="px-6 pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-[#1a2e1e]">Leave a Review</h2>
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center mb-2">
                      <span className="mr-2">Your Rating:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`w-8 h-8 flex items-center justify-center text-yellow-400 hover:text-yellow-500 transition-colors ${
                              reviewRating >= star ? 'text-yellow-500' : 'text-yellow-200'
                            }`}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1a2e1e] mb-1">
                        Review (optional)
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full min-h-[80px] p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
                      />
                    </div>
                    
                    {reviewError && (
                      <p className="text-sm text-red-500">{reviewError}</p>
                    )}
                    
                    {reviewSuccess && (
                      <p className="text-sm text-green-500">
                        Thank you for your review!
                      </p>
                    )}
                    
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={submitReview}
                        disabled={reviewLoading || reviewRating === 0}
                        className={`w-full bg-[#00b70d] text-white py-2 px-4 rounded-md font-medium hover:bg-[#00a00a] transition-colors ${
                          reviewLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
};

export default ServiceDetailsModal;
