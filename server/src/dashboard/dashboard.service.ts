import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Trip } from 'src/trips/entities/trips.entity';
import { DashboardQueryDto } from './dto/query.dto';
import { TripsQueryDto, TripsQueryFilter } from 'src/trips/dto/query.dto';

export interface BusinessStats {
  services: any[];
  totalClients: number;
  avgRating: number;
  reviewCount: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  avgPrice: number;
  capacity: { current: number; total: number };
}

export interface RevenueChartData {
  months: { month: string; revenue: number; bookings: number }[];
  years: { year: string; revenue: number }[];
}

@Injectable()
export class DashboardService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  async getUserTrips(
    userId: string,
    query: DashboardQueryDto,
  ): Promise<Trip[]> {
    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('*')
      .eq('organizer', userId);

    if (query.status) {
      tripsQuery.eq('status', query.status);
    }

    const { error, data: trips } = await new TripsQueryFilter(
      query,
      this.supabaseClient,
    ).apply(tripsQuery, userId);

    if (error || !trips) {
      throw new InternalServerErrorException('Failed to fetch user trips');
    }

    // Attach participant counts to each trip
    const tripIds = trips.map((t) => t.id);
    if (tripIds.length > 0) {
      const countsResults = await Promise.all(
        tripIds.map((tid) =>
          this.supabaseClient
            .from('trip_participants')
            .select('*', { count: 'exact', head: true })
            .eq('trip_id', tid)
        ),
      );

      const countsMap = new Map<string, number>();
      countsResults.forEach((r, idx) => {
        countsMap.set(String(tripIds[idx]), r?.count ?? 0);
      });

      return trips.map((trip) => ({
        ...trip,
        current_participants: countsMap.get(String(trip.id)) ?? 0,
      }));
    }

    return trips;
  }

  async getUserHistory(userId: string, query: TripsQueryDto): Promise<Trip[]> {
    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('*, trip_participants!inner(user_id)')
      .eq('trip_participants.user_id', userId);

    const { error, data: trips } = await new TripsQueryFilter(
      query,
      this.supabaseClient,
    ).apply(tripsQuery, userId);

    if (error || !trips) {
      throw new InternalServerErrorException(
        'Failed to fetch user participated trips',
      );
    }

    // Attach participant counts where possible (useful if these trips are shown in dashboard)
    const tripIds = trips.map((t) => t.id);
    if (tripIds.length > 0) {
      const countsResults = await Promise.all(
        tripIds.map((tid) =>
          this.supabaseClient
            .from('trip_participants')
            .select('*', { count: 'exact', head: true })
            .eq('trip_id', tid)
        ),
      );

      const countsMap = new Map<string, number>();
      countsResults.forEach((r, idx) => {
        countsMap.set(String(tripIds[idx]), r?.count ?? 0);
      });

      return trips.map((trip) => ({
        ...trip,
        current_participants: countsMap.get(String(trip.id)) ?? 0,
      }));
    }

    return trips;
  }

  async getBusinessStats(userId: string): Promise<BusinessStats> {
    const { data: services, error: servicesError } = await this.supabaseClient
      .from('services')
      .select('*')
      .eq('owner_id', userId);

    if (servicesError) {
      throw new InternalServerErrorException('Failed to fetch services');
    }

    const serviceIds = services?.map((s) => s.id) ?? [];

    if (serviceIds.length === 0) {
      return {
        services: [],
        totalClients: 0,
        avgRating: 0,
        reviewCount: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        avgPrice: 0,
        capacity: { current: 0, total: 0 },
      };
    }

    const { data: reviews } = await this.supabaseClient
      .from('service_reviews')
      .select('*')
      .in('service_id', serviceIds);

    const { data: bookings } = await this.supabaseClient
      .from('service_bookings')
      .select('*')
      .in('service_id', serviceIds);

    const totalClients = (services ?? []).reduce(
      (sum, s) => sum + Number(s.client_limit ?? 0),
      0,
    );
    const reviewCount = reviews?.length ?? 0;
    const avgRating =
      reviewCount > 0
        ? (reviews ?? []).reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
    const monthlyRevenue = (services ?? []).reduce(
      (sum, s) => sum + Number(s.monthly_revenue ?? 0),
      0,
    );
    const yearlyRevenue = (services ?? []).reduce(
      (sum, s) => sum + Number(s.yearly_revenue ?? 0),
      0,
    );
    const costs = (services ?? []).map((s) => Number(s.min_cost ?? 0));
    const avgPrice =
      costs.length > 0
        ? costs.reduce((a, b) => a + b, 0) / costs.length
        : 0;
    const totalBooked = bookings?.length ?? 0;
    const totalCapacity = totalClients;

    return {
      services: services ?? [],
      totalClients,
      avgRating,
      reviewCount,
      monthlyRevenue,
      yearlyRevenue,
      avgPrice,
      capacity: { current: totalBooked, total: totalCapacity },
    };
  }

  async getAssociatedTrips(
    userId: string,
    query: TripsQueryDto,
  ): Promise<Trip[]> {
    const { data: services, error: servicesError } = await this.supabaseClient
      .from('services')
      .select('id')
      .eq('owner_id', userId);

    if (servicesError) {
      throw new InternalServerErrorException('Failed to fetch services');
    }

    const serviceIds = services?.map((s) => s.id) ?? [];

    if (serviceIds.length === 0) {
      return [];
    }

    const { data: tripStops, error: stopsError } = await this.supabaseClient
      .from('trip_stops')
      .select('trip')
      .in('service', serviceIds);

    if (stopsError) {
      throw new InternalServerErrorException(
        'Failed to fetch associated trips',
      );
    }

    const tripIds = [...new Set(tripStops?.map((ts) => ts.trip) ?? [])];

    if (tripIds.length === 0) {
      return [];
    }

    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('*')
      .in('id', tripIds);

    const { error, data: trips } = await new TripsQueryFilter(
      query,
      this.supabaseClient,
    ).apply(tripsQuery, userId);

    if (error || !trips) {
      throw new InternalServerErrorException(
        'Failed to fetch associated trips',
      );
    }

    // Attach participant counts
    const tripIdsRes = trips.map((t) => t.id);
    if (tripIdsRes.length > 0) {
      const countsResults = await Promise.all(
        tripIdsRes.map((tid) =>
          this.supabaseClient
            .from('trip_participants')
            .select('*', { count: 'exact', head: true })
            .eq('trip_id', tid)
        ),
      );

      const countsMap = new Map<string, number>();
      countsResults.forEach((r, idx) => {
        countsMap.set(String(tripIdsRes[idx]), r?.count ?? 0);
      });

      return trips.map((trip) => ({
        ...trip,
        current_participants: countsMap.get(String(trip.id)) ?? 0,
      }));
    }

    return trips;
  }

  async getClientsForOrganizer(userId: string) {
    // Match trips by organizer id and legacy organizer username values.
    const { data: profile } = await this.supabaseClient
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .maybeSingle();

    const username = profile?.username ?? null;

    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('id');

    if (username) {
      tripsQuery = tripsQuery.or(`organizer.eq.${userId},organizer.eq.${username}`);
    } else {
      tripsQuery = tripsQuery.eq('organizer', userId);
    }

    const { data: myTrips, error: myTripsError } = await tripsQuery;

    if (myTripsError) {
      throw new InternalServerErrorException('Failed to fetch organizer trips');
    }

    const tripIds = (myTrips ?? []).map((t) => t.id);
    if (tripIds.length === 0) return [];

    // Fetch participants for those trips in one query
    const { data: participants, error: participantsError } = await this.supabaseClient
      .from('trip_participants')
      .select('id, joined_at, user_id, profile:user_id(id, display_name, username, avatar_url, email), trip:trip_id(id, title, start_date, end_date, price, organizer)')
      .in('trip_id', tripIds);

    if (participantsError) {
      throw new InternalServerErrorException('Failed to fetch trip participants');
    }

    // Return flat list of participant records; client will group/display as needed
    return participants ?? [];
  }

  // Debug helper: returns diagnostic info for organizer client lookup
  async getClientsForOrganizerDebug(userId: string) {
    let username: string | null = null;
    try {
      const { data: profile } = await this.supabaseClient
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
      username = profile?.username ?? null;
    } catch (e) {
      username = null;
    }

    let tripsQuery = this.supabaseClient
      .from('trips')
      .select('id, title, organizer');
    if (username) {
      tripsQuery = tripsQuery.or(`organizer.eq.${userId},organizer.eq.${username}`);
    } else {
      tripsQuery = tripsQuery.eq('organizer', userId);
    }

    const { data: myTrips, error: myTripsError } = await tripsQuery;
    const tripIds = (myTrips ?? []).map((t) => t.id);

    const { data: participants, error: participantsError } = await this.supabaseClient
      .from('trip_participants')
      .select(`
        id,
        joined_at,
        user_id,
        profile:user_id (id, display_name, username, avatar_url, email),
        trip:trip_id (id, title, organizer)
      `)
      .in('trip_id', tripIds);

    return {
      userId,
      username,
      tripIds,
      tripsFound: myTrips ?? [],
      participants: participants ?? [],
      myTripsError: myTripsError ?? null,
      participantsError: participantsError ?? null,
    };
  }

  async getRevenueChart(userId: string): Promise<RevenueChartData> {
    const { data: services, error } = await this.supabaseClient
      .from('services')
      .select('monthly_revenue, yearly_revenue, current_revenue, name')
      .eq('owner_id', userId);

    if (error) {
      throw new InternalServerErrorException('Failed to fetch revenue data');
    }

    const totalMonthly = (services ?? []).reduce(
      (sum, s) => sum + Number(s.monthly_revenue ?? 0),
      0,
    );
    const totalYearly = (services ?? []).reduce(
      (sum, s) => sum + Number(s.yearly_revenue ?? 0),
      0,
    );
    const totalCurrent = (services ?? []).reduce(
      (sum, s) => sum + Number(s.current_revenue ?? 0),
      0,
    );

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const totalMonthlyValue = totalMonthly > 0 ? totalMonthly : totalCurrent;
    const months = monthNames.map((month, i) => {
      const factor = [0.7, 0.75, 0.85, 0.9, 1.0, 1.1, 1.2, 1.15, 1.0, 0.9, 0.8, 0.75][i];
      return {
        month,
        revenue: Math.round(totalMonthlyValue * factor * 100) / 100,
        bookings: Math.round(factor * 5 + 1),
      };
    });

    const currentYear = new Date().getFullYear().toString();
    const years = [
      { year: (Number(currentYear) - 1).toString(), revenue: totalYearly },
      { year: currentYear, revenue: Math.round(totalYearly * 1.15) },
    ];

    return { months, years };
  }

  async updateServiceLimit(
    userId: string,
    serviceId: number,
    clientLimit: number,
  ) {
    const { data: service, error: fetchError } = await this.supabaseClient
      .from('services')
      .select('id, owner_id')
      .eq('id', serviceId)
      .single();

    if (fetchError || !service) {
      throw new InternalServerErrorException('Service not found');
    }

    if (service.owner_id !== userId) {
      throw new ForbiddenException('You do not own this service');
    }

    const { error: updateError } = await this.supabaseClient
      .from('services')
      .update({ client_limit: clientLimit })
      .eq('id', serviceId);

    if (updateError) {
      throw new InternalServerErrorException('Failed to update service limit');
    }

    return { success: true, client_limit: clientLimit };
  }
}
