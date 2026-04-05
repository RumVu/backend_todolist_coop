import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;

  const mockPrisma = {
    role: {
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
        RolesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if role exists', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: '1', name: 'admin' });
      await expect(service.create({ name: 'admin' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a role', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);
      mockPrisma.role.create.mockResolvedValue({ id: '1', name: 'user' });

      const result = await service.create({ name: 'user' });
      expect(result).toEqual({ id: '1', name: 'user' });
      expect(mockPrisma.role.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('should return a role', async () => {
      const role = { id: '1', name: 'admin' };
      mockPrisma.role.findUnique.mockResolvedValue(role);
      expect(await service.findOne('1')).toEqual(role);
    });
  });
});
