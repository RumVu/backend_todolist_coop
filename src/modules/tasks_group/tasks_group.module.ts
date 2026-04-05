import { Module } from '@nestjs/common';
import { TasksGroupController } from './tasks_group.controller';
import { TasksGroupService } from './tasks_group.service';
import { TasksGroupRepository } from './tasks_group.repository';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [TasksGroupController],
  providers: [TasksGroupService, TasksGroupRepository],
  exports: [TasksGroupService, TasksGroupRepository],
})
export class TasksGroupModule {}
