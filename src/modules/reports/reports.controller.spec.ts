import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockService = {
    generateGroupSummary: jest.fn((gid) => ({ id: 'R1', groupId: gid })),
    findAll: jest.fn(() => []),
    findOne: jest.fn((id) => ({ id, title: 'R' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateGroupSummary', () => {
    it('should generate report', async () => {
      const result = await controller.generateGroupSummary('G1', 'U1');
      expect(result.id).toBe('R1');
      expect(mockService.generateGroupSummary).toHaveBeenCalledWith('G1', 'U1');
    });
  });
});
