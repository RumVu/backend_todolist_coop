import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { getPaginationData } from '../../common/utils/pagination.util';
import { Prisma } from '../../../prisma/generated-client';
import { TasksRepository } from './tasks.repository';
import {
  GroupMemberRecord,
  TasksGroupRepository,
} from '../tasks_group/tasks_group.repository';
import { UsersRepository } from '../users/users.repository';
import { WebSocketsGateway } from '../websockets/websockets.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepo: TasksRepository,
    private readonly tasksGroupRepo: TasksGroupRepository,
    private readonly usersRepo: UsersRepository,
    private readonly wsGateway: WebSocketsGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async checkGroupAccess(userId: string, groupId: string) {
    const group = await this.tasksGroupRepo.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    const isOwner = group.ownerId === userId;
    const memberObj = group.members.find(
      (member: GroupMemberRecord) => member.userId === userId,
    );

    if (!isOwner && !memberObj) {
      throw new ForbiddenException('Access denied');
    }

    return { group, isOwner, memberObj };
  }

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const { isOwner, memberObj } = await this.checkGroupAccess(
      userId,
      createTaskDto.groupId,
    );

    if (!isOwner && memberObj?.role === 'viewer') {
      throw new ForbiddenException('Viewers cannot create tasks');
    }

    const taskData: Prisma.TaskCreateInput = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
      priority: createTaskDto.priority,
      status: createTaskDto.status,
      group: { connect: { id: createTaskDto.groupId } },
      creator: { connect: { id: userId } },
      ...(createTaskDto.assigneeId
        ? { assignee: { connect: { id: createTaskDto.assigneeId } } }
        : {}),
    };

    const task = await this.tasksRepo.create(taskData);
    this.wsGateway.server.to(createTaskDto.groupId).emit('taskCreated', task);

    // Notify assignee
    if (createTaskDto.assigneeId) {
      const assignee = await this.usersRepo.findById(createTaskDto.assigneeId);
      if (assignee?.email) {
        await this.notificationsService.queueEmail(
          assignee.email,
          'New Task Assigned',
          `You have been assigned to: ${task.title}`,
        );
      }
    }

    return { message: 'Task created successfully', data: task };
  }

  async findAllByGroup(
    userId: string,
    groupId: string,
    query: PaginationQueryDto,
  ) {
    await this.checkGroupAccess(userId, groupId);
    const [tasks, totalItems] = await this.tasksRepo.findAllByGroupId(
      groupId,
      query,
    );
    return {
      data: tasks,
      meta: getPaginationData(totalItems, query.page || 1, query.limit || 10),
    };
  }

  async findOne(userId: string, id: string) {
    const task = await this.tasksRepo.findById(id);
    if (!task) throw new NotFoundException('Task not found');
    await this.checkGroupAccess(userId, task.groupId);
    return { data: task };
  }

  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepo.findById(id);
    if (!task) throw new NotFoundException('Task not found');

    const { isOwner, memberObj } = await this.checkGroupAccess(
      userId,
      task.groupId,
    );
    if (!isOwner && memberObj?.role === 'viewer') {
      throw new ForbiddenException('Viewers cannot edit tasks');
    }

    const updateData: Prisma.TaskUpdateInput = { ...updateTaskDto };
    if (updateTaskDto.dueDate) {
      updateData.dueDate = new Date(updateTaskDto.dueDate);
    }

    const updatedTask = await this.tasksRepo.update(id, updateData);
    this.wsGateway.server.to(task.groupId).emit('taskUpdated', updatedTask);

    // Notify if completed
    if (
      String(updateTaskDto.status) === 'DONE' &&
      String(task.status) !== 'DONE'
    ) {
      const creator = await this.usersRepo.findById(task.creatorId);
      if (creator?.email) {
        await this.notificationsService.queueEmail(
          creator.email,
          'Task Completed',
          `Task "${task.title}" has been marked as DONE.`,
        );
      }
    }

    return { message: 'Task updated successfully', data: updatedTask };
  }

  async assignTask(
    userId: string,
    taskId: string,
    assignTaskDto: AssignTaskDto,
  ) {
    return this.update(userId, taskId, {
      assigneeId: assignTaskDto.assigneeId,
    });
  }

  async remove(userId: string, id: string) {
    const task = await this.tasksRepo.findById(id);
    if (!task) throw new NotFoundException('Task not found');

    const { isOwner, memberObj } = await this.checkGroupAccess(
      userId,
      task.groupId,
    );
    if (!isOwner && memberObj?.role !== 'admin' && task.creatorId !== userId) {
      throw new ForbiddenException('Unauthorized to delete task');
    }

    await this.tasksRepo.remove(id);
    this.wsGateway.server.to(task.groupId).emit('taskDeleted', { taskId: id });
    return { message: 'Task deleted successfully' };
  }
}
