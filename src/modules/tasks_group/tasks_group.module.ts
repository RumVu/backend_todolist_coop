import { Module } from '@nestjs/common';
import { TasksGroupService } from './tasks_group.service';
import { TasksGroupController } from './tasks_group.controller';
import { TasksGroupRepository } from './tasks_group.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [TasksGroupController],
  providers: [TasksGroupService, TasksGroupRepository],
  exports: [TasksGroupService, TasksGroupRepository]
})
export class TasksGroupModule {}
