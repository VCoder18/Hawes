import { Database } from 'src/database.types';

export type Favorite =
  Database['public']['Tables']['favorite_destinations']['Row'];
