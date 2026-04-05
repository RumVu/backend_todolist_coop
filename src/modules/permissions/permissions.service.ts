import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const existing = await this.prisma.permission.findUnique({
      where: { name: createPermissionDto.name },
    });
    if (existing) {
      throw new ConflictException('Permission with this name already exists');
    }
    return this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.permission.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }

  async update(id: string, updatePermissionDto: any) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }
}
