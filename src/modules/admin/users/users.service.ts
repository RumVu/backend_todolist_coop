import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../../../common/utils/hash.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, username, email, password } = createUserDto;

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) throw new BadRequestException('User already exists');

    const rounds = parseInt(
      this.configService.get('auth.bcryptSaltRounds', '10'),
      10,
    );
    const passwordHash = await hashPassword(password, rounds);

    return this.prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        roles: {
          create: {
            role: { connect: { name: 'user' } },
          },
        },
      },
      include: { roles: { include: { role: true } } },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: { role: true },
        },
        _count: {
          select: {
            createdTasks: true,
            ownedGroups: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
        ownedGroups: true,
        memberOf: {
          include: { group: true },
        },
      },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, isActive, roles } = updateUserDto;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const updateData: any = { name, isActive };

    if (roles) {
      updateData.roles = {
        deleteMany: {},
        create: roles.map((rName: string) => ({
          role: { connect: { name: rName } },
        })),
      };
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
