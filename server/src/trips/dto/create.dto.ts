import { Trip } from '../trip.service';

export class CreateTripDTO implements Trip {
  constructor(
    public id: number,
    public author: string,
    public title: string,
    public content: string | null,
    public from: unknown,
    public to: unknown,
    public created_at: string,
  ) {}
}
