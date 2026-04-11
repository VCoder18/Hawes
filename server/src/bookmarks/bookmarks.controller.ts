import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './bookmark.entity';

@Controller('bookmarks')
@UseGuards(AuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  async getUserBookmarks(
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<Bookmark[]> {
    return this.bookmarksService.getUserBookmarks(user.sub);
  }

  @Get(':tripId')
  async isBookmarked(
    @Param('tripId') tripId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<boolean> {
    return await this.bookmarksService.isBookmarked(user.sub, tripId);
  }

  @Post(':tripId')
  async addBookmark(
    @Param('tripId') tripId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<Bookmark> {
    return this.bookmarksService.addBookmark(user.sub, tripId);
  }

  @Delete(':tripId')
  @HttpCode(204)
  async removeBookmark(
    @Param('tripId') tripId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ): Promise<string> {
    return this.bookmarksService.removeBookmark(user.sub, tripId);
  }
}
