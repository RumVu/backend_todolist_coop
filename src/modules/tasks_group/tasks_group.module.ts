import { Module } from '@nestjs/common';
import { TasksGroupService } from './tasks_group.service';
import { TasksGroupController } from './tasks_group.controller';

@Module({
  controllers: [TasksGroupController],
  providers: [TasksGroupService],
})
export class TasksGroupModule {}
