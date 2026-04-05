import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../prisma/generated-client';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersRepository, UserRecord } from './users.repository';
import { hashPassword, comparePassword } from '../../common/utils/hash.util';

function toProfile(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phoneNum: user.phoneNum,
    isActive: user.isActive,
    roles: (user.roles || []).map((ur) => ur.role.name),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();
    const normalizedUsername = createUserDto.username.trim().toLowerCase();

    if (await this.usersRepo.findByEmail(normalizedEmail)) {
      throw new BadRequestException('Email already in use');
    }
    if (await this.usersRepo.findByUsername(normalizedUsername)) {
      throw new BadRequestException('Username already in use');
    }

    const rounds = parseInt(
      this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10',
      10,
    );
    const passwordHash = await hashPassword(
      createUserDto.password || '',
      rounds,
    );

    const userData: Prisma.UserCreateInput = {
      email: normalizedEmail,
      name: createUserDto.name.trim(),
      username: normalizedUsername,
      phoneNum: createUserDto.phoneNum || null,
      isActive: true,
      passwordHash,
      roles: {
        create: {
          role: { connect: { name: 'user' } },
        },
      },
    };

    const user = await this.usersRepo.create(userData);
    return {
      message: 'User created successful',
      data: toProfile(user),
    };
  }

  async findAll() {
    const users = await this.usersRepo.findAll();
    return { data: users.map(toProfile) };
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return { data: toProfile(user) };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.usersRepo.update(userId, updateProfileDto);
    if (!updated) throw new BadRequestException('Failed to update');
    return {
      message: 'Profile update successful',
      data: toProfile(updated),
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new BadRequestException('Confirmed password not match');
    }

    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const passwordMatches = await comparePassword(
      changePasswordDto.oldPassword,
      user.passwordHash,
    );
    if (!passwordMatches)
      throw new BadRequestException('Incorrect current password');

    const rounds = parseInt(
      this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10',
      10,
    );
    const passwordHash = await hashPassword(
      changePasswordDto.newPassword,
      rounds,
    );

    await this.usersRepo.update(userId, { passwordHash });
    return { message: 'Password changed successful' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updateData: Prisma.UserUpdateInput = {};

    if (updateUserDto.email) {
      updateData.email = updateUserDto.email.trim().toLowerCase();
    }
    if (updateUserDto.username) {
      updateData.username = updateUserDto.username.trim().toLowerCase();
    }
    if (updateUserDto.name) {
      updateData.name = updateUserDto.name.trim();
    }
    if (updateUserDto.phoneNum !== undefined) {
      updateData.phoneNum = updateUserDto.phoneNum || null;
    }
    if (typeof updateUserDto.isActive === 'boolean') {
      updateData.isActive = updateUserDto.isActive;
    }

    if (updateUserDto.password) {
      const rounds = parseInt(
        this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10',
        10,
      );
      updateData.passwordHash = await hashPassword(
        updateUserDto.password,
        rounds,
      );
    }

    if (updateUserDto.roles) {
      updateData.roles = {
        deleteMany: {},
        create: updateUserDto.roles.map((roleName) => ({
          role: { connect: { name: roleName } },
        })),
      };
    }

    const updated = await this.usersRepo.update(id, updateData);
    if (!updated) throw new NotFoundException('User not found');
    return { message: 'User updated', data: toProfile(updated) };
  }

  async remove(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.delete(id);
    return { message: 'User removed successful' };
  }
}
