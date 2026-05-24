import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, Source, type MapLayerMouseEvent, type MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import {
  Plus,
  Minus,
  X,
  Calendar,
  ChevronDown,
  Pencil,
  Check,
  MapPinned,
  AlertCircle,
  Search,
} from "lucide-react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { CalendarPicker } from "@/components/CreateTrip/CalendarPicker";
import { ReorderableMeetingList, type SchedulePoint } from "@/components/CreateTrip/ReorderableMeetingList";
import type { Destination, MeetingLocation, TripData, SelectedService } from "@/imports/types";

import "maplibre-gl/dist/maplibre-gl.css";

interface Step3MapLibreAltProps {
  tripData: TripData;
  selectedDestinations: Destination[];
  orderedPointIds: string[];
  onOrderedPointIdsChange: (ids: string[]) => void;
  onAddMeetingLocationEntry: (entry: MeetingLocation) => boolean;
  onRemoveMeetingLocation: (index: number) => void;
  onReorderMeetingLocations: (reorderedLocations: MeetingLocation[]) => void;
  newItinerarySummary: string;
  onItinerarySummaryChange: (val: string) => void;
  newItineraryDetails: string;
  onItineraryDetailsChange: (val: string) => void;
  onAddItinerary: () => void;
  onRemoveItinerary: (index: number) => void;
  onUpdateItinerary: (index: number, newSummary: string, newDetails: string) => void;
  expandedItinerary: Set<number>;
  onToggleItineraryExpanded: (index: number) => void;
  onDateSelect: (date: string, isStart: boolean) => void;
  duration: { days: number; nights: number } | null;
  maxMeetingPoints: number;
  selectedServices: SelectedService[];
}

interface SearchResult {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LineFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties: Record<string, never>;
}

interface LineFeatureCollection {
  type: "FeatureCollection";
  features: LineFeature[];
}

interface RouteSegment {
  feature: LineFeature;
  color: string;
}

interface ReverseGeocodeResult extends Partial<MeetingLocation> {
  countryCode?: string;
}

