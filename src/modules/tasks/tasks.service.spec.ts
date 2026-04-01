import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TasksGroupRepository } from '../tasks_group/tasks_group.repository';
import { UsersRepository } from '../users/users.repository';
import { WebSocketsGateway } from '../websockets/websockets.gateway';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: {} },
        { provide: TasksGroupRepository, useValue: {} },
        { provide: UsersRepository, useValue: {} },
        { provide: WebSocketsGateway, useValue: {} },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
