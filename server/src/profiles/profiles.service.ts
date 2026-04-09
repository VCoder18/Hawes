import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { ProfileUpdateDTO } from './dto/update.dto';
import { Profile } from './entities/profiles.entity';
import { ProfileMediaUploadDTO } from './dto/upload-media.dto';

const DEFAULT_PROFILE_MEDIA_BUCKET = 'profiles';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type ProfileWithSocialLinks = ProfileRow & { social_links: string[] | null };

interface UploadedMediaFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  private sanitizePathSegment(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  }

  private fileExtensionFromContentType(contentType: string): string {
    switch (contentType) {
      case 'image/png':
        return 'png';
      case 'image/jpg':
      case 'image/jpeg':
        return 'jpg';
      case 'image/webp':
        return 'webp';
      default:
        return 'bin';
    }
  }

  private normalizeSocialLinks(links?: string[] | null): string[] {
    const normalized = new Array<string>(6).fill('');
    if (!Array.isArray(links)) {
      return normalized;
    }

    for (let i = 0; i < 6; i += 1) {
      normalized[i] = (links[i] ?? '').trim();
    }

    return normalized;
  }

  private toSocialLinks(profile: ProfileRow): string[] | null {
    const links = this.normalizeSocialLinks((profile as any).social_links);
    return links;
  }

  private withSocialLinks(profile: ProfileRow): ProfileWithSocialLinks {
    return {
      ...profile,
      social_links: this.toSocialLinks(profile),
    };
  }

  private toProfileUpdatePayload(profile: ProfileUpdateDTO): ProfileUpdate {
    const { social_links, ...rest } = profile;
    const payload: ProfileUpdate = {
      ...(rest as ProfileUpdate),
    };

    if (social_links !== undefined) {
      payload.social_links = this.normalizeSocialLinks(social_links);
    }

    return payload;
  }

  /// @Return: current user profile
  async getProfile(id: string): Promise<ProfileWithSocialLinks> {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Profile not found');

    return this.withSocialLinks(data);
  }

  /// @Return: a user's profile looked up by username
  async getProfileByUsername(username: string): Promise<ProfileWithSocialLinks> {
    const normalizedUsername = username.trim().toLowerCase();

    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*')
      .eq('username', normalizedUsername)
      .single();

    if (error || !data) throw new NotFoundException('Profile not found');

    return this.withSocialLinks(data);
  }

  /// @Return: current user's updated profile
  async updateProfile(id: string, profile: ProfileUpdateDTO): Promise<ProfileWithSocialLinks> {
    this.logger.log(`updateProfile called for user ${id}`);
    const payload = this.toProfileUpdatePayload(profile);

    this.logger.debug(
      `updateProfile payload keys: ${Object.keys(payload).join(', ') || 'none'}`,
    );

    const { data, error } = await this.supabaseClient
      .from('profiles')
      // Supabase generated types can resolve update input as never in this setup.
      // Cast keeps runtime behavior correct while preserving mapped payload fields.
      .update(payload as never)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      this.logger.error(
        `updateProfile failed for user ${id}: ${error?.message ?? 'No data returned'}`,
      );
      throw new BadRequestException(
        `Failed to update profile: ${error?.message ?? 'Unknown error'}`,
      );
    }

    this.logger.log(`updateProfile succeeded for user ${id}`);

    return this.withSocialLinks(data);
  }

  async uploadProfileMedia(
    userId: string,
    media: ProfileMediaUploadDTO,
    file?: UploadedMediaFile,
  ): Promise<{ publicUrl: string; path: string }> {
    this.logger.log(
      `uploadProfileMedia called for user ${userId}, kind=${media?.kind ?? 'unknown'}`,
    );

    if (!file) {
      this.logger.error(`uploadProfileMedia missing file for user ${userId}`);
      throw new BadRequestException('File is required');
    }

    const bucketName = process.env.SUPABASE_PROFILE_MEDIA_BUCKET ?? DEFAULT_PROFILE_MEDIA_BUCKET;
    const contentType = file.mimetype || 'application/octet-stream';
    const extension = this.fileExtensionFromContentType(contentType);
    const originalName = media.fileName ?? file.originalname ?? media.kind;
    const safeUserId = this.sanitizePathSegment(userId);
    const baseName = media.kind === 'avatar' ? 'pfp' : 'banner';
    const filePath = `${safeUserId}/${baseName}.${extension}`;

    const { error: uploadError } = await this.supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      const isMimeRestricted = /mime type/i.test(uploadError.message);
      if (isMimeRestricted && contentType !== 'application/octet-stream') {
        const { error: retryError } = await this.supabaseClient.storage
          .from(bucketName)
          .upload(filePath, file.buffer, {
            contentType: 'application/octet-stream',
            upsert: true,
          });

        if (retryError) {
          this.logger.error(
            `uploadProfileMedia failed for user ${userId} in bucket ${bucketName}: ${retryError.message}`,
          );
          throw new BadRequestException(`Failed to upload profile media: ${retryError.message}`);
        }
      } else {
        this.logger.error(
          `uploadProfileMedia failed for user ${userId} in bucket ${bucketName}: ${uploadError.message}`,
        );
        throw new BadRequestException(`Failed to upload profile media: ${uploadError.message}`);
      }
    }

    const { data } = this.supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log(`[ProfilesService] getPublicUrl called - Bucket: ${bucketName}, Path: ${filePath}`);
    console.log(`[ProfilesService] Generated URL: ${data?.publicUrl}`);

    if (!data?.publicUrl) {
      this.logger.error(
        `uploadProfileMedia public URL resolution failed for user ${userId}, path=${filePath}`,
      );
      throw new InternalServerErrorException(
        'Failed to resolve uploaded media URL',
      );
    }

    this.logger.log(`uploadProfileMedia succeeded for user ${userId}`);
    this.logger.log(`Generated public URL: ${data.publicUrl}`);
    this.logger.log(`Bucket: ${bucketName}, Path: ${filePath}`);

    return {
      publicUrl: `${data.publicUrl}?v=${Date.now()}`,
      path: filePath,
    };
  }

  /// @Return: the id of the deleted profile
  async deleteProfile(id: string): Promise<string> {
    const { error } = await this.supabaseClient.auth.admin.deleteUser(id);

    if (error) throw new BadRequestException('Failed to delete Profile');

    return id;
  }
}
