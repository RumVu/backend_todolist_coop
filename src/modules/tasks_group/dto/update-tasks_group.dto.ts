import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksGroupDto } from './create-tasks_group.dto';

export class UpdateTasksGroupDto extends PartialType(CreateTasksGroupDto) {}
