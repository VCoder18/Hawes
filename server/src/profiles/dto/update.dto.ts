import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/profiles.entity';

export class ProfileUpdateDTO {
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
  @IsUrl({}, { each: true })
  social_links?: string[] | null;
}
