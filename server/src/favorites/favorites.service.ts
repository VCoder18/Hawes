import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
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

  async addFavorite(userId: string, destinationId: string): Promise<Favorite> {
    const { error: fetchError, data: destination } = await this.supabaseClient
      .from('destinations')
      .select('id')
      .eq('id', destinationId)
      .single();

    if (fetchError || !destination) {
      throw new NotFoundException(
        `Destination with id ${destinationId} not found`,
      );
    }

    const { data: existingFavorite } = await this.supabaseClient
      .from('favorite_destinations')
      .select('id')
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
      .single();

    if (existingFavorite) {
      throw new ConflictException(
        'You already have this destination in your favorites',
      );
    }

    const { data, error } = await this.supabaseClient
      .from('favorite_destinations')
      .insert({ user_id: userId, destination_id: destinationId })
      .select()
      .single();

    if (error || !data) {
      console.log(`Failed to add favorite: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to add favorite: ${error.message}`,
      );
    }

    return data;
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
    const { error, data: favorite } = await this.supabaseClient
      .from('favorite_destinations')
      .select('*')
      .eq('user_id', userId)
      .eq('destination_id', destinationId)
      .single();

    if (error || !favorite) {
      throw new InternalServerErrorException('Failed to fetch user favorites');
    }

    return !!favorite;
  }
}
