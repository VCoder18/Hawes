import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { NotificationsService, type NotificationRow } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @CurrentUser() user: SupabaseJWTPayload,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<NotificationRow[]> {
    return this.notificationsService.getNotifications(
      user.sub,
      unreadOnly === 'true',
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Get('unread-count')
  async getUnreadCount(
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(user.sub);
    return { count };
  }

  @Patch(':id')
  async markAsRead(
    @CurrentUser() user: SupabaseJWTPayload,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    await this.notificationsService.markAsRead(user.sub, id);
    return { success: true };
  }

  @Post('read-all')
  async markAllAsRead(
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<{ success: boolean }> {
    await this.notificationsService.markAllAsRead(user.sub);
    return { success: true };
  }
}
