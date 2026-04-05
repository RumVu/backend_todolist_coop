import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockPrisma = {
    taskGroup: { findUnique: jest.fn() },
    report: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateGroupSummary', () => {
    it('should throw NotFoundException if group missing', async () => {
      mockPrisma.taskGroup.findUnique.mockResolvedValue(null);
      await expect(service.generateGroupSummary('1', 'auth-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create a report if group exists', async () => {
      const group = {
        id: '1',
        name: 'G1',
        tasks: [],
        _count: { tasks: 0, members: 1 },
      };
      mockPrisma.taskGroup.findUnique.mockResolvedValue(group);
      mockPrisma.report.create.mockResolvedValue({
        id: 'R1',
        title: 'Summary',
      });

      const result = await service.generateGroupSummary('1', 'auth-1');
      expect(result.id).toBe('R1');
      expect(mockPrisma.report.create).toHaveBeenCalled();
    });
  });
});
