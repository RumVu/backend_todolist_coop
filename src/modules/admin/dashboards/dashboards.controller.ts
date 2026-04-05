import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardsService } from './dashboards.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../../common/guards/admin.guard';

@ApiTags('Admin Dashboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get global system statistics (Admin only)' })
  getGlobalStats() {
    return this.dashboardsService.getGlobalStats();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent activity logs (Admin only)' })
  getRecentActivity() {
    return this.dashboardsService.getRecentActivity();
  }
}
