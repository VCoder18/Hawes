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

@Controller('bookmarks')
@UseGuards(AuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post(':tripId')
  async addBookmark(
    @Param('tripId') tripId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.bookmarksService.addBookmark(user.sub, tripId);
  }

  @Delete(':tripId')
  @HttpCode(204)
  async removeBookmark(
    @Param('tripId') tripId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.bookmarksService.removeBookmark(user.sub, tripId);
  }

  @Get()
  async getUserBookmarks(@CurrentUser() user: SupabaseJWTPayload) {
    const bookmarks = await this.bookmarksService.getUserBookmarks(user.sub);
    return { bookmarks };
  }

  @Get(':tripId')
  async isBookmarked(
    @Param('tripId') tripId: string,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    const isBookmarked = await this.bookmarksService.isBookmarked(user.sub, tripId);
    return { isBookmarked };
  }
}
