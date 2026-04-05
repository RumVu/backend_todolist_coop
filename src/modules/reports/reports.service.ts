import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateGroupSummary(groupId: string, authorId: string) {
    const group = await this.prisma.taskGroup.findUnique({
      where: { id: groupId },
      include: {
        _count: { select: { tasks: true, members: true } },
        tasks: true,
      },
    });

    if (!group) throw new NotFoundException('Group not found');

    const completedTasks = group.tasks.filter(
      (t) => t.status === 'DONE',
    ).length;
    const completionRate =
      group._count.tasks > 0 ? (completedTasks / group._count.tasks) * 100 : 0;

    const reportData = {
      groupId,
      groupName: group.name,
      totalTasks: group._count.tasks,
      completedTasks,
      completionRate: `${completionRate.toFixed(2)}%`,
      memberCount: group._count.members,
      generatedAt: new Date(),
    };

    return this.prisma.report.create({
      data: {
        title: `Summary Report: ${group.name}`,
        data: reportData,
        author: { connect: { id: authorId } },
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.report.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Report not found');
    }
  }
}
