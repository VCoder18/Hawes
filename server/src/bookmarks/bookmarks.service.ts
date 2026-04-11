import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
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

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    const { error, data: bookmarks } = await this.supabaseClient
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId);

    if (error || !bookmarks) {
      console.error(`Failed to fetch user bookmarks: ${error}`);
      throw new InternalServerErrorException('Failed to fetch user bookmarks');
    }

    return bookmarks;
  }

  async isBookmarked(userId: string, tripId: string): Promise<boolean> {
    const { error, data: existingData } = await this.supabaseClient
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('trip_id', tripId);

    if (error || !existingData) {
      throw new InternalServerErrorException('Failed to fetch user bookmarks');
    }

    return existingData.length > 0;
  }

  async addBookmark(userId: string, tripId: string): Promise<Bookmark> {
    const { error: fetchError, data: existingData } = await this.supabaseClient
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('trip_id', tripId);

    if (fetchError || !existingData) {
      console.error(`Failed to fetch user bookmarks: ${fetchError}`);
      throw new InternalServerErrorException('Failed to fetch user bookmarks');
    }

    if (existingData.length > 0) {
      throw new ConflictException(
        'You already have this trip bookmarked idiot',
      );
    }

    const { error, data: bookmark } = await this.supabaseClient
      .from('bookmarks')
      .insert({ user_id: userId, trip_id: tripId })
      .select('*')
      .single();

    if (error || !bookmark) {
      console.error(`Failed to add bookmark: ${error.message}`);
      throw new InternalServerErrorException(`Failed to add bookmark`);
    }

    return bookmark;
  }

  async removeBookmark(userId: string, tripId: string): Promise<string> {
    const { error } = await this.supabaseClient
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('trip_id', tripId);

    if (error) {
      throw new NotFoundException('Bookmark not found');
    }

    return tripId;
  }
}
