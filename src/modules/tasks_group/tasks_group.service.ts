import { Injectable } from '@nestjs/common';
import { CreateTasksGroupDto } from './dto/create-tasks_group.dto';
import { UpdateTasksGroupDto } from './dto/update-tasks_group.dto';

@Injectable()
export class TasksGroupService {
  create(createTasksGroupDto: CreateTasksGroupDto) {
    void createTasksGroupDto;
    return 'This action adds a new tasksGroup';
  }

  findAll() {
    return `This action returns all tasksGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tasksGroup`;
  }

  update(id: number, updateTasksGroupDto: UpdateTasksGroupDto) {
    void updateTasksGroupDto;
    return `This action updates a #${id} tasksGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} tasksGroup`;
  }
}
