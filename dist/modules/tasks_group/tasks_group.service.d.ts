import { CreateTasksGroupDto } from './dto/create-tasks_group.dto';
import { UpdateTasksGroupDto } from './dto/update-tasks_group.dto';
export declare class TasksGroupService {
    create(createTasksGroupDto: CreateTasksGroupDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTasksGroupDto: UpdateTasksGroupDto): string;
    remove(id: number): string;
}
