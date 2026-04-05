import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

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

  async remove(id: string) {
    try {
      return await this.prisma.report.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Report not found');
    }
  }

  async update(id: string, updateReportDto: any) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
    });
  }
}
