import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TaskGroup, Prisma } from '@prisma/client';

export type TaskGroupRecord = TaskGroup;

@Injectable()
export class TasksGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TaskGroupCreateInput): Promise<TaskGroupRecord> {
    return this.prisma.taskGroup.create({ data });
  }

  async findAllByUserId(userId: string): Promise<TaskGroupRecord[]> {
    return this.prisma.taskGroup.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          select: {
            role: true,
            joinedAt: true,
            user: { select: { id: true, name: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.taskGroup.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { select: { userId: true, role: true } }
      }
    });
  }

  async addMember(groupId: string, userId: string, role: string) {
    return this.prisma.groupMember.create({
      data: { groupId, userId, role }
    });
  }

  async update(id: string, data: Prisma.TaskGroupUpdateInput): Promise<TaskGroupRecord> {
    return this.prisma.taskGroup.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.taskGroup.delete({ where: { id } });
  }

  async getMember(groupId: string, userId: string): Promise<any | null> {
      return this.prisma.groupMember.findUnique({
          where: { groupId_userId: { groupId, userId } }
      });
  }

  async updateMemberRole(groupId: string, userId: string, role: string) {
    return this.prisma.groupMember.update({
      where: { groupId_userId: { groupId, userId } },
      data: { role }
    });
  }

  async removeMember(groupId: string, userId: string) {
    return this.prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } }
    });
  }
}
