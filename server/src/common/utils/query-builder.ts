// TODO: PROBABLY UNSAFE

import { SupabaseClient } from '@supabase/supabase-js';
import { QueryDto, QuerySortOrder } from '../dto/query.dto';
import { Database } from 'src/database.types';

export interface SupabaseQueryConfig {
  searchFields?: string[];
  allowedFilters?: string[];
  allowedSortFields?: string[];
  defaultSort?: string;
  // Custom filter handlers for complex operations (arrays, dates, etc.)
  customFilters?: {
    [filterName: string]: (
      queryBuilder: any,
      value: string | number | boolean,
    ) => any;
  };
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
    customFilters = {},
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
        // Check if there's a custom filter handler for this field
        if (customFilters[key]) {
          qb = customFilters[key](qb, value);
        } else {
          // Fall back to standard operators
          switch (operator) {
            case 'eq':
              qb = qb.eq(key, value);
              break;
            case 'gt':
              qb = qb.gt(key, value);
              break;
            case 'gte':
              qb = qb.gte(key, value);
              break;
            case 'lt':
              qb = qb.lt(key, value);
              break;
            case 'lte':
              qb = qb.lte(key, value);
              break;
            case 'neq':
              qb = qb.neq(key, value);
              break;
            case 'like':
              qb = qb.like(key, String(value));
              break;
            case 'range':
              // Handle range filter: "min:max"
              const [min, max] = String(value).split(':').map(Number);
              qb = qb.gte(key, min).lte(key, max);
              break;
          }
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
