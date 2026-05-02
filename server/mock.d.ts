export interface TripStop {
    id: string;
    trip_id: string;
    stop_order: number;
    stop_type: string;
    destination_id: string | null;
    location: unknown;
    label: string | null;
    created_at: string | null;
    updated_at: string | null;
}
export interface Trip {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    difficulty: string;
    cover_image: string | null;
    start_date: string;
    end_date: string;
    price: number | null;
    max_participants: number | null;
    min_participants: number | null;
    stops?: TripStop[];
    destinations?: string[];
    itinerary?: string[];
    activities?: string[];
    included?: string[];
    not_included?: string[];
    what_to_bring?: string[];
    images?: string[];
    [key: string]: unknown;
}
export declare const mockTrips: Trip[];
export declare function getAllTrips(limit?: number, offset?: number): {
    data: Trip[];
    total: number;
    hasMore: boolean;
};
export declare function getTripById(id: string): Trip | null;
export declare function searchTrips(query: string, limit?: number, offset?: number): {
    data: Trip[];
    total: number;
    hasMore: boolean;
};
export declare function filterTrips(filters: Record<string, any>, limit?: number, offset?: number): {
    data: Trip[];
    total: number;
    hasMore: boolean;
};