const ALGERIA_CENTER = { lat: 28.0339, lng: 1.6596 };
const ALGERIA_BOUNDS: [[number, number], [number, number]] = [
  [-10.0, 16.0],
  [13.5, 37.5],
];
const MIN_ALGERIA_ZOOM = 0.8;
const ZOOM_IN_STEP = 0.2;
const ZOOM_OUT_STEP = 1.5;
const WALK_CONNECTOR_THRESHOLD_METERS = 45;
const EMPTY_LINE_COLLECTION: LineFeatureCollection = {
  type: "FeatureCollection",
  features: [],
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
  layers: [
    {
      id: "minimal-raster",
      type: "raster",
      source: "minimal",
      paint: {
        "raster-opacity": 0.96,
      },
    },
  ],
};

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadius = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function Step3ScheduleMapLibreAlt({
  tripData,
  selectedDestinations,
  orderedPointIds,
  onOrderedPointIdsChange,
  onAddMeetingLocationEntry,
  onRemoveMeetingLocation,
  onReorderMeetingLocations,
  newItinerarySummary,
  onItinerarySummaryChange,
  newItineraryDetails,
  onItineraryDetailsChange,
  onAddItinerary,
  onRemoveItinerary,
  onUpdateItinerary,
  expandedItinerary,
  onToggleItineraryExpanded,
  onDateSelect,
  duration,
  maxMeetingPoints,
  selectedServices,
}: Step3MapLibreAltProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSummary, setEditSummary] = useState("");
  const [editDetails, setEditDetails] = useState("");

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapSelectionError, setMapSelectionError] = useState<string | null>(null);
  const [candidateTime, setCandidateTime] = useState("");
  const [candidatePoint, setCandidatePoint] = useState<MeetingLocation | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const [routedLine, setRoutedLine] = useState<LineFeature | null>(null);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [isFirstMeetingPointMissing, setIsFirstMeetingPointMissing] = useState(false);
  const [footConnectors, setFootConnectors] = useState<LineFeatureCollection>(EMPTY_LINE_COLLECTION);
  const [showReturnRoute, setShowReturnRoute] = useState(false);
  const [returnRouteLine, setReturnRouteLine] = useState<LineFeature | null>(null);
  const [algeriaBorder, setAlgeriaBorder] = useState<any>(null);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [mapStyle, setMapStyle] = useState<'tiled' | 'minimal' | 'dark'>('minimal');
  const [isStopPickerOpen, setIsStopPickerOpen] = useState(false);

  const mapRef = useRef<MapRef | null>(null);

  const destinationPoints = useMemo<SchedulePoint[]>(
    () => {
      const filtered = selectedDestinations
        .filter((dest) => Number.isFinite(dest.lat) && Number.isFinite(dest.lng))
        .map((dest) => ({
          location: dest.name,
          time: "",
          lat: dest.lat,
          lng: dest.lng,
          address: dest.region,
          placeId: `destination:${dest.id}`,
          pointType: "destination" as const,
          stableId: `destination:${dest.id}`,
        }));
      
      console.log("🗺️ Destination coordinates from DB:", filtered.map(d => ({
        name: d.location,
        lat: d.lat,
        lng: d.lng,
        region: d.address
      })));
      
      return filtered;
    },
    [selectedDestinations]
  );

  const servicePoints = useMemo<SchedulePoint[]>(
    () =>
      selectedServices
        .filter((s) => s.location?.lat && s.location?.lng)
        .map((service) => ({
          location: service.name,
          time: "",
          lat: service.location!.lat,
          lng: service.location!.lng,
          address: service.address || "",
          pointType: "service" as const,
          stableId: `service:${service.id}`,
        })),
    [selectedServices]
  );

  const getMeetingStableId = (point: MeetingLocation) =>
    `meeting:${point.placeId || `${point.location}-${point.time}-${point.lat ?? "na"}-${point.lng ?? "na"}`}`;

  const buildReorderedMeetings = (first: MeetingLocation, rest: MeetingLocation[]) => {
    const byId = new globalThis.Map<string, MeetingLocation>();
    [first, ...rest].forEach((item) => {
      const key = getMeetingStableId(item);
      if (!byId.has(key)) {
        byId.set(key, item);
      }
    });
    return Array.from(byId.values());
  };

  const meetingPoints = useMemo<SchedulePoint[]>(
    () =>
      tripData.meetingLocations.map((point) => ({
        ...point,
        pointType: "meeting" as const,
        stableId: getMeetingStableId(point),
      })),
    [tripData.meetingLocations]
  );

  const allPoints = useMemo(() => [...meetingPoints, ...destinationPoints, ...servicePoints], [meetingPoints, destinationPoints, servicePoints]);

  useEffect(() => {
    const allIds = allPoints.map((point) => point.stableId);
    const idSet = new Set(allIds);
    const kept = orderedPointIds.filter((id) => idSet.has(id));
    const added = allIds.filter((id) => !kept.includes(id));
    let next = [...kept, ...added];

    if (
      next.length !== orderedPointIds.length ||
      next.some((id, index) => id !== orderedPointIds[index])
    ) {
      onOrderedPointIdsChange(next);
    }
  }, [allPoints, meetingPoints, onOrderedPointIdsChange, orderedPointIds]);

  const orderedPoints = useMemo(() => {
    const pointById = new globalThis.Map(allPoints.map((point) => [point.stableId, point]));
    const points = orderedPointIds
      .map((id) => pointById.get(id))
      .filter((point): point is SchedulePoint => Boolean(point));

    return points;
  }, [allPoints, orderedPointIds]);

  const applyStopToItinerary = (point: SchedulePoint) => {
    const primary = String(point.location || "").trim();
    const secondary = String(point.address || "").trim();
    const fullText = secondary ? `${primary}, ${secondary}` : primary;
    const parts = fullText
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      return;
    }

    onItinerarySummaryChange(parts[0]);
    onItineraryDetailsChange(parts.slice(1).join(", "));
    setIsStopPickerOpen(false);
  };

  const selectedWithCoordinates = useMemo(
    () =>
      orderedPoints.filter(
        (point) => typeof point.lng === "number" && typeof point.lat === "number"
      ),
    [orderedPoints]
  );
  const isFirstMeetingSlotMissing = isFirstMeetingPointMissing || (meetingPoints.length === 0 && destinationPoints.length > 0);

  const directRouteGeoJson = useMemo<LineFeature>(
    () => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: selectedWithCoordinates.map((point) => [point.lng as number, point.lat as number]),
      },
      properties: {},
    }),
    [selectedWithCoordinates]
  );

  const routeGeoJson = routedLine || directRouteGeoJson;
  const hasFootConnectors = footConnectors.features.length > 0;
  
  const mapStyleUrl = mapStyle === 'dark' ? OSM_DARK_RASTER_STYLE : mapStyle === 'minimal' ? MINIMAL_STYLE : OSM_RASTER_STYLE;
  
  const mapPitch = cinematicMode ? 50 : 0;
  const mapBearing = cinematicMode ? -25 : 0;
  
  const greenShades = mapStyle === 'dark'
    ? ["#00ff66", "#00d84f", "#00b33f"]
    : ["#00b70d", "#16a34a", "#15803d"];
  const blueShades = mapStyle === 'dark'
    ? ["#66ccff", "#38bdf8", "#0ea5e9"]
    : ["#0a84ff", "#2563eb", "#1d4ed8"];
  const fallbackRouteColor =
    selectedWithCoordinates.length >= 2 &&
    (selectedWithCoordinates[0]?.pointType === "destination" ||
      selectedWithCoordinates[1]?.pointType === "destination")
      ? "#ff5900"
      : greenShades[0];

  const getRouteSegmentColor = (segmentIndex: number) => {
    const shadeIndex = Math.floor(segmentIndex / 2) % greenShades.length;
    return segmentIndex % 2 === 0 ? greenShades[shadeIndex] : blueShades[shadeIndex];
  };
  const connectorColor = mapStyle === "dark" ? "#ffffff" : "#111111";
  const meetingMarkerColor = mapStyle === "dark" ? "#00ff00" : "#00b70d";
  const destinationMarkerColor = "#ff5900";
  const candidateMarkerColor = "#0a84ff";

  useEffect(() => {
    const controller = new AbortController();
    const BORDER_URLS = [
      // Individual country files (~2 MB) — tried first
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries/DZA.geojson",
      "https://raw.githubusercontent.com/nicbarker/country-geojson/master/countries/DZA.geojson",
      // Fallback: whole-world file (~200 MB) — last resort
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
          if (!response.ok) {
            console.warn(`[border] ${url} returned ${response.status}, trying next...`);
            continue;
          }

          const raw = (await response.json()) as any;

          // Individual country files return the feature directly;
          // the world file returns a FeatureCollection.
          const feature = raw?.type === "FeatureCollection"
            ? extractAlgeriaFeature(raw)
            : raw;

          if (!feature?.geometry) {
            console.warn(`[border] No Algeria geometry found in ${url}, trying next...`);
            continue;
          }

          setAlgeriaBorder({
            type: "FeatureCollection",
            features: [feature],
          });
          return; // success
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          console.warn(`[border] Failed to fetch ${url}:`, err);
        }
      }
      console.warn("[border] All GeoJSON sources failed, Algerian border unavailable.");
    };

    void fetchAlgeriaBorder();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRoute = async () => {
      if (selectedWithCoordinates.length < 2) {
        setRoutedLine(null);
        setRouteSegments([]);
        setFootConnectors(EMPTY_LINE_COLLECTION);
        setRoutingError(null);
        setRoutingLoading(false);
        return;
      }

      setRoutingLoading(true);
      setRoutingError(null);

      try {
        const coordinates = selectedWithCoordinates
          .map((point) => `${point.lng},${point.lat}`)
          .join(";");

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Routing service unavailable");
        }

        const result = await response.json();
        const coordinatesResult = result?.routes?.[0]?.geometry?.coordinates;

        if (!Array.isArray(coordinatesResult) || coordinatesResult.length < 2) {
          throw new Error("No route available for these points");
        }

        const waypoints = Array.isArray(result?.waypoints) ? result.waypoints : [];
        const legs = Array.isArray(result?.routes?.[0]?.legs) ? result.routes[0].legs : [];

        // Build one segment per leg (pt1->pt2, pt2->pt3, ...) from step geometries.
        const segments: RouteSegment[] = [];
        legs.forEach((leg: any, legIndex: number) => {
          const steps = Array.isArray(leg?.steps) ? leg.steps : [];
          const legCoords: number[][] = [];

          steps.forEach((step: any, stepIndex: number) => {
            const geometry = step?.geometry;
            let stepCoords: number[][] = [];

            if (geometry?.type === "LineString" && Array.isArray(geometry.coordinates)) {
              stepCoords = geometry.coordinates as number[][];
            } else if (Array.isArray(geometry)) {
              stepCoords = geometry as number[][];
            }

            if (stepCoords.length === 0) return;

            // Avoid duplicate join point between consecutive steps.
            if (stepIndex > 0 && legCoords.length > 0) {
              legCoords.push(...stepCoords.slice(1));
            } else {
              legCoords.push(...stepCoords);
            }
          });

          if (legCoords.length >= 2) {
            const startPoint = selectedWithCoordinates[legIndex];
            const endPoint = selectedWithCoordinates[legIndex + 1];
            const isBothDestinations =
              startPoint?.pointType === "destination" && endPoint?.pointType === "destination";

            segments.push({
              feature: {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: legCoords,
                },
                properties: {},
              },
              color: isBothDestinations ? "#ff5900" : getRouteSegmentColor(legIndex),
            });
          }
        });
        setRouteSegments(segments);
        const connectorFeatures: LineFeature[] = [];

        selectedWithCoordinates.forEach((point, index) => {
          const snapped = waypoints[index]?.location;
          if (!Array.isArray(snapped) || snapped.length < 2) return;

          const snappedLng = Number(snapped[0]);
          const snappedLat = Number(snapped[1]);
          const pointLng = point.lng as number;
          const pointLat = point.lat as number;

          if (!Number.isFinite(snappedLng) || !Number.isFinite(snappedLat)) return;

          const gapMeters = getDistanceMeters(pointLat, pointLng, snappedLat, snappedLng);
          if (gapMeters <= WALK_CONNECTOR_THRESHOLD_METERS) return;

          connectorFeatures.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [snappedLng, snappedLat],
                [pointLng, pointLat],
              ],
            },
            properties: {},
          });
        });

        setRoutedLine({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordinatesResult,
          },
          properties: {},
        });
        setFootConnectors({
          type: "FeatureCollection",
          features: connectorFeatures,
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setRoutedLine(null);
        setRouteSegments([]);
        setFootConnectors(EMPTY_LINE_COLLECTION);
        setRoutingError("Road route unavailable right now. Showing direct connection.");
      } finally {
        setRoutingLoading(false);
      }
    };

    void fetchRoute();

    return () => {
      controller.abort();
    };
  }, [selectedWithCoordinates]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchReturnRoute = async () => {
      if (!showReturnRoute || selectedWithCoordinates.length < 2) {
        setReturnRouteLine(null);
        return;
      }

      try {
        const lastPoint = selectedWithCoordinates[selectedWithCoordinates.length - 1];
        const firstPoint = selectedWithCoordinates[0];
        const coordinates = `${lastPoint.lng},${lastPoint.lat};${firstPoint.lng},${firstPoint.lat}`;

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Return route unavailable");
        }

        const result = await response.json();
        const coordinatesResult = result?.routes?.[0]?.geometry?.coordinates;

        if (!Array.isArray(coordinatesResult) || coordinatesResult.length < 2) {
          throw new Error("No return route available");
        }

        setReturnRouteLine({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordinatesResult,
          },
          properties: {},
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setReturnRouteLine(null);
      }
    };

    void fetchReturnRoute();

    return () => {
      controller.abort();
    };
  }, [showReturnRoute, selectedWithCoordinates]);

  const reverseGeocode = async (lat: number, lng: number): Promise<ReverseGeocodeResult> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en&addressdetails=1&namedetails=1&zoom=18`
      );
      if (!response.ok) {
        return {};
      }

      const result = await response.json();
      const displayName = typeof result.display_name === "string" ? result.display_name : "";
      const firstDisplaySegment = displayName.split(",")[0]?.trim();
      const namedetails = result.namedetails || {};
      const address = result.address || {};
      const primaryName =
        result.name ||
        namedetails["name:en"] ||
        namedetails.name ||
        address.attraction ||
        address.tourism ||
        address.amenity ||
        address.building ||
        address.neighbourhood ||
        address.suburb ||
        address.road ||
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        address.state ||
        firstDisplaySegment ||
        result.name ||
        `Pinned Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

      return {
        location: primaryName,
        address: result.display_name || primaryName,
        placeId: result.place_id ? String(result.place_id) : undefined,
        countryCode: result.address?.country_code,
      };
    } catch {
      return {};
    }
  };

  const updateCandidatePoint = async (lat: number, lng: number, placeName?: string, placeId?: string) => {
    setMapSelectionError(null);
    const resolved = await reverseGeocode(lat, lng);
    const fallbackLabel = placeName || `Pinned Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

    setCandidatePoint({
      location: placeName || resolved.location || fallbackLabel,
      time: "",
      lat,
      lng,
      address: resolved.address || fallbackLabel,
      placeId: placeId || resolved.placeId,
    });
  };

  const handleMapClick = async (event: MapLayerMouseEvent) => {
    const lng = Number(event.lngLat.lng.toFixed(6));
    const lat = Number(event.lngLat.lat.toFixed(6));
    await updateCandidatePoint(lat, lng);
  };

  const runSearch = async () => {
    const query = searchInput.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setMapSelectionError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          query
        )}&countrycodes=dz&addressdetails=1&limit=8&accept-language=en`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results = await response.json();
      const normalized: SearchResult[] = (results || []).map((item: any) => ({
        placeId: String(item.place_id),
        name: item.name || item.display_name,
        address: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
      }));

      setSearchResults(normalized);
      if (normalized.length === 0) {
        setMapSelectionError("No places found in Algeria for that search.");
      }
    } catch {
      setMapSelectionError("Search is unavailable right now. Try again.");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = async (result: SearchResult) => {
    await updateCandidatePoint(result.lat, result.lng, result.name, result.placeId);
    setSearchResults([]);

    if (mapRef.current) {
      mapRef.current.flyTo({ center: [result.lng, result.lat], zoom: 10 });
    }
  };

  const handleAddCandidateToTrip = async (): Promise<boolean> => {
    if (!candidatePoint) {
      setMapSelectionError("Select a point on the map or from search first.");
      return false;
    }

    // Time is required whenever the first meeting slot is being filled
    if ((tripData.meetingLocations.length === 0 || isFirstMeetingPointMissing) && !candidateTime.trim()) {
      setMapSelectionError("Set the meeting time for the first meeting point.");
      return false;
    }

    // For non-first points, time is optional - no validation needed

    if (typeof candidatePoint.lat !== "number" || typeof candidatePoint.lng !== "number") {
      setMapSelectionError("Invalid point. Please pick another location.");
      return false;
    }

    const resolved = await reverseGeocode(candidatePoint.lat, candidatePoint.lng);
    const normalizedCountryCode = resolved.countryCode?.toLowerCase();
    if (normalizedCountryCode !== "dz") {
      setMapSelectionError("Only locations inside Algeria can be added. Please choose a point inside Algeria.");
      return false;
    }

    const hasResolvedName =
      typeof resolved.location === "string" &&
      !resolved.location.startsWith("Pinned Point (") &&
      resolved.location.trim().length > 0;

    const entryForAdd = {
      ...candidatePoint,
      location: hasResolvedName ? (resolved.location as string) : candidatePoint.location,
      address: resolved.address || candidatePoint.address,
      placeId: resolved.placeId || candidatePoint.placeId,
      time: candidateTime.trim(),
    };

    const added = onAddMeetingLocationEntry(entryForAdd);

    if (!added) return false;

    const shouldInsertAsFirst = isFirstMeetingPointMissing || tripData.meetingLocations.length === 0;

    if (shouldInsertAsFirst) {
      const reordered = buildReorderedMeetings(entryForAdd, tripData.meetingLocations);
      onReorderMeetingLocations(reordered);

      const newFirstId = getMeetingStableId(entryForAdd);
      const reorderedIds = [newFirstId, ...orderedPointIds.filter((id) => id !== newFirstId)];
      onOrderedPointIdsChange(reorderedIds);
      setIsFirstMeetingPointMissing(false);
    }

    setCandidatePoint(null);
    setCandidateTime("");
    setSearchInput("");
    setSearchResults([]);
    setMapSelectionError(null);
    return true;
  };

  const handleFocusPoint = (point: SchedulePoint) => {
    if (!mapRef.current || typeof point.lat !== "number" || typeof point.lng !== "number") return;
    mapRef.current.flyTo({ center: [point.lng, point.lat], zoom: 10 });
  };

  const handleReorderPoints = (reorderedPoints: SchedulePoint[]) => {
    const normalized = [...reorderedPoints];
    onOrderedPointIdsChange(normalized.map((point) => point.stableId));
    const reorderedMeetings = normalized
      .filter((point) => point.pointType === "meeting")
      .map((point) => ({
        location: point.location,
        time: point.time,
        lat: point.lat,
        lng: point.lng,
        address: point.address,
        placeId: point.placeId,
      }));
    onReorderMeetingLocations(reorderedMeetings);
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

  const handleRemoveMeetingLocation = (_index: number, point: SchedulePoint) => {
    if (point.pointType !== "meeting") return;

    const meetingIndex = meetingPoints.findIndex((meeting) => meeting.stableId === point.stableId);
    if (meetingIndex === -1) return;

    if (meetingIndex === 0 && tripData.meetingLocations.length > 1) {
      setIsFirstMeetingPointMissing(true);
    }

    onRemoveMeetingLocation(meetingIndex);
  };

  const handleRestoreFirstMeetingPoint = async () => {
    if (!candidatePoint) {
      setMapSelectionError("Select a point on the map or from search first.");
      return;
    }

    if (!candidateTime.trim()) {
      setMapSelectionError("Set the meeting time for the first meeting point.");
      return;
    }

    const added = await handleAddCandidateToTrip();
    if (!added) return;
    setIsFirstMeetingPointMissing(false);
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Schedule"
        description="Plan route order with stops and selected destinations in Algeria"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarPicker
            startDate={tripData.startDate}
            endDate={tripData.endDate}
            onDateSelect={onDateSelect}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-2 rounded-full bg-[#00b70d]" />
              <span className="text-xs font-semibold text-text-[#ff5900] uppercase">Check-in Date</span>
            </div>
            <p className="font-bold text-lg text-text-[#00b70d]">
              {tripData.startDate
                ? new Date(tripData.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Not set"}
            </p>
          </div>

          {duration && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full bg-[#ff5900]" />
                <span className="text-xs font-semibold text-text-[#ff5900] uppercase">Duration</span>
              </div>
              <p className="font-bold text-lg text-text-[#00b70d]">
                {duration.days} Days, {duration.nights} Nights
              </p>
            </div>
          )}

          {tripData.startDate && tripData.endDate && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-text-[#ff5900]" />
                <span className="text-xs font-semibold text-text-[#ff5900] uppercase">Dates</span>
              </div>
              <p className="text-sm text-text-[#00b70d]">
                {new Date(tripData.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(tripData.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className="block font-semibold text-text-[#00b70d]">
            Meeting Locations <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setIsMapOpen(true);
              setMapSelectionError(null);
            }}
            className="px-4 py-2 bg-[#ff5900] text-white rounded-lg font-medium hover:bg-[#e14f00] transition-colors inline-flex items-center gap-2"
          >
            <MapPinned className="size-4" />
            Select Points on Map
          </button>
        </div>

        <p className="text-xs text-[#6a7282] mb-3">
          Max {maxMeetingPoints - 1} additional stops plus the first stop.
        </p>

        {(orderedPoints.length > 0 || isFirstMeetingSlotMissing) && (
          <div>
            <h3 className="text-sm font-semibold text-[#0d2805] mb-2">Selected Route Points</h3>
            <ReorderableMeetingList
              meetingLocations={orderedPoints}
              onReorder={handleReorderPoints}
              onRemove={handleRemoveMeetingLocation}
              showRestoreButton={isFirstMeetingSlotMissing}
              lockFirstItem={!isFirstMeetingSlotMissing}
              candidatePoint={candidatePoint}
              onRestoreFirstPoint={() => {
                setIsMapOpen(true);
                void handleRestoreFirstMeetingPoint();
              }}
            />
          </div>
        )}
      </div>

      {isMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center m-0 p-0">
          <div className="bg-white w-full max-w-6xl h-[100vh] lg:h-[95vh] rounded-none lg:rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-[#0d2805]">Stop Picker (Algeria Only)</h3>
                <p className="text-sm text-[#6a7282]">Search and click to select multiple stops.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="p-2 hover:bg-[#f3f4f6] rounded-lg"
              >
                <X className="size-5 text-[#6a7282]" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-73px)] lg:h-[calc(95vh-73px)] min-w-0">
              <div className="lg:col-span-2 p-4 border-r border-[#e2e8f0] flex flex-col gap-3 min-h-0 min-w-0 overflow-hidden">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="size-4 text-[#6a7282] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void runSearch();
                        }
                      }}
                      placeholder="Search places in Algeria"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void runSearch()}
                    className="px-3 py-2.5 bg-[#00b70d] text-white rounded-lg hover:bg-[#00950b]"
                    disabled={searching}
                  >
                    {searching ? "..." : "Find"}
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="max-h-36 overflow-auto border border-[#e2e8f0] rounded-lg">
                    {searchResults.map((result) => (
                      <button
                        key={result.placeId}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-[#f8f8f4] border-b border-[#f1f5f9] last:border-b-0"
                        onClick={() => void handleSelectSearchResult(result)}
                      >
                        <p className="text-sm font-medium text-[#0d2805]">{result.name}</p>
                        <p className="text-xs text-[#6a7282]">{result.address}</p>
                      </button>
                    ))}
                  </div>
                )}

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
                      onClick={() => setShowReturnRoute(!showReturnRoute)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-150 cursor-pointer hover:shadow-sm active:scale-95 ${
                        showReturnRoute
                          ? "bg-[#fcd34d] text-[#333333] hover:bg-[#fbbf24]"
                          : "bg-[#e2e8f0] text-[#6a7282] hover:bg-[#d1d5db]"
                      }`}
                    >
                      Return Route
                    </button>
                  </div>
                </div>

                <div className="relative flex-1 rounded-xl border border-[#e2e8f0] overflow-hidden min-h-[240px]">
                  {selectedWithCoordinates.length >= 2 && (
                    <div className="px-3 py-2 text-xs border-b border-[#e2e8f0] bg-[#f8f8f4] text-[#6a7282]">
                      {routingLoading
                        ? "Calculating road route..."
                        : routingError ||
                          (hasFootConnectors
                            ? "Route follows drivable roads. Dashed segments show short on-foot links to exact points."
                            : "Route follows drivable roads between selected points.")}
                    </div>
                  )}
                  <Map
                    ref={mapRef}
                    mapLib={maplibregl}
                    mapStyle={mapStyleUrl}
                    pitch={mapPitch}
                    bearing={mapBearing}
                    initialViewState={{
                      latitude: ALGERIA_CENTER.lat,
                      longitude: ALGERIA_CENTER.lng,
                      zoom: 5,
                    }}
                    minZoom={MIN_ALGERIA_ZOOM}
                    maxBounds={ALGERIA_BOUNDS}
                    onClick={(event) => void handleMapClick(event)}
                    style={{ width: "100%", height: "100%" }}
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

                    {routeSegments.length > 0 ? (
                      routeSegments.map((segment, idx) => (
                        <Source
                          key={`route-segment-${idx}`}
                          id={`route-segment-${idx}`}
                          type="geojson"
                          data={segment.feature}
                        >
                          <Layer
                            id={`route-line-${idx}`}
                            type="line"
                            paint={{
                              "line-color": segment.color,
                              "line-width": 4,
                            }}
                          />
                        </Source>
                      ))
                    ) : routeGeoJson.geometry.coordinates.length >= 2 ? (
                      <Source id="route" type="geojson" data={routeGeoJson}>
                        <Layer
                          id="route-line"
                          type="line"
                          paint={{
                            "line-color": fallbackRouteColor,
                            "line-width": 4,
                          }}
                        />
                      </Source>
                    ) : null}

                    {hasFootConnectors && (
                      <Source id="foot-connectors" type="geojson" data={footConnectors}>
                        <Layer
                          id="foot-connectors-line"
                          type="line"
                          paint={{
                            "line-color": connectorColor,
                            "line-width": 3,
                            "line-dasharray": [2, 2],
                            "line-opacity": 0.95,
                          }}
                        />
                      </Source>
                    )}

                    {showReturnRoute && returnRouteLine && (
                      <Source id="return-route" type="geojson" data={returnRouteLine}>
                        <Layer
                          id="return-route-line"
                          type="line"
                          paint={{
                            "line-color": "#fcd34d",
                            "line-width": 4,
                          }}
                        />
                      </Source>
                    )}

                    {selectedWithCoordinates.map((point, index) => (
                      <Marker
                        key={`selected-${index}`}
                        longitude={point.lng as number}
                        latitude={point.lat as number}
                        anchor="bottom"
                      >
                        {(() => {
                          const markerColor =
                            point.pointType === "destination" ? destinationMarkerColor : meetingMarkerColor;
                          return (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleFocusPoint(point);
                          }}
                          className="cursor-pointer"
                          aria-label={`Focus ${point.location}`}
                        >
                        <svg width="32" height="40" viewBox="0 0 32 40" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                          {/* Pin body */}
                          <path
                            d="M 16 0 C 8 0 2 6 2 14 C 2 24 16 40 16 40 C 16 40 30 24 30 14 C 30 6 24 0 16 0 Z"
                            fill={markerColor}
                            stroke="white"
                            strokeWidth="1.5"
                          />
                          {/* White circle background - offset to bottom */}
                          <circle cx="16" cy="13" r="9" fill="white" />
                          {/* Number text in marker color - centered to circle */}
                          <text
                            x="16"
                            y="13"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            dy="0.35"
                            fontSize="12"
                            fontWeight="bold"
                            fill={markerColor}
                          >
                            {isFirstMeetingSlotMissing ? index + 2 : index + 1}
                          </text>
                        </svg>
                        </button>
                          );
                        })()}
                      </Marker>
                    ))}

                    {candidatePoint &&
                      typeof candidatePoint.lat === "number" &&
                      typeof candidatePoint.lng === "number" && (
                        <Marker longitude={candidatePoint.lng} latitude={candidatePoint.lat} anchor="bottom">
                          <svg width="32" height="40" viewBox="0 0 32 40" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                            {/* Pin body */}
                            <path
                              d="M 16 0 C 8 0 2 6 2 14 C 2 24 16 40 16 40 C 16 40 30 24 30 14 C 30 6 24 0 16 0 Z"
                              fill={candidateMarkerColor}
                              stroke="white"
                              strokeWidth="1.5"
                            />
                            {/* White circle background - offset to bottom */}
                            <circle cx="16" cy="13" r="9" fill="white" />
                            {/* Plus text in marker color - centered to circle */}
                            <text
                              x="16"
                              y="13"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              dy="1.8"
                              fontSize="14"
                              fontWeight="bold"
                              fill={candidateMarkerColor}
                            >
                              +
                            </text>
                          </svg>
                        </Marker>
                      )}
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

              <div className="p-4 space-y-4 overflow-y-auto overflow-x-hidden min-w-0">
                <div className="rounded-lg bg-[#f8f8f4] border border-[#e2e8f0] p-3 space-y-3">
                  <h4 className="font-semibold text-[#0d2805] text-sm">Candidate Point</h4>
                  {candidatePoint ? (
                    <>
                      <div>
                        <p className="text-sm font-medium text-[#0d2805]">{candidatePoint.location}</p>
                        {candidatePoint.address && (
                          <p className="text-xs text-[#6a7282] mt-0.5">{candidatePoint.address}</p>
                        )}
                        {typeof candidatePoint.lat === "number" && typeof candidatePoint.lng === "number" && (
                          <p className="text-xs text-[#6a7282] mt-0.5">
                            {candidatePoint.lat.toFixed(5)}, {candidatePoint.lng.toFixed(5)}
                          </p>
                        )}
                      </div>

                      <input
                        type="time"
                        value={candidateTime}
                        onChange={(e) => setCandidateTime(e.target.value)}
                        placeholder={tripData.meetingLocations.length === 0 ? "Required for first point" : "Optional"}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                      />
                      {tripData.meetingLocations.length > 0 && (
                        <p className="text-xs text-[#6a7282]">Time is optional for additional stops</p>
                      )}

                      {(() => {
                        const isAtLimit = tripData.meetingLocations.length >= maxMeetingPoints;
                        return (
                          <button
                            type="button"
                            disabled={isAtLimit}
                            onClick={() => void handleAddCandidateToTrip()}
                            className="w-full px-3 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00950b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Point To Trip
                          </button>
                        );
                      })()}
                    </>
                  ) : (
                    <p className="text-xs text-[#6a7282]">
                      Select a search result or click on the map to prepare a meeting point.
                    </p>
                  )}

                  {mapSelectionError && (
                    <div className="text-xs text-[#ff5900] flex items-start gap-2">
                      <AlertCircle className="size-4 mt-0.5" />
                      <span>{mapSelectionError}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-[#0d2805] text-sm mb-2">
                    Selected Stops ({meetingPoints.length}/{maxMeetingPoints}) | Destinations {destinationPoints.length} | Services {servicePoints.length}
                  </h4>
                  {orderedPoints.length === 0 && !isFirstMeetingSlotMissing ? (
                    <ReorderableMeetingList
                      meetingLocations={orderedPoints}
                      onReorder={handleReorderPoints}
                      onRemove={handleRemoveMeetingLocation}
                      onItemClick={handleFocusPoint}
                      showRestoreButton={isFirstMeetingSlotMissing}
                      lockFirstItem={!isFirstMeetingSlotMissing}
                      candidatePoint={candidatePoint}
                      onRestoreFirstPoint={() => {
                        setIsMapOpen(true);
                        void handleRestoreFirstMeetingPoint();
                      }}
                    />
                  ) : (
                    <ReorderableMeetingList
                      meetingLocations={orderedPoints}
                      onReorder={handleReorderPoints}
                      onRemove={handleRemoveMeetingLocation}
                      onItemClick={handleFocusPoint}
                      showRestoreButton={isFirstMeetingSlotMissing}
                      lockFirstItem={!isFirstMeetingSlotMissing}
                      candidatePoint={candidatePoint}
                      onRestoreFirstPoint={() => {
                        setIsMapOpen(true);
                        void handleRestoreFirstMeetingPoint();
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">Itinerary (Optional)</label>

        <div className="space-y-3 mb-4">
          {tripData.itinerary.map((item, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="bg-[#f8f8f4] border-2 border-[#00b70d] rounded-xl p-4 space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-[#6a7282] block mb-2">
                      Day {index + 1}: Summary
                    </label>
                    <input
                      type="text"
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#6a7282] block mb-2">Details (Optional)</label>
                    <textarea
                      value={editDetails}
                      onChange={(e) => setEditDetails(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onUpdateItinerary(index, editSummary, editDetails);
                        setEditingIndex(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00b70d]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="size-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="flex-1 px-4 py-2 border-2 border-[#e2e8f0] text-[#6a7282] rounded-lg font-medium hover:bg-[#f8f8f4] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onToggleItineraryExpanded(index)}
                      className="flex items-center gap-2 flex-1 hover:opacity-80 transition-opacity disabled:hover:opacity-100"
                      disabled={!item.details}
                    >
                      <ChevronDown
                        className={`size-5 transition-transform ${
                          expandedItinerary.has(index) ? "rotate-180" : ""
                        } ${!item.details ? "opacity-0" : ""}`}
                      />
                      <span
                        className="text-left text-[#6a7282] flex-1 min-w-0"
                        style={{ wordBreak: "break-word", hyphens: "auto" }}
                      >
                        <span className="font-semibold text-[#00b70d]">Day {index + 1}:</span> {item.summary}
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditSummary(item.summary);
                          setEditDetails(item.details || "");
                        }}
                        className="p-2 text-[#00b70d] hover:bg-[#00b70d]/10 rounded-lg transition-colors"
                      >
                        <Pencil className="size-5" />
                      </button>
                      <button
                        onClick={() => onRemoveItinerary(index)}
                        className="p-2 text-[#ff5900] hover:bg-[#ff5900]/10 rounded-lg transition-colors"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  </div>
                  {expandedItinerary.has(index) && item.details && (
                    <p className="text-sm text-[#6a7282] whitespace-pre-wrap break-words">{item.details}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3 p-4 bg-[#f8f8f4] rounded-xl border-2 border-dashed border-[#d6d0c4]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-sm font-semibold text-[#6a7282]">
                Day {tripData.itinerary.length + 1}: Summary
              </label>
              <button
                type="button"
                onClick={() => setIsStopPickerOpen(true)}
                className="px-2 py-1 text-xs font-semibold rounded-md bg-[#00b70d] text-white hover:bg-[#0a9f12] transition-colors flex items-center gap-1"
              >
                <Plus className="size-3.5" />
                Use Stop
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g., Arrival and orientation"
              value={newItinerarySummary}
              onChange={(e) => onItinerarySummaryChange(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#6a7282] block mb-2">Details (Optional)</label>
            <textarea
              placeholder="Add detailed information about this day..."
              value={newItineraryDetails}
              onChange={(e) => onItineraryDetailsChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
            />
          </div>

          <button
            onClick={onAddItinerary}
            className="w-full px-4 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00b70d]-hover transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="size-4" />
            Add Day to Itinerary
          </button>
        </div>
      </div>

      {isStopPickerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsStopPickerOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#e2e8f0] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
                <h4 className="font-semibold text-[#0d2805]">Pick From Stops</h4>
                <button
                  type="button"
                  onClick={() => setIsStopPickerOpen(false)}
                  className="p-1.5 rounded-md hover:bg-[#f1f5f9] transition-colors"
                >
                  <X className="size-4 text-[#6a7282]" />
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto p-2">
                {orderedPoints.length === 0 ? (
                  <div className="px-3 py-6 text-sm text-[#6a7282] text-center">
                    Add stops or destinations first, then pick one here.
                  </div>
                ) : (
                  orderedPoints.map((point) => (
                    <button
                      key={`itinerary-stop-${point.stableId}`}
                      type="button"
                      onClick={() => applyStopToItinerary(point)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#f8f8f4] transition-colors border border-transparent hover:border-[#e2e8f0]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-[#0d2805] truncate">{point.location}</p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            point.pointType === "destination"
                              ? "bg-[#fff0e8] text-[#ff5900]"
                              : "bg-[#e8f9eb] text-[#00b70d]"
                          }`}
                        >
                          {point.pointType === "destination" ? "Destination" : "Stop"}
                        </span>
                      </div>
                      {point.address && (
                        <p className="text-xs text-[#6a7282] mt-1 truncate">{point.address}</p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}