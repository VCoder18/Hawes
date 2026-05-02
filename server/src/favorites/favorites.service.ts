import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
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

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const { error, data: favorites } = await this.supabaseClient
      .from('favorite_destinations')
      .select('*')
      .eq('user_id', userId);

    if (error || !favorites) {
      console.error(`Failed to fetch user favorites: ${error}`);
      throw new InternalServerErrorException('Failed to fetch user favorites');
    }

    return favorites;
  }

  async isFavorited(userId: string, destinationId: string): Promise<boolean> {
    const { error, data: existingData } = await this.supabaseClient
      .from('favorite_destinations')
      .select('*')
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error || !existingData) {
      console.error(`Failed to fetch favorite: ${error}`);
      throw new InternalServerErrorException('Failed to fetch favorite');
    }

    return existingData.length > 0;
  }

  async addFavorite(userId: string, destinationId: string): Promise<Favorite> {
    const { error: fetchError, data: existingData } = await this.supabaseClient
      .from('favorite_destinations')
      .select('*')
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (fetchError || !existingData) {
      console.error(`Failed to fetch user favorites: ${fetchError}`);
      throw new InternalServerErrorException('Failed to fetch user favorites');
    }

    if (existingData.length > 0) {
      throw new ConflictException(
        'You already have this destination in your favorites',
      );
    }

    const { error, data: favorite } = await this.supabaseClient
      .from('favorite_destinations')
      .insert({ user_id: userId, destination_id: destinationId })
      .select('*')
      .single();

    if (error || !favorite) {
      console.log(`Failed to add favorite: ${error}`);
      throw new InternalServerErrorException(`Failed to add favorite`);
    }

    return favorite;
  }

  async removeFavorite(userId: string, destinationId: string): Promise<string> {
    const { error } = await this.supabaseClient
      .from('favorite_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) {
      throw new NotFoundException(
        "You don't have this destination in your favorites",
      );
    }

    return destinationId;
  }
}
