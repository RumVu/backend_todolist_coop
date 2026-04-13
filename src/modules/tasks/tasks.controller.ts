import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo công việc mới trong 1 Group' })
  create(
    @CurrentUser('userId') userId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(userId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ công việc theo Group' })
  @ApiQuery({
    name: 'groupId',
    required: true,
    description: 'ID của Workspace/Group',
  })
  findAllByGroup(
    @CurrentUser('userId') userId: string,
    @Query() query: FindTasksQueryDto,
  ) {
    const groupId = query.resolvedGroupId;
    if (!groupId) {
      throw new BadRequestException(
        'A valid groupId, workspaceId, taskGroupId, or id query parameter is required',
      );
    }

    return this.tasksService.findAllByGroup(userId, groupId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một công việc' })
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Sửa nội dung/trạng thái công việc (Viewer không được sửa)',
  })
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, id, updateTaskDto);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Gán công việc cho người khác (hoặc chính mình)' })
  assignTask(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    return this.tasksService.assignTask(userId, id, assignTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá công việc (Chỉ Admin/Owner/Creator)' })
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.tasksService.remove(userId, id);
  }
}
