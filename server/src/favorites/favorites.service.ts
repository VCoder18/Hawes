import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  async addFavorite(userId: string, destinationId: string): Promise<Favorite> {
    // Check if destination exists
    const { data: destExists, error: destError } = await this.supabaseClient
      .from('destinations')
      .select('id')
      .eq('id', destinationId)
      .single();

    if (destError || !destExists) {
      throw new NotFoundException(`Destination with id ${destinationId} not found`);
    }

    // Check if already favorited
    const { data: existingFav } = await this.supabaseClient
      .from('favorite_destinations')
      .select()
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
      .single();

    if (existingFav) {
      return existingFav;
    }

    // Insert new favorite
    const { data, error } = await this.supabaseClient
      .from('favorite_destinations')
      // @ts-ignore
      .insert({ user_id: userId, destination_id: destinationId })
      .select()
      .single();

    if (error) {
      console.error('Favorites service error:', {
        userId,
        destinationId,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details,
      });
      throw new ConflictException(`Failed to add favorite: ${error.message}`);
    }
    return data;
  }

  async removeFavorite(userId: string, destinationId: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('favorite_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) {
      throw new NotFoundException('Favorite not found');
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await this.supabaseClient
      .from('favorite_destinations')
      .select('destination_id')
      .eq('user_id', userId);

    if (error) {
      return [];
    }
    return data.map((fav: any) => fav.destination_id);
  }

  async isFavorited(userId: string, destinationId: string): Promise<boolean> {
    const { data } = await this.supabaseClient
      .from('favorite_destinations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
      .single();

    return !!data;
  }
}
