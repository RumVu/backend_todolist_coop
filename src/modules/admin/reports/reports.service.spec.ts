import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';

import { PrismaService } from '../../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('Admin/ReportsService', () => {
  let service: ReportsService;

  const mockPrisma = {
    report: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
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

  describe('findOne', () => {
    it('should throw NotFoundException if report missing', async () => {
      mockPrisma.report.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should return a report', async () => {
      const report = { id: '1', title: 'R1' };
      mockPrisma.report.findUnique.mockResolvedValue(report);
      expect(await service.findOne('1')).toEqual(report);
    });
  });
});
