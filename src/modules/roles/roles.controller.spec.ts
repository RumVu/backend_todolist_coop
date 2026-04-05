import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

describe('RolesController', () => {
  let controller: RolesController;

  const mockRolesService = {
    create: jest.fn((dto) => ({ id: '1', ...dto })),
    findAll: jest.fn(() => [{ id: '1', name: 'admin' }]),
    findOne: jest.fn((id) => ({ id, name: 'admin' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ id, deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const dto = { name: 'user' };
      expect(await controller.create(dto)).toEqual({ id: '1', ...dto });
      expect(mockRolesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      expect(await controller.findAll()).toEqual([{ id: '1', name: 'admin' }]);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const dto = { name: 'admin-updated' };
      expect(await controller.update('1', dto)).toEqual({
        id: '1',
        name: 'admin-updated',
      });
    });
  });
});
