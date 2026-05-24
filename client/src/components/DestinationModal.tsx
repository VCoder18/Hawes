import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Heart, Share2, MapPin, Star, Users, Calendar, Route, Sun, Wind, ChevronRight, CloudRain, Cloud, CloudFog, CloudDrizzle, Snowflake, CloudLightning, CloudSun, Tent, UtensilsCrossed, Map as MapIcon, MessageCircle, BarChart3, Loader2, Plus, Minus, Navigation, DollarSign } from "lucide-react";
import Map, { Marker, Source, Layer, type MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import { parseDestinationCoordinates } from "@/lib/create-trip-utils";
import { supabase } from "@/lib/supabase";
import "maplibre-gl/dist/maplibre-gl.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
    location?: unknown;
    lat?: number;
    lng?: number;
  };
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}

interface WeatherData {
  temperature: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  icon: typeof Sun;
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

const WMO_CODES: Record<number, { condition: string; icon: typeof Sun }> = {
  0: { condition: "Clear Sky", icon: Sun },
  1: { condition: "Mainly Clear", icon: CloudSun },
  2: { condition: "Partly Cloudy", icon: CloudSun },
  3: { condition: "Overcast", icon: Cloud },
  45: { condition: "Foggy", icon: CloudFog },
  48: { condition: "Depositing Rime Fog", icon: CloudFog },
  51: { condition: "Light Drizzle", icon: CloudDrizzle },
  53: { condition: "Moderate Drizzle", icon: CloudDrizzle },
  55: { condition: "Dense Drizzle", icon: CloudDrizzle },
  56: { condition: "Light Freezing Drizzle", icon: CloudDrizzle },
  57: { condition: "Dense Freezing Drizzle", icon: CloudDrizzle },
  61: { condition: "Slight Rain", icon: CloudRain },
  63: { condition: "Moderate Rain", icon: CloudRain },
  65: { condition: "Heavy Rain", icon: CloudRain },
  66: { condition: "Light Freezing Rain", icon: CloudRain },
  67: { condition: "Heavy Freezing Rain", icon: CloudRain },
  71: { condition: "Slight Snow", icon: Snowflake },
  73: { condition: "Moderate Snow", icon: Snowflake },
  75: { condition: "Heavy Snow", icon: Snowflake },
  77: { condition: "Snow Grains", icon: Snowflake },
  80: { condition: "Slight Rain Showers", icon: CloudRain },
  81: { condition: "Moderate Rain Showers", icon: CloudRain },
  82: { condition: "Violent Rain Showers", icon: CloudRain },
  85: { condition: "Slight Snow Showers", icon: Snowflake },
  86: { condition: "Heavy Snow Showers", icon: Snowflake },
  95: { condition: "Thunderstorm", icon: CloudLightning },
  96: { condition: "Thunderstorm with Slight Hail", icon: CloudLightning },
  99: { condition: "Thunderstorm with Heavy Hail", icon: CloudLightning },
};

function getWeatherForCode(code: number): { condition: string; icon: typeof Sun } {
  return WMO_CODES[code] || { condition: "Unknown", icon: Sun };
}

export function DestinationModal({ destination, isSaved, onToggleSave, onClose }: DestinationModalProps) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [algeriaBorder, setAlgeriaBorder] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'tiled' | 'minimal' | 'dark'>('minimal');
  const [cinematicMode, setCinematicMode] = useState(false);
  const mapPitch = cinematicMode ? 50 : 0;
  const mapBearing = cinematicMode ? -25 : 0;
  const mapStyleUrl = mapStyle === 'dark' ? OSM_DARK_RASTER_STYLE : mapStyle === 'minimal' ? MINIMAL_STYLE : OSM_RASTER_STYLE;
  const mapRef = useRef<MapRef | null>(null);

  const [nearbyWilayas, setNearbyWilayas] = useState<{ current: string; nearby: { region: string; distance_km: number }[] } | null>(null);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const [availableTrips, setAvailableTrips] = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  const coords = useMemo(() => {
    return parseDestinationCoordinates(destination);
  }, [destination]);

