import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Destination } from './entities/destinations.entity';

@Injectable()
export class DestinationsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: all destinations
  async getDestinations(): Promise<Array<Destination>> {
    const { data, error } = await this.supabaseClient
      .from('destinations')
      .select('*');
    if (error || !data) {
      throw new InternalServerErrorException(
        "Can't fetch destinations at the instant",
      );
    }
    return data;
  }

  /// @Return: the destination with the given id
  async getDestinationById(id: string): Promise<Destination> {
    const { data: destination, error } = await this.supabaseClient
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !destination) {
      throw new NotFoundException('destination not found');
    }
    return destination;
  }
}
