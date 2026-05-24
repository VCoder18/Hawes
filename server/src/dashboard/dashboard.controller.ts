import { AuthGuard, type SupabaseJWTPayload } from 'src/auth/auth.guard';
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { DashboardQueryDto } from './dto/query.dto';
import { TripsQueryDto } from 'src/trips/dto/query.dto';
import { Trip } from 'src/trips/entities/trips.entity';

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
  getHistory(
    @CurrentUser() user: SupabaseJWTPayload,
    @Query() query: TripsQueryDto,
  ): Promise<Trip[]> {
    return this.dashboardService.getUserHistory(user.sub, query);
  }

  @Get('business-stats')
  getBusinessStats(@CurrentUser() user: SupabaseJWTPayload) {
    return this.dashboardService.getBusinessStats(user.sub);
  }

  @Get('associated-trips')
  getAssociatedTrips(
    @CurrentUser() user: SupabaseJWTPayload,
    @Query() query: TripsQueryDto,
  ): Promise<Trip[]> {
    return this.dashboardService.getAssociatedTrips(user.sub, query);
  }

  @Get('revenue-chart')
  getRevenueChart(@CurrentUser() user: SupabaseJWTPayload) {
    return this.dashboardService.getRevenueChart(user.sub);
  }

  @Get('clients')
  getClients(@CurrentUser() user: SupabaseJWTPayload) {
    return this.dashboardService.getClientsForOrganizer(user.sub);
  }

  @Get('clients/debug')
  getClientsDebug(@CurrentUser() user: SupabaseJWTPayload) {
    return this.dashboardService.getClientsForOrganizerDebug(user.sub);
  }

  @Patch('services/:id/limit')
  updateServiceLimit(
    @Param('id', ParseIntPipe) id: number,
    @Body('client_limit') clientLimit: number,
    @CurrentUser() user: SupabaseJWTPayload,
  ) {
    return this.dashboardService.updateServiceLimit(user.sub, id, clientLimit);
  }
}
