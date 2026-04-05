import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Task, Prisma } from '../../../prisma/generated-client';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export type TaskRecord = Task;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<TaskRecord> {
    return this.prisma.task.create({ data });
  }

  async findAllByGroupId(
    groupId: string,
    query: PaginationQueryDto,
  ): Promise<[TaskRecord[], number]> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const search = query.search || '';
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      groupId,
      ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return [tasks, total];
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        group: {
          include: {
            members: { select: { userId: true, role: true } },
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<TaskRecord> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
