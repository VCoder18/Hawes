import { Controller, Get, Param, Query, UsePipes, UseGuards } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { ParseJsonFilterPipe } from 'src/common/pipes/parse-json-filter.pipe';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import type { SupabaseJWTPayload } from 'src/auth/auth.guard';
import { Public } from 'src/auth/auth.guard';

@Controller('destinations')
@UseGuards(AuthGuard)
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  @Public()
  @UsePipes(new ParseJsonFilterPipe())
  getDestinations(
    @Query() query: QueryDto,
    @CurrentUser() user?: SupabaseJWTPayload,
  ) {
    return this.service.getDestinations(query, user?.sub);
  }

  @Get(':tripId')
  getDestinationById(@Param('tripId') tripId: string) {
    return this.service.getDestinationById(tripId);
  }
}
