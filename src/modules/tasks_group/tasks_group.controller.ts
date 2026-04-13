import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksGroupService } from './tasks_group.service';
import { CreateTasksGroupDto } from './dto/create-tasks_group.dto';
import { UpdateTasksGroupDto } from './dto/update-tasks_group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Task Groups (Workspaces)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['tasks-group', 'task-groups'])
export class TasksGroupController {
  constructor(private readonly tasksGroupService: TasksGroupService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh sách công việc mới (Trở thành Owner)' })
  create(
    @CurrentUser('userId') userId: string,
    @Body() createTasksGroupDto: CreateTasksGroupDto,
  ) {
    return this.tasksGroupService.create(userId, createTasksGroupDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy các danh sách công việc mà mình sở hữu hoặc tham gia',
  })
  findAll(@CurrentUser('userId') userId: string) {
    return this.tasksGroupService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 danh sách công việc' })
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksGroupService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật tên/mô tả danh sách (Cần quyền Owner/Admin)',
  })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() updateTasksGroupDto: UpdateTasksGroupDto,
  ) {
    return this.tasksGroupService.update(userId, id, updateTasksGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá danh sách công việc (Chỉ Owner)' })
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksGroupService.remove(userId, id);
  }

  @Post(':id/members')
  @ApiOperation({
    summary: 'Mời thành viên khác vào danh sách này (Chỉ Owner)',
  })
  addMember(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.tasksGroupService.addMember(userId, id, addMemberDto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({
    summary: 'Kích thành viên khỏi dự án/nhóm (Chỉ Owner & Admin)',
  })
  kickMember(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.tasksGroupService.kickMember(userId, id, memberId);
  }

  @Patch(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Phong chức/Giáng chức thành viên (Chỉ Owner)' })
  updateMemberRole(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body('role') role: string,
  ) {
    return this.tasksGroupService.updateMemberRole(userId, id, memberId, role);
  }
}
