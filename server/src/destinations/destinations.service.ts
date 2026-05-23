import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { DestinationsQueryDto } from './dto/query.dto';

@Injectable()
export class DestinationsService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  async getDestinations(userId: string, query: DestinationsQueryDto): Promise<any> {
    // Placeholder implementation
    const { data, error } = await this.supabaseClient
      .from('destinations')
      .select('*')
      .range(query.offset || 0, (query.offset || 0) + (query.limit || 10) - 1);

    if (error) {
      throw new Error(`Failed to fetch destinations: ${error.message}`);
    }

    return data;
  }

  async getDestinationById(id: string): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Destination not found');
    }

    return data;
  }
}
