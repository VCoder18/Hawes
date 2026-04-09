import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  async addBookmark(userId: string, tripId: string): Promise<Bookmark> {
    const { data: tripExists, error: tripError } = await this.supabaseClient
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .single();

    if (tripError || !tripExists) {
      throw new NotFoundException(`Trip with id ${tripId} not found`);
    }

    const { data: existingBookmark } = await this.supabaseClient
      .from('bookmarks' as any)
      .select('*')
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .single();

    if (existingBookmark) {
      return existingBookmark as Bookmark;
    }

    const { data, error } = await this.supabaseClient
      .from('bookmarks' as any)
      .insert({ user_id: userId, trip_id: tripId } as any)
      .select('*')
      .single();

    if (error) {
      throw new ConflictException(`Failed to add bookmark: ${error.message}`);
    }

    return data as Bookmark;
  }

  async removeBookmark(userId: string, tripId: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('bookmarks' as any)
      .delete()
      .eq('user_id', userId)
      .eq('trip_id', tripId);

    if (error) {
      throw new NotFoundException('Bookmark not found');
    }
  }

  async getUserBookmarks(userId: string): Promise<string[]> {
    const { data, error } = await this.supabaseClient
      .from('bookmarks' as any)
      .select('trip_id')
      .eq('user_id', userId);

    if (error) {
      return [];
    }

    return ((data ?? []) as Array<{ trip_id: string }>).map((row) => row.trip_id);
  }

  async isBookmarked(userId: string, tripId: string): Promise<boolean> {
    const { data } = await this.supabaseClient
      .from('bookmarks' as any)
      .select('*')
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .single();

    return !!data;
  }
}
