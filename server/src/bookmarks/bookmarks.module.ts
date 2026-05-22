import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/modules/SupabaseModule';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [SupabaseModule.injectClient()],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
