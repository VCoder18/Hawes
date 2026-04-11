import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Destination } from './entities/destinations.entity';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: all destinations that match the given query
  // TODO: query filters
  async getDestinations(_: QueryDto): Promise<Destination[]> {
    const { data: destinations, error } = await this.supabaseClient
      .from('destinations')
      .select('*');

    if (error || !destinations) {
      throw new NotFoundException('No destinations found');
    }

    return destinations;
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
