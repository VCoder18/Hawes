import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { DashboardQueryDto } from './dto/query.dto';
import { Trip } from 'src/trips/entities/trips.entity';
import { TripsQueryDto } from 'src/trips/dto/query.dto';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getTrips(
    @CurrentUser() user: SupabaseJWTPayload,
    @Query() query: DashboardQueryDto,
  ): Promise<Trip[]> {
    return this.dashboardService.getUserTrips(user.sub, query);
  }

  @Get('history')
  getHisotry(
    @CurrentUser() user: SupabaseJWTPayload,
    @Query() query: TripsQueryDto,
  ): Promise<Trip[]> {
    return this.dashboardService.getUserHistory(user.sub, query);
  }
}
