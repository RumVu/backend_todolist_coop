import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PermissionsService', () => {
  let service: PermissionsService;

  const mockPrisma = {
    permission: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if permission exists', async () => {
      mockPrisma.permission.findUnique.mockResolvedValue({
        id: '1',
        name: 'read',
      });
      await expect(service.create({ name: 'read' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a permission', async () => {
      mockPrisma.permission.findUnique.mockResolvedValue(null);
      mockPrisma.permission.create.mockResolvedValue({
        id: '1',
        name: 'write',
      });
      const result = await service.create({ name: 'write' });
      expect(result).toEqual({ id: '1', name: 'write' });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException on delete failure', async () => {
      mockPrisma.permission.delete.mockRejectedValue(new Error());
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
