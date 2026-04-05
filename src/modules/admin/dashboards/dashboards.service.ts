import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const [userCount, taskCount, groupCount, statusStats, priorityStats] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.task.count(),
        this.prisma.taskGroup.count(),
        this.prisma.task.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),
        this.prisma.task.groupBy({
          by: ['priority'],
          _count: { _all: true },
        }),
      ]);

    return {
      overview: {
        totalUsers: userCount,
        totalTasks: taskCount,
        totalGroups: groupCount,
      },
      distribution: {
        status: statusStats.reduce(
          (acc, curr) => ({ ...acc, [curr.status]: curr._count._all }),
          {},
        ),
        priority: priorityStats.reduce(
          (acc, curr) => ({ ...acc, [curr.priority]: curr._count._all }),
          {},
        ),
      },
    };
  }

  async getRecentActivity() {
    const [recentTasks, recentUsers] = await Promise.all([
      this.prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { name: true } } },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { name: true, email: true, createdAt: true },
      }),
    ]);

    return {
      recentTasks,
      recentUsers,
    };
  }
}
