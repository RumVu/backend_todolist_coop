import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DashboardsModule } from './dashboards/dashboards.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    DashboardsModule,
    UsersModule,
    TasksModule,
    ReportsModule,
    SettingsModule,
  ],
})
export class AdminModule {}
