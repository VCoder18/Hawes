import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { DestinationsQueryDto } from './dto/query.dto';

interface LatLng {
  lat: number;
  lng: number;
}

interface NearbyWilaya {
  region: string;
  distance_km: number;
}

export interface NearbyWilayasResponse {
  current: string;
  nearby: NearbyWilaya[];
}

@Injectable()
export class DestinationsService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  async getDestinations(userId: string, query: DestinationsQueryDto): Promise<any> {
    let dbQuery = this.supabaseClient
      .from('destinations')
      .select('*', { count: 'exact' });

    if (query.search) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query.search}%,region.ilike.%${query.search}%,city.ilike.%${query.search}%`
      );
    }

    if (query.category) {
      dbQuery = dbQuery.eq('category', query.category);
    }

    const { data, error, count } = await dbQuery
      .range(query.offset || 0, (query.offset || 0) + (query.limit || 10) - 1);

    if (error) {
      throw new Error(`Failed to fetch destinations: ${error.message}`);
    }

    const offset = query.offset || 0;
    const limit = query.limit || 10;
    const hasMore = offset + limit < (count || 0);
    return { data: data || [], total: count || 0, hasMore };
  }

  async getDestinationById(id: string): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Destination not found');
    }

    return data;
  }

  async getDestinationTrips(destinationId: string, userId: string | null): Promise<any[]> {
    const { data: stops, error: stopsError } = await this.supabaseClient
      .from('trip_stops')
      .select('trip')
      .eq('destination', destinationId);

    if (stopsError || !stops || stops.length === 0) {
      return [];
    }

    const tripIds = [...new Set(stops.map((s) => s.trip))];

    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('id, title, images, start_date, end_date, price, difficulty, category, min_participants, max_participants, status, visibility, organizer')
      .in('id', tripIds)
      .not('status', 'in', '("draft","cancelled")');

    if (userId) {
      tripsQuery = tripsQuery.or(`visibility.eq.public,organizer.eq.${userId}`);
    } else {
      tripsQuery = tripsQuery.eq('visibility', 'public');
    }

    const { data: trips, error: tripsError } = await tripsQuery;

    if (tripsError || !trips) {
      return [];
    }

    const tripIdsList = trips.map((t) => t.id);

    const { data: counts } = await this.supabaseClient
      .from('trip_participants')
      .select('trip_id')
      .in('trip_id', tripIdsList);

    const participantCounts = new Map<string, number>();
    if (counts) {
      for (const p of counts) {
        participantCounts.set(p.trip_id, (participantCounts.get(p.trip_id) || 0) + 1);
      }
    }

    return trips.map((trip) => ({
      ...trip,
      current_participants: participantCounts.get(trip.id) || 0,
    }));
  }

  async getNearbyWilayas(destinationId: string, maxRadiusKm = 500): Promise<NearbyWilayasResponse> {
    const current = await this.getDestinationById(destinationId);
    const currentRegion = current.region || 'Unknown';

    const center = this.parseLocation(current.location);
    if (!center) {
      throw new BadRequestException('Destination has no location data');
    }

    const { data: allDestinations } = await this.supabaseClient
      .from('destinations')
      .select('region, location');

    if (!allDestinations || allDestinations.length === 0) {
      return { current: currentRegion, nearby: [] };
    }

    const regionPoints: Map<string, LatLng[]> = new Map();
    for (const d of allDestinations) {
      if (!d.region) continue;
      const coords = this.parseLocation(d.location);
      if (!coords) continue;
      const existing = regionPoints.get(d.region);
      if (existing) {
        existing.push(coords);
      } else {
        regionPoints.set(d.region, [coords]);
      }
    }

    const nearbyMap = new Map<string, number>();

    for (const [region, points] of regionPoints) {
      if (region === currentRegion) continue;

      const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
      const avgLng = points.reduce((s, p) => s + p.lng, 0) / points.length;

      const dist = this.haversineDistance(center.lat, center.lng, avgLat, avgLng);
      const roundedDist = Math.round(dist * 10) / 10;

      if (roundedDist <= maxRadiusKm) {
        nearbyMap.set(region, roundedDist);
      }
    }

    const nearby = Array.from(nearbyMap.entries())
      .map(([region, distance_km]) => ({ region, distance_km }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return { current: currentRegion, nearby };
  }

  private parseLocation(location: unknown): LatLng | null {
    if (!location) return null;

    // GeoJSON format: { type: "Point", coordinates: [lng, lat] }
    if (
      typeof location === 'object' &&
      location !== null &&
      !Array.isArray(location)
    ) {
      const obj = location as Record<string, unknown>;
      if (
        obj.type === 'Point' &&
        Array.isArray(obj.coordinates) &&
        obj.coordinates.length >= 2
      ) {
        const [lng, lat] = obj.coordinates;
        if (typeof lng === 'number' && typeof lat === 'number') {
          return { lat, lng };
        }
      }
    }

    if (typeof location === 'string') {
      // WKT format: "POINT(lng lat)"
      const wktMatch = location.match(/POINT\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*\)/i);
      if (wktMatch) {
        const lng = parseFloat(wktMatch[1]);
        const lat = parseFloat(wktMatch[2]);
        if (isFinite(lat) && isFinite(lng)) return { lat, lng };
      }

      // WKB hex string from PostGIS
      const wkb = this.parseWKBHex(location);
      if (wkb) return wkb;
    }

    return null;
  }

  private parseWKBHex(hex: string): LatLng | null {
    try {
      const clean = hex.replace(/\s/g, '');
      if (clean.length < 42) return null;

      const bytes: number[] = [];
      for (let i = 0; i < clean.length; i += 2) {
        bytes.push(parseInt(clean.substring(i, i + 2), 16));
      }

      const le = bytes[0] === 1;

      const buf = new ArrayBuffer(8);
      const view = new DataView(buf);
      for (let i = 0; i < 8; i++) {
        view.setUint8(i, bytes[5 + (le ? i : 7 - i)]);
      }
      const lng = view.getFloat64(0, le);

      for (let i = 0; i < 8; i++) {
        view.setUint8(i, bytes[13 + (le ? i : 7 - i)]);
      }
      const lat = view.getFloat64(0, le);

      if (isFinite(lat) && isFinite(lng)) return { lat, lng };
    } catch {}
    return null;
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }
}
