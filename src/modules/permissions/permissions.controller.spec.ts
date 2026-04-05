import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  const mockService = {
    create: jest.fn(dto => ({ id: '1', ...dto })),
    findAll: jest.fn(() => [{ id: '1', name: 'read' }]),
    remove: jest.fn(id => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a permission', async () => {
      const dto = { name: 'admin:all' };
      expect(await controller.create(dto)).toEqual({ id: '1', ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      expect(await controller.findAll()).toEqual([{ id: '1', name: 'read' }]);
    });
  });
});
