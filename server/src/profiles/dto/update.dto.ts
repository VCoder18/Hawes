import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  ArrayMinSize,
  ArrayMaxSize,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/profiles.entity';

export class ProfileUpdateDTO {
  @IsOptional()
  @IsUrl()
  avatar_url?: string | null;

  @IsOptional()
  @IsUrl()
  banner_url?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  bio?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  display_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^[a-z0-9_]+$/, {
    message: 'Username can only contain lowercase letters, numbers, and underscores',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  location?: string | null;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole | null;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  @Matches(/^$|^https?:\/\/\S+$/i, {
    each: true,
    message: 'Each social link must be empty or a valid http/https URL',
  })
  social_links?: string[] | null;
}
