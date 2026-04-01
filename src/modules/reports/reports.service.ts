import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const totalGroups = await this.prisma.taskGroup.count();
    const totalTasks = await this.prisma.task.count();
    const completedTasks = await this.prisma.task.count({ where: { status: 'DONE' } });

    return {
      totalUsers,
      totalGroups,
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  }
}
