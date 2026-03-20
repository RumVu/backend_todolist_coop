import { TasksGroupService } from './tasks_group.service';
import { CreateTasksGroupDto } from './dto/create-tasks_group.dto';
import { UpdateTasksGroupDto } from './dto/update-tasks_group.dto';
export declare class TasksGroupController {
    private readonly tasksGroupService;
    constructor(tasksGroupService: TasksGroupService);
    create(createTasksGroupDto: CreateTasksGroupDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTasksGroupDto: UpdateTasksGroupDto): string;
    remove(id: string): string;
}
