import { Database } from 'src/database.types';

export type TripUpdateDTO = Omit<
  Database['public']['Tables']['trips']['Update'],
  'id'
>;
