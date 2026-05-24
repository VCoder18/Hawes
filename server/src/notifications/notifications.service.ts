import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';

export type NotificationRow = Database['public']['Tables']['notifications']['Row'];

@Injectable()
export class NotificationsService {
  constructor(private readonly supabaseClient: SupabaseClient<Database>) {}

  async getNotifications(
    userId: string,
    unreadOnly = false,
    limit = 20,
    offset = 0,
  ): Promise<NotificationRow[]> {
    let query = this.supabaseClient
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }

    return (data ?? []) as NotificationRow[];
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabaseClient
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }

    return count ?? 0;
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  async createNotification(
    userId: string,
    type: string,
    title: string,
    body?: string,
    data?: Record<string, unknown>,
  ): Promise<NotificationRow | null> {
    const { data: notification, error } = await this.supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        body: body ?? null,
        data: data ? JSON.stringify(data) : null,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Failed to create notification:', error);
      return null;
    }

    return notification as NotificationRow;
  }
}
