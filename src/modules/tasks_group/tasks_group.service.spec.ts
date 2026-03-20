import { Test, TestingModule } from '@nestjs/testing';
import { TasksGroupService } from './tasks_group.service';

describe('TasksGroupService', () => {
  let service: TasksGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksGroupService],
    }).compile();

    service = module.get<TasksGroupService>(TasksGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
