import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { getPaginationData } from '../../common/utils/pagination.util';
import { TasksRepository } from './tasks.repository';
import { TasksGroupRepository } from '../tasks_group/tasks_group.repository';
import { UsersRepository } from '../users/users.repository';
import { WebSocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepo: TasksRepository,
    private readonly tasksGroupRepo: TasksGroupRepository,
    private readonly usersRepo: UsersRepository,
    private readonly wsGateway: WebSocketsGateway
  ) {}

  // Kiểm tra user có nằm trong group này không (Owner hoặc Member)
  private async checkGroupAccess(userId: string, groupId: string) {
    const group = await this.tasksGroupRepo.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy danh sách công việc (Group) này');

    const isOwner = group.ownerId === userId;
    const memberObj = group.members.find((m: any) => m.userId === userId);
    
    if (!isOwner && !memberObj) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào danh sách này');
    }
    
    return { group, isOwner, memberObj };
  }

  async create(userId: string, createTaskDto: CreateTaskDto) {
    // 1. Phải là thành viên mới được quyền tạo Task trong Group
    const { group, isOwner, memberObj } = await this.checkGroupAccess(userId, createTaskDto.groupId);

    // Dành riêng cho "viewer": Không được tạo task
    if (!isOwner && memberObj && memberObj.role === 'viewer') {
      throw new ForbiddenException('Tài khoản "Viewer" chỉ được xem, không được tạo Task');
    }

    // Nếu lúc tạo có giao việc luôn (assigneeId)
    if (createTaskDto.assigneeId) {
      if (createTaskDto.assigneeId !== group.ownerId) {
        const targetMember = group.members.find((m: any) => m.userId === createTaskDto.assigneeId);
        if (!targetMember) {
          throw new BadRequestException('Tuyệt vời, nhưng người bạn giao việc KHÔNG có trong bảng danh sách này!');
        }
      }
    }

    const taskData: any = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      priority: createTaskDto.priority,
      group: { connect: { id: createTaskDto.groupId } },
      creator: { connect: { id: userId } }
    };

    if (createTaskDto.assigneeId) {
      taskData.assignee = { connect: { id: createTaskDto.assigneeId } };
    }

    const task = await this.tasksRepo.create(taskData);
    
    // 🔥 Emit websocket event to room (groupId)
    this.wsGateway.server.to(createTaskDto.groupId).emit('taskCreated', task);
    
    return { message: 'Tạo công việc thành công', data: task };
  }

  async findAllByGroup(userId: string, groupId: string, query: PaginationQueryDto) {
    await this.checkGroupAccess(userId, groupId);

    const page = query.page || 1;
    const limit = query.limit || 10;
    
    const [tasks, totalItems] = await this.tasksRepo.findAllByGroupId(groupId, query);
    
    return {
      message: 'Lấy phương thức thành công',
      data: tasks,
      meta: getPaginationData(totalItems, page, limit)
    };
  }

  async findOne(userId: string, id: string) {
    const task = await this.tasksRepo.findById(id);
    if (!task) throw new NotFoundException('Không tìm thấy công việc này');

    await this.checkGroupAccess(userId, task.groupId);

    return { data: task };
  }

  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepo.findById(id);
    if (!task) throw new NotFoundException('Không tìm thấy công việc này');

    const { isOwner, memberObj } = await this.checkGroupAccess(userId, task.groupId);

    if (!isOwner && memberObj && memberObj.role === 'viewer') {
      throw new ForbiddenException('Tài khoản "Viewer" không được sửa Task');
    }

    const updateData: any = { ...updateTaskDto };
    
    // Xoá groupId khỏi data update (KHÔNG ĐƯỢC PHÉP CHUYỂN GROUP TRỰC TIẾP QUA PATCH CODE)
    if (updateData.groupId) delete updateData.groupId;
    
    if (updateData.assigneeId) {
      // Logic gán người làm tương tự create
      if (updateData.assigneeId !== task.group.ownerId) {
        const targetMember = task.group.members.find((m: any) => m.userId === updateData.assigneeId);
        if (!targetMember) {
           throw new BadRequestException('Người bạn chuyển việc KHÔNG có mặt trong Group này!');
        }
      }
      updateData.assignee = { connect: { id: updateData.assigneeId } };
      delete updateData.assigneeId;
    }
    
    if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
    }

    const updatedTask = await this.tasksRepo.update(id, updateData);
    
    // 🔥 Emit websocket event to room
    this.wsGateway.server.to(task.groupId).emit('taskUpdated', updatedTask);
    
    return { message: 'Cập nhật công việc thành công', data: updatedTask };
  }

  async assignTask(userId: string, taskId: string, assignTaskDto: AssignTaskDto) {
      // Shortcut cho chức năng "Gán nhanh"
      return this.update(userId, taskId, { assigneeId: assignTaskDto.assigneeId } as any);
  }

  async remove(userId: string, id: string) {
    const task = await this.tasksRepo.findById(id);
    if (!task) throw new NotFoundException('Không tìm thấy công việc này');

    const { isOwner, memberObj } = await this.checkGroupAccess(userId, task.groupId);

    // Chỉ Admin hoặc Chủ group, HOẶC chính người tạo Task ra mới được xoá
    if (!isOwner && memberObj?.role !== 'admin' && task.creatorId !== userId) {
      throw new ForbiddenException('Chỉ Trưởng/Phó nhóm, hoặc người tạo Task mới được xoá');
    }

    await this.tasksRepo.remove(id);
    
    // 🔥 Emit websocket event to room
    this.wsGateway.server.to(task.groupId).emit('taskDeleted', { taskId: id });

    return { message: 'Xoá công việc thành công' };
  }
}