  useEffect(() => {
    let cancelled = false;
    const fetchWilayas = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      setNearbyLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/destinations/${destination.id}/nearby-wilayas?maxRadius=500`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setNearbyWilayas(data);
        }
      } catch {} finally {
        if (!cancelled) setNearbyLoading(false);
      }
    };
    fetchWilayas();
    return () => { cancelled = true; };
  }, [destination.id]);

  useEffect(() => {
    const controller = new AbortController();
    const BORDER_URLS = [
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries/DZA.geojson",
      "https://raw.githubusercontent.com/nicbarker/country-geojson/master/countries/DZA.geojson",
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
    ];

    const extractAlgeriaFeature = (world: any): any | null => {
      const features = world?.features;
      if (!Array.isArray(features)) return null;
      const algeriaFeature = features.find((feature: any) => {
        const props = feature?.properties || {};
        const name = String(props.name || props.ADMIN || props.NAME_EN || "").toLowerCase();
        const iso3 = String(props.ISO_A3 || props.iso_a3 || "").toUpperCase();
        return name === "algeria" || iso3 === "DZA";
      });
      return algeriaFeature || null;
    };

    const fetchAlgeriaBorder = async () => {
      for (const url of BORDER_URLS) {
        if (controller.signal.aborted) return;
        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) continue;
          const raw = (await response.json()) as any;
          const feature = raw?.type === "FeatureCollection" ? extractAlgeriaFeature(raw) : raw;
          if (!feature?.geometry) continue;
          setAlgeriaBorder({ type: "FeatureCollection", features: [feature] });
          return;
        } catch {
          // try next source
        }
      }
    };

    void fetchAlgeriaBorder();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchTrips = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
      setTripsLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/destinations/${destination.id}/trips`,
          { headers },
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setAvailableTrips(Array.isArray(data) ? data : []);
        }
      } catch {} finally {
        if (!cancelled) setTripsLoading(false);
      }
    };
    fetchTrips();
    return () => { cancelled = true; };
  }, [destination.id]);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;
    setWeatherLoading(true);

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const current = data.current;
        if (!current) {
          setWeatherLoading(false);
          return;
        }
        const info = getWeatherForCode(current.weather_code);
        setWeather({
          temperature: Math.round(current.temperature_2m),
          condition: info.condition,
          precipitation: current.precipitation ?? 0,
          windSpeed: Math.round(current.wind_speed_10m),
          icon: info.icon,
        });
        setWeatherLoading(false);
      })
      .catch((err) => {
        if (!cancelled) setWeatherLoading(false);
        console.error("Weather fetch failed:", err);
      });

    return () => { cancelled = true; };
  }, [coords]);

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
            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="size-4 fill-[#ff5900] text-[#ff5900]" />
                  <span className="font-bold text-[#0d2805]">{destination.rating}</span>
                </div>
                <p className="text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  {destination.reviews} Reviews
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Route className="size-4 text-[#00b70d]" />
                  <span className="font-bold text-[#0d2805]">{destination.tripsAvailable}</span>
                </div>
                <p className="text-xs font-semibold text-[#6a7282] uppercase tracking-wider">
                  Avail. Trips
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
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
                  {weatherLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="size-6 text-[#6a7282] animate-spin" />
                      <span className="text-sm text-[#6a7282]">Loading weather...</span>
                    </div>
                  ) : weather ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <weather.icon className="size-8 text-[#ff5900]" />
                        <div>
                          <p className="font-bold text-2xl text-[#0d2805]">{weather.temperature}°C</p>
                          <p className="text-xs text-[#6a7282]">{weather.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <CloudRain className="size-4 text-[#6a7282]" />
                          <span className="text-[#6a7282]">{weather.precipitation} mm</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="size-4 text-[#6a7282]" />
                          <span className="text-[#6a7282]">{weather.windSpeed} km/h</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sun className="size-8 text-[#6a7282]" />
                      <span className="text-sm text-[#6a7282]">Weather unavailable</span>
                    </div>
                  )}
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

            {/* Nearby Wilayas */}
            <div>
              <h3 className="font-bold text-[#0d2805] text-xl mb-4">
                Nearby Wilayas
              </h3>
              {nearbyLoading ? (
                <div className="flex items-center gap-2 text-sm text-[#6a7282]">
                  <Loader2 className="size-4 animate-spin" />
                  Loading...
                </div>
              ) : nearbyWilayas ? (
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#ff5900]/10 border border-[#ff5900]/30 rounded-full px-5 py-3 shadow-sm flex items-center gap-2">
                    <MapPin className="size-4 text-[#ff5900]" />
                    <span className="font-bold text-[#ff5900]">{nearbyWilayas.current}</span>
                  </div>
                  {nearbyWilayas.nearby.map((w) => (
                    <div
                      key={w.region}
                      className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-full px-5 py-3 shadow-sm flex items-center gap-2"
                    >
                      <Navigation className="size-4 text-[#00b70d]" />
                      <span className="font-bold text-[#0d2805]">{w.region}</span>
                      <div className="size-1.5 rounded-full bg-[#00b70d]" />
                      <span className="font-black text-[#00b70d]">{w.distance_km} km</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Curated Services */}
            <div>
              <h3 className="font-bold text-[#0d2805] text-xl mb-4">
                Curated Services
              </h3>
              <div className="space-y-3">
                <ServiceItem icon={Tent} title="Desert Camps" />
                <ServiceItem icon={UtensilsCrossed} title="Traditional Food" />
                <ServiceItem icon={MapIcon} title="Tuareg Guides" />
              </div>
            </div>

            {/* Available Trips */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-bold text-[#0d2805] text-xl">
                  Available Trips
                </h3>
                {availableTrips.length > 0 && (
                  <span className="px-2.5 py-0.5 bg-[#00b70d]/10 border border-[#00b70d]/20 text-[#00b70d] rounded-full text-xs font-bold">
                    {availableTrips.length}
                  </span>
                )}
              </div>
              {tripsLoading ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-shrink-0 w-64 bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-2xl p-4 animate-pulse">
                      <div className="flex gap-3">
                        <div className="size-12 rounded-lg bg-[#d6d0c4] flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#d6d0c4] rounded w-3/4" />
                          <div className="h-3 bg-[#d6d0c4] rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : availableTrips.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2 destination-modal-scrollbar">
                  {availableTrips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => {
                        navigate(`/trips/${trip.id}`);
                        onClose();
                      }}
                      className="flex-shrink-0 w-64 bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-2xl p-4 text-left hover:border-[#00b70d] transition-colors group"
                    >
                      <div className="flex gap-3 mb-3">
                        <div className="size-12 rounded-lg overflow-hidden bg-[#d6d0c4] flex-shrink-0">
                          {trip.images && trip.images.length > 0 ? (
                            <img
                              src={trip.images[0]}
                              alt={trip.title}
                              className="size-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center">
                              <Route className="size-5 text-[#6a7282]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#0d2805] truncate">
                            {trip.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="size-3 text-[#6a7282]" />
                            <span className="text-xs text-[#6a7282]">
                              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {trip.difficulty && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                              {trip.difficulty.charAt(0).toUpperCase() + trip.difficulty.slice(1)}
                            </span>
                          )}
                          <span className="text-xs font-bold text-[#00b70d]">
                            {trip.price != null && trip.price > 0 ? `DZD ${trip.price}` : 'FREE'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#6a7282]">
                          <Users className="size-3" />
                          <span>{trip.current_participants ?? 0}/{trip.max_participants ?? '?'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-2xl p-6 text-center">
                  <Route className="size-8 text-[#6a7282] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#6a7282]">
                    No trips available for this destination yet
                  </p>
                  <p className="text-xs text-[#6a7282] mt-1">
                    Be the first to create one!
                  </p>
                </div>
              )}
            </div>

            {/* Map Section */}
            {coords && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-6 h-0.5 bg-[#00b70d]" />
                  <h3 className="text-xs font-bold text-[#0d2805] tracking-widest uppercase">Location</h3>
                </div>
                <div className="border border-[#d6d0c4] rounded-xl overflow-hidden">
                  <div className="border-b border-[#d6d0c4] px-3 py-2 flex flex-wrap items-center gap-2 bg-[#ffffe8]">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => setCinematicMode(!cinematicMode)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          cinematicMode
                            ? "bg-[#0a84ff] text-white"
                            : "bg-[#d6d0c4] text-[#6a7282] hover:bg-[#c4bea9]"
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
                              ? "bg-[#f5f5f0] text-[#333333] hover:bg-[#e8e8e0]"
                              : "bg-[#d6d0c4] text-[#6a7282] hover:bg-[#c4bea9]"
                        }`}
                      >
                        {mapStyle === 'tiled' ? "Tiled" : mapStyle === 'minimal' ? "Minimal" : "Dark"} Mode
                      </button>
                      <button
                        type="button"
                        onClick={handleAdjustView}
                        className="px-3 py-1.5 text-xs font-medium rounded bg-[#d6d0c4] text-[#6a7282] hover:bg-[#c4bea9] transition-all duration-150 cursor-pointer hover:shadow-sm active:scale-95"
                      >
                        Adjust
                      </button>
                    </div>
                  </div>
                  <div className="relative min-h-[250px]">
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
                      style={{ width: "100%", height: "250px" }}
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
                        className="size-9 rounded-lg bg-white/95 border border-[#d6d0c4] shadow-sm hover:bg-white transition-colors flex items-center justify-center"
                        aria-label="Zoom in"
                      >
                        <Plus className="size-4 text-[#0d2805]" />
                      </button>
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        className="size-9 rounded-lg bg-white/95 border border-[#d6d0c4] shadow-sm hover:bg-white transition-colors flex items-center justify-center"
                        aria-label="Zoom out"
                      >
                        <Minus className="size-4 text-[#0d2805]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {/* Row 1: Join Trip (full width) */}
              <button 
                onClick={() => {
                  navigate(`/trips?destination=${encodeURIComponent(destination.name)}`);
                  onClose();
                }}
                className="w-full px-6 py-4 bg-[#00b70d] hover:bg-[#00b70d]-hover text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 sm:col-span-2"
              >
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
              <button 
                onClick={() => {
                  navigate("/browse");
                  onClose();
                }}
                className="w-full px-6 py-4 bg-white border-2 border-[#d6d0c4] hover:border-[#00b70d] text-[#0d2805] rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="size-5" />
                Community
              </button>
              
              {/* Row 3: Nearby Destinations / Stats & Details */}
              <button 
                onClick={() => {
                  navigate("/browse");
                  onClose();
                }}
                className="w-full px-6 py-4 bg-white border-2 border-[#d6d0c4] hover:border-[#00b70d] text-[#0d2805] rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MapIcon className="size-5" />
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



