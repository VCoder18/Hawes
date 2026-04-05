import { Database } from 'src/database.types';

export type Destination = Database['public']['Tables']['destinations']['Row'];

export type DestinationResponse = Destination & {
	lat: number | null;
	lng: number | null;
};
