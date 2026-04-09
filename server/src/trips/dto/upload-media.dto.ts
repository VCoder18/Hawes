import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class TripMediaUploadDTO {
  @IsUUID()
  tripId: string;

  @IsString()
  @IsIn(['covers', 'images', 'documents'])
  folder: 'covers' | 'images' | 'documents';

  @IsOptional()
  @IsString()
  fileName?: string;
}
