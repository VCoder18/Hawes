import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { ProfileUpdateDTO } from './dto/update.dto';
import { Profile } from './entities/profiles.entity';
import { ProfilesQueryDto } from './dto/query.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const path = `${userId}-avatar.${ext}`;

    const { error } = await this.supabaseClient.storage
      .from('profiles')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload avatar "${file.originalname}": ${error.message}`, // TODO: delete any successfully uploaded files in this batch, or retry
      );
    }

    const {
      data: { publicUrl },
    } = this.supabaseClient.storage.from('profiles').getPublicUrl(path);

    return publicUrl;
  }

  async uploadBanner(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const path = `${userId}-banner.${ext}`;

    const { error } = await this.supabaseClient.storage
      .from('profiles')
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload banner "${file.originalname}": ${error.message}`, // TODO: delete any successfully uploaded files in this batch, or retry
      );
    }

    const {
      data: { publicUrl },
    } = this.supabaseClient.storage.from('profiles').getPublicUrl(path);

    return publicUrl;
  }

  /// @Return: current user profile
  async getProfile(id: string): Promise<Profile> {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Profile not found');
    }

    return data;
  }

  /// @Return: a user's profile looked up by username
  async getProfileByUsername(query: ProfilesQueryDto): Promise<Profile[]> {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*')
      .textSearch('username', query.username)
      .range(query.offset, query.offset + query.limit);

    if (error || !data) {
      throw new NotFoundException('Profile not found');
    }

    return data;
  }

  /// @Return: current user's updated profile
  async updateProfile(
    id: string,
    profile: ProfileUpdateDTO,
    avatar: Express.Multer.File | undefined,
    banner: Express.Multer.File | undefined,
  ): Promise<Profile> {
    let payload: Database['public']['Tables']['profiles']['Update'] = {
      ...profile,
    };

    if (avatar) {
      payload.avatar_url = await this.uploadAvatar(id, avatar);
    }

    if (banner) {
      payload.banner_url = await this.uploadAvatar(id, banner);
    }

    const { error, data: updatedUser } = await this.supabaseClient
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedUser) {
      console.error(`updateProfile failed for user ${id}: ${error.message}`);
      throw new BadRequestException(`Failed to update profile`);
    }

    return updatedUser;
  }

  /// @Return: the id of the deleted profile
  async deleteProfile(id: string): Promise<string> {
    const { error } = await this.supabaseClient.auth.admin.deleteUser(id);

    if (error) {
      throw new BadRequestException('Failed to delete Profile');
    }

    return id;
  }
}
