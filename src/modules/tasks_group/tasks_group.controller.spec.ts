import { Test, TestingModule } from '@nestjs/testing';
import { TasksGroupController } from './tasks_group.controller';
import { TasksGroupService } from './tasks_group.service';
import { TasksGroupRepository } from './tasks_group.repository';
import { UsersRepository } from '../users/users.repository';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('TasksGroupController', () => {
  let controller: TasksGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksGroupController],
      providers: [
        { provide: TasksGroupService, useValue: {} },
        { provide: TasksGroupRepository, useValue: {} },
        { provide: UsersRepository, useValue: {} },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<TasksGroupController>(TasksGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
