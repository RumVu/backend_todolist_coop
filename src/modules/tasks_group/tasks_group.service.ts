import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTasksGroupDto } from './dto/create-tasks_group.dto';
import { UpdateTasksGroupDto } from './dto/update-tasks_group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { TasksGroupRepository } from './tasks_group.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class TasksGroupService {
  constructor(
    private readonly tasksGroupRepo: TasksGroupRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async create(userId: string, createTasksGroupDto: CreateTasksGroupDto) {
    const group = await this.tasksGroupRepo.create({
      name: createTasksGroupDto.name,
      description: createTasksGroupDto.description,
      owner: { connect: { id: userId } },
    });
    return {
      message: 'Tạo danh sách công việc thành công',
      data: group,
    };
  }

  async findAll(userId: string) {
    const groups = await this.tasksGroupRepo.findAllByUserId(userId);
    return {
      message: 'Lấy danh sách Workspace thành công',
      data: groups,
    };
  }

  async findOne(userId: string, id: string) {
    const group = await this.tasksGroupRepo.findById(id);
    if (!group)
      throw new NotFoundException('Không tìm thấy danh sách công việc này');

    // Chặn người ngoài xem Group (Chỉ owner và member)
    const isOwner = group.ownerId === userId;
    const isMember = group.members.some((m) => m.userId === userId);
    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào danh sách này',
      );
    }

    return { data: group };
  }

  async update(
    userId: string,
    id: string,
    updateTasksGroupDto: UpdateTasksGroupDto,
  ) {
    const group = await this.tasksGroupRepo.findById(id);
    if (!group)
      throw new NotFoundException('Không tìm thấy danh sách công việc');

    // Yêu cầu quyền Owner hoặc Admin để Edit Group Info
    const isOwner = group.ownerId === userId;
    const memberObj = group.members.find((m) => m.userId === userId);
    const isAdmin = memberObj && memberObj.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Chỉ Trưởng nhóm mới có quyền đổi tên danh sách',
      );
    }

    const updated = await this.tasksGroupRepo.update(id, updateTasksGroupDto);
    return { message: 'Cập nhật thành công', data: updated };
  }

  async remove(userId: string, id: string) {
    const group = await this.tasksGroupRepo.findById(id);
    if (!group)
      throw new NotFoundException('Không tìm thấy danh sách công việc');

    // Chỉ Owner mới xoá được toàn bộ không gian chung
    if (group.ownerId !== userId) {
      throw new ForbiddenException(
        'Chỉ Trưởng nhóm (Owner) mới có quyền xoá tàn dư',
      );
    }

    await this.tasksGroupRepo.remove(id);
    return { message: 'Xoá danh sách thành công' };
  }

  async addMember(
    ownerId: string,
    groupId: string,
    addMemberDto: AddMemberDto,
  ) {
    const group = await this.tasksGroupRepo.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy Group');

    if (group.ownerId !== ownerId) {
      throw new ForbiddenException('Chỉ Owner mới có quyền mời người vào nhóm');
    }

    const targetUser = await this.usersRepo.findByEmail(addMemberDto.email);
    if (!targetUser) {
      throw new NotFoundException(
        `Nhanh trí kêu email ${addMemberDto.email} đi đăng ký tài khoản trước!`,
      );
    }

    if (targetUser.id === ownerId) {
      throw new BadRequestException(
        'Bạn đang là chủ xị rồi, tự mời mình làm gì?',
      );
    }

    const existingMember = await this.tasksGroupRepo.getMember(
      groupId,
      targetUser.id,
    );
    if (existingMember) {
      throw new BadRequestException('Thành viên này đã có trong nhóm rồi');
    }

    await this.tasksGroupRepo.addMember(
      groupId,
      targetUser.id,
      addMemberDto.role,
    );
    return { message: `Đã bê ${targetUser.name} vào chung mâm!` };
  }

  async kickMember(requesterId: string, groupId: string, targetUserId: string) {
    const group = await this.tasksGroupRepo.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy Group');

    // Owner có quyền tối cao
    const isOwner = group.ownerId === requesterId;

    // Tìm rank của ông requester
    const requesterMember = group.members.find((m) => m.userId === requesterId);
    const isRequesterAdmin = requesterMember?.role === 'admin';

    // Ai có thể bị kick?
    const targetMember = group.members.find((m) => m.userId === targetUserId);
    if (!targetMember)
      throw new NotFoundException('Người này không có mặt trong mâm');

    if (group.ownerId === targetUserId) {
      throw new ForbiddenException(
        'Không thể đá Owner ra khỏi Group do họ tạo!',
      );
    }

    if (isRequesterAdmin && targetMember.role === 'admin') {
      throw new ForbiddenException(
        'Admin không thể đá cẳng một Admin khác, chỉ Owner mới được làm điều này',
      );
    }

    if (!isOwner && !isRequesterAdmin) {
      throw new ForbiddenException(
        'Bạn không có quyền đuổi người, vui lòng nhờ Admin hoặc Owner',
      );
    }

    await this.tasksGroupRepo.removeMember(groupId, targetUserId);
    return { message: 'Đã sút thành công thành viên đục nước béo cò này' };
  }

  async updateMemberRole(
    requesterId: string,
    groupId: string,
    targetUserId: string,
    newRole: string,
  ) {
    const group = await this.tasksGroupRepo.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy Group');

    const isOwner = group.ownerId === requesterId;

    if (!isOwner) {
      throw new ForbiddenException(
        'Chỉ Owner quyền lực tuyệt đối mới được phong tước hoặc giáng chức người khác',
      );
    }

    if (group.ownerId === targetUserId) {
      throw new BadRequestException(
        'Owner nghiễm nhiên có quyền siêu cao, khỏi cần set lại role',
      );
    }

    const targetMember = await this.tasksGroupRepo.getMember(
      groupId,
      targetUserId,
    );
    if (!targetMember)
      throw new NotFoundException('Người này không nằm trong đội');

    await this.tasksGroupRepo.updateMemberRole(groupId, targetUserId, newRole);
    return { message: `Đã cập nhật tước vị thành ${newRole} thành công` };
  }
}
