import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  MaxLength,
  MinLength,
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
