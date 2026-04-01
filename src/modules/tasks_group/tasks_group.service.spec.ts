import { Test, TestingModule } from '@nestjs/testing';
import { TasksGroupService } from './tasks_group.service';
import { TasksGroupRepository } from './tasks_group.repository';
import { UsersRepository } from '../users/users.repository';

describe('TasksGroupService', () => {
  let service: TasksGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksGroupService,
        { provide: TasksGroupRepository, useValue: {} },
        { provide: UsersRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<TasksGroupService>(TasksGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
