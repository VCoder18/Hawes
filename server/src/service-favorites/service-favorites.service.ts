import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ServiceFavorite } from './service-favorite.entity';

@Injectable()
export class ServiceFavoritesService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<any>,
  ) {}

  async getUserFavorites(userId: string): Promise<ServiceFavorite[]> {
    const { error, data: favorites } = await this.supabaseClient
      .from('favorite_services')
      .select('*')
      .eq('user_id', userId);

    if (error || !favorites) {
      console.error(`Failed to fetch user service favorites: ${error}`);
      throw new InternalServerErrorException('Failed to fetch user service favorites');
    }

    return favorites;
  }

  async isFavorited(userId: string, serviceId: number): Promise<boolean> {
    const { error, data: existingData } = await this.supabaseClient
      .from('favorite_services')
      .select('*')
      .eq('user_id', userId)
      .eq('service_id', serviceId);

    if (error || !existingData) {
      console.error(`Failed to fetch service favorite: ${error}`);
      throw new InternalServerErrorException('Failed to fetch service favorite');
    }

    return existingData.length > 0;
  }

  async addFavorite(userId: string, serviceId: number): Promise<ServiceFavorite> {
    const { error: fetchError, data: existingData } = await this.supabaseClient
      .from('favorite_services')
      .select('*')
      .eq('user_id', userId)
      .eq('service_id', serviceId);

    if (fetchError || !existingData) {
      console.error(`Failed to fetch service favorites: ${fetchError}`);
      throw new InternalServerErrorException('Failed to fetch service favorites');
    }

    if (existingData.length > 0) {
      throw new ConflictException('You already have this service in your favorites');
    }

    const { error, data: favorite } = await this.supabaseClient
      .from('favorite_services')
      .insert({ user_id: userId, service_id: serviceId })
      .select('*')
      .single();

    if (error || !favorite) {
      console.error(`Failed to add service favorite: ${error}`);
      throw new InternalServerErrorException('Failed to add service favorite');
    }

    return favorite;
  }

  async removeFavorite(userId: string, serviceId: number): Promise<string> {
    const { error } = await this.supabaseClient
      .from('favorite_services')
      .delete()
      .eq('user_id', userId)
      .eq('service_id', serviceId);

    if (error) {
      throw new NotFoundException("You don't have this service in your favorites");
    }

    return String(serviceId);
  }
}
