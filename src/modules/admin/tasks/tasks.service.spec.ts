import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('Admin/TasksService', () => {
  let service: TasksService;

  const mockPrisma = {
    task: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if task missing', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should return a task', async () => {
      const task = { id: '1', title: 'T1' };
      mockPrisma.task.findUnique.mockResolvedValue(task);
      expect(await service.findOne('1')).toEqual(task);
    });
  });
});
