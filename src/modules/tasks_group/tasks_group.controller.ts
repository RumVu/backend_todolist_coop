import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksGroupService } from './tasks_group.service';
import { CreateTasksGroupDto } from './dto/create-tasks_group.dto';
import { UpdateTasksGroupDto } from './dto/update-tasks_group.dto';

@Controller('tasks-group')
export class TasksGroupController {
  constructor(private readonly tasksGroupService: TasksGroupService) {}

  @Post()
  create(@Body() createTasksGroupDto: CreateTasksGroupDto) {
    return this.tasksGroupService.create(createTasksGroupDto);
  }

  @Get()
  findAll() {
    return this.tasksGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTasksGroupDto: UpdateTasksGroupDto,
  ) {
    return this.tasksGroupService.update(+id, updateTasksGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksGroupService.remove(+id);
  }
}
