import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { Destination } from './entities/destinations.entity';
import {
  paginatedResponse,
  PaginatedResponseDto,
} from 'src/common/dto/paginated-response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { applySupabaseQuery } from 'src/common/utils/query-builder';

@Injectable()
export class DestinationsService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: all destinations
  async getDestinations(
    query: QueryDto,
  ): Promise<PaginatedResponseDto<Destination>> {
    const { data, error, count } = await applySupabaseQuery(
      this.supabaseClient,
      'destinations',
      query,
      {
        searchFields: ['name', 'description', 'city', 'region'],
        allowedFilters: ['category', 'region', 'city'],
        allowedSortFields: [
          'name',
          'created_at',
          'updated_at',
          'city',
          'region',
        ],
        defaultSort: 'created_at',
      },
    );

    if (error || !data || count === null) {
      throw new InternalServerErrorException(
        "Can't fetch destinations at the instant",
      );
    }

    return paginatedResponse<Destination>(data as Destination[], count, query);
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
