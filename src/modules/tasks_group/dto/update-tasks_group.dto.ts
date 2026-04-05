import { PartialType } from '@nestjs/swagger';
import { CreateTasksGroupDto } from './create-tasks_group.dto';

export class UpdateTasksGroupDto extends PartialType(CreateTasksGroupDto) {}
