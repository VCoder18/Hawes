import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export enum QuerySortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export type QueryFilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'range';

export interface QueryFilter {
  operator: QueryFilterOperator;
  value: string | number | boolean;
}

export class QueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit: number = 20;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0) offset: number = 0;

  @IsOptional() @IsEnum(QuerySortOrder) sortOrder?: QuerySortOrder =
    QuerySortOrder.Descending;

  @IsOptional() @IsString() sortBy: string = 'create_at';

  @IsOptional() @IsString() search?: string;

  @IsOptional() 
  @ValidateIf((o) => o.filters && typeof o.filters === 'object')
  @IsObject() 
  filters?: Record<string, QueryFilter>;
}
