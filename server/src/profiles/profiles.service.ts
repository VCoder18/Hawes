import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';
import { ProfileUpdateDTO } from './dto/update.dto';
import { Profile } from './entities/profiles.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabaseClient: SupabaseClient<Database>,
  ) {}

  /// @Return: current user profile
  async getProfile(id: string): Promise<Profile> {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Profile not found');

    return data;
  }

  /// @Return: current user's updated profile
  async updateProfile(id: string, profile: ProfileUpdateDTO): Promise<Profile> {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .update(profile)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update profile');
    }

    return data;
  }

  /// @Return: the id of the deleted profile
  async deleteProfile(id: string): Promise<string> {
    const { error } = await this.supabaseClient.auth.admin.deleteUser(id);

    if (error) throw new BadRequestException('Failed to delete Profile');

    return id;
  }
}
