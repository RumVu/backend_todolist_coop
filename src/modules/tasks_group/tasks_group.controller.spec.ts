import { Test, TestingModule } from '@nestjs/testing';
import { TasksGroupController } from './tasks_group.controller';
import { TasksGroupService } from './tasks_group.service';

describe('TasksGroupController', () => {
  let controller: TasksGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksGroupController],
      providers: [TasksGroupService],
    }).compile();

    controller = module.get<TasksGroupController>(TasksGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
