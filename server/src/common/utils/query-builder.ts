// TODO: PROBABLY UNSAFE

import { SupabaseClient } from '@supabase/supabase-js';
import { QueryDto, QuerySortOrder } from '../dto/query.dto';
import { Database } from 'src/database.types';

export interface SupabaseQueryConfig {
  searchFields?: string[];
  allowedFilters?: string[];
  allowedSortFields?: string[];
  defaultSort?: string;
}

export function applySupabaseQuery(
  client: SupabaseClient<Database>,
  table: keyof Database['public']['Tables'],
  query: QueryDto,
  config: SupabaseQueryConfig,
) {
  const {
    searchFields = [],
    allowedFilters = [],
    allowedSortFields = [],
    defaultSort = 'created_at',
  } = config;

  let qb = client.from(table).select('*', { count: 'exact' });

  if (query.search && searchFields.length > 0) {
    const orClause = searchFields
      .map((field) => `${field}.ilike.%${query.search}%`)
      .join(',');
    qb = qb.or(orClause);
  }

  if (query.filters) {
    for (const [key, { operator, value }] of Object.entries(query.filters)) {
      if (allowedFilters.includes(key)) {
        switch (operator) {
          case 'eq':
            qb.eq(key, value);
          case 'gt':
            qb.gt(key, value);
          case 'gte':
            qb.gte(key, value);
          case 'lt':
            qb.lt(key, value);
          case 'lte':
            qb.lte(key, value);
          case 'neq':
            qb.neq(key, value);
          case 'like':
            qb.like(key, value);
        }
      }
    }
  }

  const safeSortBy = allowedSortFields.includes(query.sortBy)
    ? query.sortBy
    : defaultSort;
  qb = qb.order(safeSortBy, {
    ascending: query.sortOrder === QuerySortOrder.Ascending,
  });

  if (query.limit > 20) query.limit = 20;
  qb = qb.range(query.offset, query.offset + query.limit - 1);

  return qb;
}
