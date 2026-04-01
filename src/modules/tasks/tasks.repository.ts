import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Task, Prisma } from '@prisma/client';

export type TaskRecord = Task;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<TaskRecord> {
    return this.prisma.task.create({ data });
  }

  async findAllByGroupId(groupId: string): Promise<TaskRecord[]> {
    return this.prisma.task.findMany({
      where: { groupId },
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            members: { select: { userId: true, role: true } }
          }
        }
      }
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<TaskRecord> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
