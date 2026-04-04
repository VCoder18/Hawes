export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          youtube_url: string | null;
          twitter_url: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          linkedin_url: string | null;
          profile_scope: string | null;
          show_trip_history: boolean | null;
          show_activity_status: boolean | null;
          role: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          display_name: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          youtube_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          linkedin_url?: string | null;
          profile_scope?: string | null;
          show_trip_history?: boolean | null;
          show_activity_status?: boolean | null;
          role?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          youtube_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          linkedin_url?: string | null;
          profile_scope?: string | null;
          show_trip_history?: boolean | null;
          show_activity_status?: boolean | null;
          role?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          city: string | null;
          region: string | null;
          location: unknown;
          cover_image: string | null;
          avg_rating: number | null;
          review_count: number | null;
          created_at: string | null;
          updated_at: string | null;
          category: string | null;
          best_periods: Json[] | null;
          images: string[] | null;
          trip_ids: string[] | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          city?: string | null;
          region?: string | null;
          location?: unknown;
          cover_image?: string | null;
          avg_rating?: number | null;
          review_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          category?: string | null;
          best_periods?: Json[] | null;
          images?: string[] | null;
          trip_ids?: string[] | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          city?: string | null;
          region?: string | null;
          location?: unknown;
          cover_image?: string | null;
          avg_rating?: number | null;
          review_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          category?: string | null;
          best_periods?: Json[] | null;
          images?: string[] | null;
          trip_ids?: string[] | null;
        };
      };
      trips: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          description: string | null;
          category: string | null;
          difficulty: string;
          cover_image: string | null;
          start_date: string;
          end_date: string;
          itinerary: string[] | null;
          what_to_bring: string[] | null;
          included: string[] | null;
          not_included: string[] | null;
          min_participants: number | null;
          max_participants: number | null;
          price: number | null;
          organizer: string;
          status: string;
          returns_to_start: boolean;
          activities: string[] | null;
          images: string[];
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          description?: string | null;
          category?: string | null;
          difficulty: string;
          cover_image?: string | null;
          start_date: string;
          end_date: string;
          itinerary?: string[] | null;
          what_to_bring?: string[] | null;
          included?: string[] | null;
          not_included?: string[] | null;
          min_participants?: number | null;
          max_participants?: number | null;
          price?: number | null;
          organizer: string;
          status?: string;
          returns_to_start?: boolean;
          activities?: string[] | null;
          images: string[];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          description?: string | null;
          category?: string | null;
          difficulty?: string;
          cover_image?: string | null;
          start_date?: string;
          end_date?: string;
          itinerary?: string[] | null;
          what_to_bring?: string[] | null;
          included?: string[] | null;
          not_included?: string[] | null;
          min_participants?: number | null;
          max_participants?: number | null;
          price?: number | null;
          organizer?: string;
          status?: string;
          returns_to_start?: boolean;
          activities?: string[] | null;
          images?: string[];
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      trip_stops: {
        Row: {
          id: string;
          trip_id: string;
          stop_order: number;
          stop_type: string;
          destination_id: string | null;
          location: unknown;
          label: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          stop_order: number;
          stop_type: string;
          destination_id?: string | null;
          location?: unknown;
          label?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string;
          stop_order?: number;
          stop_type?: string;
          destination_id?: string | null;
          location?: unknown;
          label?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      trip_participants: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          status: string;
          joined_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id: string;
          status: string;
          joined_at?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string;
          user_id?: string;
          status?: string;
          joined_at?: string | null;
        };
      };
      favorite_destinations: {
        Row: {
          user_id: string;
          destination_id: string;
          created_at: string | null;
        };
        Insert: {
          user_id: string;
          destination_id: string;
          created_at?: string | null;
        };
        Update: {
          user_id?: string;
          destination_id?: string;
          created_at?: string | null;
        };
      };
      trip_images: {
        Row: {
          id: string;
          trip_id: string;
          image_url: string | null;
          order_index: number | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          image_url?: string | null;
          order_index?: number | null;
        };
        Update: {
          id?: string;
          trip_id?: string;
          image_url?: string | null;
          order_index?: number | null;
        };
      };
      trip_activities: {
        Row: {
          id: string;
          trip_id: string;
          activity: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          activity: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          activity?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          destination_id: string | null;
          images: string[] | null;
          views_count: number | null;
          likes_count: number | null;
          comments_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          destination_id?: string | null;
          images?: string[] | null;
          views_count?: number | null;
          likes_count?: number | null;
          comments_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          destination_id?: string | null;
          images?: string[] | null;
          views_count?: number | null;
          likes_count?: number | null;
          comments_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      trip_status: 'draft' | 'published' | 'completed' | 'cancelled';
      trip_difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
      trip_stop_type: 'meeting' | 'destination';
      trip_category: 'adventure' | 'cultural' | 'nature' | 'historical' | 'relaxation' | 'photography';
      destination_category: 'beach' | 'mountain' | 'desert' | 'forest' | 'historic' | 'city';
      user_role: 'traveler' | 'organization' | 'agency' | 'services';
    };
  };
}
