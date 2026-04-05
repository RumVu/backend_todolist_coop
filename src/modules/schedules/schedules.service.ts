import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '../../../prisma/generated-client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: CreateScheduleDto) {
    return this.prisma.schedule.create({
      data: {
        taskId: data.taskId,
        remindAt: new Date(data.remindAt),
        type: data.type || 'EMAIL',
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const pendingSchedules = await this.prisma.schedule.findMany({
      where: {
        remindAt: { lte: now },
        isProcessed: false,
      },
      include: {
        task: {
          include: {
            creator: { select: { email: true, name: true } },
            assignee: { select: { email: true, name: true } },
          },
        },
      },
    });

    for (const schedule of pendingSchedules) {
      const recipient = schedule.task.assignee || schedule.task.creator;
      if (recipient) {
        await this.notificationsService.queueEmail(
          recipient.email,
          `Reminder: ${schedule.task.title}`,
          `This is a scheduled reminder for task: ${schedule.task.title}. Due date: ${schedule.task.dueDate ? schedule.task.dueDate.toISOString() : 'N/A'}`,
        );

        await this.prisma.schedule.update({
          where: { id: schedule.id },
          data: { isProcessed: true },
        });
      }
    }
  }

  async findAll() {
    return this.prisma.schedule.findMany({
      include: { task: { select: { title: true } } },
      orderBy: { remindAt: 'asc' },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.schedule.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Schedule not found');
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');

    const updateData: Prisma.ScheduleUpdateInput = {
      ...updateScheduleDto,
      ...(updateScheduleDto.remindAt && {
        remindAt: new Date(updateScheduleDto.remindAt),
      }),
    };

    return this.prisma.schedule.update({
      where: { id },
      data: updateData,
    });
  }
}
