import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, permissionNames } = createRoleDto;

    const existing = await this.prisma.role.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException('Role with this name already exists');
    }

    // Connect existing permissions or just create role
    return this.prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: (permissionNames || []).map((pName) => ({
            permission: {
              connectOrCreate: {
                where: { name: pName },
                create: { name: pName },
              },
            },
          })),
        },
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { name, description, permissionNames } = updateRoleDto;

    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

    return this.prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        ...(permissionNames && {
          permissions: {
            deleteMany: {}, // Clear existing links
            create: permissionNames.map((pName) => ({
              permission: {
                connectOrCreate: {
                  where: { name: pName },
                  create: { name: pName },
                },
              },
            })),
          },
        }),
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.role.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}
