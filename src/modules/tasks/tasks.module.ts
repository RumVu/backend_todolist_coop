import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksGroupModule } from '../tasks_group/tasks_group.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TasksGroupModule, UsersModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService, TasksRepository]
})
export class TasksModule {}
