import type { Destination, MeetingLocation } from "@/imports/types";

export type MediaDraft = { data: string; name: string; type: string };

export type StopLocationPayload = {
  type: "Point";
  coordinates: [number, number];
};

export type RuntimeStopPayload = {
  type: "meeting" | "destination";
  destination?: string;
  location: StopLocationPayload;
  label: string | null;
  index?: number;
  time?: string | null;
};

export const COVER_MIME_FALLBACK = "image/jpeg";

export const inferMimeTypeFromDataUrl = (dataUrl: string): string | null => {
  const match = dataUrl.match(/^data:([^;]+);base64,/i);
  return match?.[1] ?? null;
};

export const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const dataUrlToFile = async (draft: MediaDraft): Promise<File> => {
  const response = await fetch(draft.data);
  const blob = await response.blob();
  const fallbackType = inferMimeTypeFromDataUrl(draft.data) || blob.type || "application/octet-stream";
  const type = draft.type || fallbackType;
  const fileName = draft.name?.trim() ? draft.name : `upload-${Date.now()}`;
  return new File([blob], fileName, { type });
};

export const parseDestinationCoordinates = (destination: any): { lat: number; lng: number } | null => {
  if (Number.isFinite(destination?.lat) && Number.isFinite(destination?.lng)) {
    return { lat: Number(destination.lat), lng: Number(destination.lng) };
  }

  const coordinates = destination?.location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  if (typeof destination?.location === "string") {
    const hex = destination.location.trim();
    if (/^[0-9a-fA-F]+$/.test(hex) && hex.length >= 42 && hex.length % 2 === 0) {
      try {
        const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
        const view = new DataView(bytes.buffer);
        const littleEndian = view.getUint8(0) === 1;
        const typeWithFlags = view.getUint32(1, littleEndian);
        const geometryType = typeWithFlags & 0xff;
        const hasSrid = (typeWithFlags & 0x20000000) !== 0;
        if (geometryType === 1) {
          let offset = 5 + (hasSrid ? 4 : 0);
          if (bytes.byteLength >= offset + 16) {
            const lng = view.getFloat64(offset, littleEndian);
            const lat = view.getFloat64(offset + 8, littleEndian);
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { lat, lng };
            }
          }
        }
      } catch {
        // Resilience
      }
    }

    const match = destination.location.match(
      /POINT\s*\(\s*([+-]?[0-9]*\.?[0-9]+)\s+([+-]?[0-9]*\.?[0-9]+)\s*\)/i
    );
    if (match) {
      const lng = Number(match[1]);
      const lat = Number(match[2]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
};

export const sortIncludedByOptions = (items: string[], includedOptions: string[]) => {
  const builtinSet = new Set(includedOptions);
  const builtinItems = includedOptions.filter((item) => items.includes(item));
  const customItems = items.filter((item) => !builtinSet.has(item));
  return [...builtinItems, ...customItems];
};

export const matchesPopularityLevel = (level: string | null, peopleVisiting: number): boolean => {
  if (!level) return true;

  switch (level) {
    case "quiet":
      return peopleVisiting < 50;
    case "moderate":
      return peopleVisiting >= 50 && peopleVisiting < 200;
    case "popular":
      return peopleVisiting >= 200 && peopleVisiting < 500;
    case "very-popular":
      return peopleVisiting >= 500;
    default:
      return true;
  }
};

export const calculateDistanceKm = (
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number
): number => {
  const R = 6371;
  const dLat = ((lat - centerLat) * Math.PI) / 180;
  const dLng = ((lng - centerLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((centerLat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const buildStopsPayload = (
  meetingLocations: MeetingLocation[],
  selectedDestinationPoints: Destination[],
  orderedStopIds: string[] = []
): RuntimeStopPayload[] => {
  const meetingStops = meetingLocations.map((meeting) => {
    if (!Number.isFinite(meeting.lat) || !Number.isFinite(meeting.lng)) {
      throw new Error(`Meeting stop is missing map coordinates.`);
    }

    const coordinates: [number, number] = [meeting.lng as number, meeting.lat as number];

    return {
      stableId: `meeting:${meeting.placeId || `${meeting.location}-${meeting.time}-${meeting.lat}-${meeting.lng}`}`,
      type: "meeting" as const,
      location: {
        type: "Point" as const,
        coordinates,
      },
      label: meeting.location || null,
      time: meeting.time || null,
    };
  });

  const destinationStops = selectedDestinationPoints
    .filter((destination) => Number.isFinite(destination.lat) && Number.isFinite(destination.lng))
    .map((destination) => {
      const destinationId = String(destination.id);
      const stopType: RuntimeStopPayload["type"] = isUuid(destinationId)
        ? "destination"
        : "meeting";
      const coordinates: [number, number] = [destination.lng, destination.lat];
      return {
        stableId: `destination:${destination.id}`,
        type: stopType,
        ...(stopType === "destination" ? { destination: destinationId } : {}),
        location: {
          type: "Point" as const,
          coordinates,
        },
        label: destination.name || null,
        time: null,
      };
    });

  const allStops = [...meetingStops, ...destinationStops];

  const stopById = new Map(allStops.map((stop) => [stop.stableId, stop]));
  const ordered = orderedStopIds
    .map((id) => stopById.get(id))
    .filter((stop): stop is (typeof allStops)[number] => Boolean(stop));
  
  const remaining = allStops.filter((stop) => !ordered.some((os) => os.stableId === stop.stableId));
  const finalOrder = [...ordered, ...remaining];

  return finalOrder.map((stop, index) => ({
    type: stop.type,
    ...(stop.type === "destination" && "destination" in stop ? { destination: stop.destination } : {}),
    location: stop.location,
    label: stop.label,
    index,
    ...("time" in stop && stop.time ? { time: stop.time } : {}),
  }));
};
