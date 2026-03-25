import { QueryDto } from './query.dto';

export class PaginatedResponseDto<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;

  constructor(data: T[], total: number, limit: number, offset: number) {
    this.data = data;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
    this.hasMore = offset + limit < total;
  }
}

export function paginatedResponse<T>(
  data: T[],
  count: number,
  query: QueryDto,
): PaginatedResponseDto<T> {
  return new PaginatedResponseDto(data, count, query.limit, query.offset);
}
