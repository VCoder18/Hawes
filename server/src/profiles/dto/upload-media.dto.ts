import { IsIn, IsOptional, IsString } from 'class-validator';

export class ProfileMediaUploadDTO {
  @IsString()
  @IsIn(['avatar', 'banner'])
  kind: 'avatar' | 'banner';

  @IsOptional()
  @IsString()
  fileName?: string;
}
