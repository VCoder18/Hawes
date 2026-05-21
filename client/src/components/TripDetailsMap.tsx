import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, Source, type MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import { Plus, Minus } from "lucide-react";
import type { Trip } from "@/lib/mockData";
import { ReorderableMeetingList, type SchedulePoint } from "@/components/CreateTrip/ReorderableMeetingList";

import "maplibre-gl/dist/maplibre-gl.css";

type MapPoint = {
  label: string;
  lat: number;
  lng: number;
  pointType: "meeting" | "destination";
  order: number;
};

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

interface TripDetailsMapProps {
  trip: Trip;
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

export function TripDetailsMap({ trip }: TripDetailsMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [routedLine, setRoutedLine] = useState<LineFeature | null>(null);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [footConnectors, setFootConnectors] = useState<LineFeatureCollection>(EMPTY_LINE_COLLECTION);
  const [mapStyle, setMapStyle] = useState<'tiled' | 'minimal' | 'dark'>('minimal');
  const [cinematicMode, setCinematicMode] = useState(false);
  const [showReturnRoute, setShowReturnRoute] = useState(false);
  const [returnRouteLine, setReturnRouteLine] = useState<LineFeature | null>(null);

  const points = useMemo<MapPoint[]>(() => {
    const stops = Array.isArray(trip.stops) ? trip.stops : [];

    return stops
      .map((stop, index) => {
        const lat = Number(stop.location?.lat);
        const lng = Number(stop.location?.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return {
          label: stop.label ?? `Stop ${index + 1}`,
          lat,
          lng,
          pointType: stop.stop_type === "meeting" ? "meeting" : "destination",
          order: index,
        };
      })
      .filter((value): value is MapPoint => Boolean(value));
  }, [trip.stops]);

  const directRouteGeoJson = useMemo<LineFeature>(
    () => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: points.map((point) => [point.lng, point.lat]),
      },
      properties: {},
    }),
    [points]
  );

  const routeGeoJson = routedLine || directRouteGeoJson;
  const hasFootConnectors = footConnectors.features.length > 0;
  const greenShades = ["#00b70d", "#16a34a", "#15803d"];
  const blueShades = ["#0a84ff", "#2563eb", "#1d4ed8"];
  const fallbackRouteColor =
    points.length >= 2 && (points[0]?.pointType === "destination" || points[1]?.pointType === "destination")
      ? "#ff5900"
      : greenShades[0];

  const getRouteSegmentColor = (segmentIndex: number) => {
    const shadeIndex = Math.floor(segmentIndex / 2) % greenShades.length;
    return segmentIndex % 2 === 0 ? greenShades[shadeIndex] : blueShades[shadeIndex];
  };

  const connectorColor = "#111111";

  useEffect(() => {
    const controller = new AbortController();

    const fetchRoute = async () => {
      if (points.length < 2) {
        setRoutedLine(null);
        setRouteSegments([]);
        setFootConnectors(EMPTY_LINE_COLLECTION);
        return;
      }

      try {
        const coordinates = points.map((point) => `${point.lng},${point.lat}`).join(";");

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

            if (stepCoords.length === 0) {
              return;
            }

            if (stepIndex > 0 && legCoords.length > 0) {
              legCoords.push(...stepCoords.slice(1));
            } else {
              legCoords.push(...stepCoords);
            }
          });

          if (legCoords.length >= 2) {
            const startPoint = points[legIndex];
            const endPoint = points[legIndex + 1];
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

        points.forEach((point, index) => {
          const snapped = waypoints[index]?.location;
          if (!Array.isArray(snapped) || snapped.length < 2) {
            return;
          }

          const snappedLng = Number(snapped[0]);
          const snappedLat = Number(snapped[1]);

          if (!Number.isFinite(snappedLng) || !Number.isFinite(snappedLat)) {
            return;
          }

          const gapMeters = getDistanceMeters(point.lat, point.lng, snappedLat, snappedLng);
          if (gapMeters <= WALK_CONNECTOR_THRESHOLD_METERS) {
            return;
          }

          connectorFeatures.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [snappedLng, snappedLat],
                [point.lng, point.lat],
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
        if ((error as Error).name === "AbortError") {
          return;
        }

        setRoutedLine(null);
        setRouteSegments([]);
        setFootConnectors(EMPTY_LINE_COLLECTION);
      }
    };

    void fetchRoute();

    return () => {
      controller.abort();
    };
  }, [points]);

  const routePoints = useMemo<SchedulePoint[]>(
    () =>
      points.map((point, index) => ({
        location: point.label,
        time: "",
        lat: point.lat,
        lng: point.lng,
        pointType: point.pointType,
        stableId: `readonly-point-${point.order}-${index}`,
      })),
    [points]
  );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (points.length === 0) {
      mapRef.current.fitBounds(ALGERIA_BOUNDS, { padding: 30, duration: 300 });
      return;
    }

    const bounds = points.reduce(
      (acc, point) => {
        acc.minLng = Math.min(acc.minLng, point.lng);
        acc.maxLng = Math.max(acc.maxLng, point.lng);
        acc.minLat = Math.min(acc.minLat, point.lat);
        acc.maxLat = Math.max(acc.maxLat, point.lat);
        return acc;
      },
      { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
    );

    mapRef.current.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      { padding: 60, duration: 300 }
    );
  }, [points]);

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const currentZoom = map.getZoom();
    map.easeTo({ zoom: currentZoom + ZOOM_IN_STEP, duration: 250 });
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const currentZoom = map.getZoom();
    if (currentZoom <= MIN_ALGERIA_ZOOM + 0.15) {
      map.fitBounds(ALGERIA_BOUNDS, { padding: 30, duration: 300 });
      return;
    }

    map.easeTo({ zoom: Math.max(MIN_ALGERIA_ZOOM, currentZoom - ZOOM_OUT_STEP), duration: 250 });
  };

  const handlePointClick = (location: SchedulePoint) => {
    const map = mapRef.current;
    if (!map || !Number.isFinite(location.lng) || !Number.isFinite(location.lat)) {
      return;
    }

    map.flyTo({
      center: [Number(location.lng), Number(location.lat)],
      zoom: Math.max(map.getZoom(), 10.8),
      duration: 650,
      essential: true,
    });
  };

  const mapStyleUrl = mapStyle === 'dark' ? OSM_DARK_RASTER_STYLE : mapStyle === 'minimal' ? MINIMAL_STYLE : OSM_RASTER_STYLE;
  const mapPitch = cinematicMode ? 50 : 0;
  const mapBearing = cinematicMode ? -25 : 0;

  useEffect(() => {
    const controller = new AbortController();

    const fetchReturnRoute = async () => {
      if (!showReturnRoute || points.length < 2) {
        setReturnRouteLine(null);
        return;
      }

      try {
        const lastPoint = points[points.length - 1];
        const firstPoint = points[0];
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
        if ((error as Error).name === "AbortError") {
          return;
        }

        setReturnRouteLine(null);
      }
    };

    void fetchReturnRoute();

    return () => {
      controller.abort();
    };
  }, [showReturnRoute, points]);

  useEffect(() => {
    if (!mapRef.current || points.length === 0) {
      return;
    }

    const firstPoint = points[0];
    mapRef.current.flyTo({
      center: [firstPoint.lng, firstPoint.lat],
      zoom: 10,
      duration: 800,
      essential: true,
    });
  }, []);

  const meetingMarkerColor = "#00b70d";
  const destinationMarkerColor = "#ff5900";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2">
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
      <div className="relative rounded-xl border border-[#e2e8f0] overflow-hidden min-h-[350px]">
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
          style={{ width: "100%", height: "350px" }}
        >
          {showReturnRoute && returnRouteLine && (
            <Source id="trip-return-route" type="geojson" data={returnRouteLine}>
              <Layer
                id="trip-return-route-line"
                type="line"
                paint={{
                  "line-color": "#fcd34d",
                  "line-width": 4,
                }}
              />
            </Source>
          )}

          {routeSegments.length > 0 ? (
            routeSegments.map((segment, idx) => (
              <Source key={`trip-route-segment-${idx}`} id={`trip-route-segment-${idx}`} type="geojson" data={segment.feature}>
                <Layer
                  id={`trip-route-line-${idx}`}
                  type="line"
                  paint={{
                    "line-color": segment.color,
                    "line-width": 4,
                  }}
                />
              </Source>
            ))
          ) : routeGeoJson.geometry.coordinates.length >= 2 ? (
            <Source id="trip-route" type="geojson" data={routeGeoJson}>
              <Layer
                id="trip-route-line"
                type="line"
                paint={{
                  "line-color": fallbackRouteColor,
                  "line-width": 4,
                }}
              />
            </Source>
          ) : null}

          {hasFootConnectors && (
            <Source id="trip-foot-connectors" type="geojson" data={footConnectors}>
              <Layer
                id="trip-foot-connectors-line"
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

          {points.map((point, index) => {
            const markerColor = point.pointType === "destination" ? destinationMarkerColor : meetingMarkerColor;

            return (
              <Marker key={`${point.order}-${point.label}`} longitude={point.lng} latitude={point.lat} anchor="bottom">
                <svg width="32" height="40" viewBox="0 0 32 40" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                  <path
                    d="M 16 0 C 8 0 2 6 2 14 C 2 24 16 40 16 40 C 16 40 30 24 30 14 C 30 6 24 0 16 0 Z"
                    fill={markerColor}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <circle cx="16" cy="13" r="9" fill="white" />
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
                    {index + 1}
                  </text>
                </svg>
              </Marker>
            );
          })}
        </Map>

        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            className="size-9 rounded-lg bg-white/95 border border-[#d1d5db] shadow-sm hover:bg-white transition-colors flex items-center justify-center"
            aria-label="Zoom in"
          >
            <Plus className="size-5 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="size-9 rounded-lg bg-white/95 border border-[#d1d5db] shadow-sm hover:bg-white transition-colors flex items-center justify-center"
            aria-label="Zoom out"
          >
            <Minus className="size-5 text-gray-700" />
          </button>
        </div>
      </div>

      {routePoints.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#0d2805] mb-2">Selected Route Points</h3>
          <ReorderableMeetingList
            meetingLocations={routePoints}
            onReorder={() => {}}
            onRemove={() => {}}
            onItemClick={handlePointClick}
            lockFirstItem={false}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
