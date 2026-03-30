import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersRepository } from './users.repository';
import { randomUUID, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { hashPassword, comparePassword } from '../../common/utils/hash.util';

function toProfile(user: any) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phoneNum: user.phoneNum,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly configService: ConfigService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();
    const normalizedUsername = createUserDto.username.trim().toLowerCase();

    if (await this.usersRepo.findByEmail(normalizedEmail)) {
      throw new BadRequestException('Email already in use');
    }
    if (await this.usersRepo.findByUsername(normalizedUsername)) {
      throw new BadRequestException('Username already in use');
    }

    // Nếu Admin không truyền password, hệ thống tự động sinh ra 1 chuỗi 8 ký tự ngẫu nhiên
    const isAutoPassword = !createUserDto.password;
    const plainPassword = createUserDto.password || randomBytes(4).toString('hex');

    // Tiến hành băm (hash) mật khẩu trước khi lưu để bảo mật tuyệt đối
    const rounds = parseInt(this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10', 10);
    const passwordHash = await hashPassword(plainPassword, rounds);

    // Ghi dữ liệu vào lưu trữ (Nguồn dữ liệu duy nhất đã được chuẩn hoá)
    const user = await this.usersRepo.create({
      email: normalizedEmail,
      name: createUserDto.name.trim(),
      username: normalizedUsername,
      phoneNum: createUserDto.phoneNum || null,
      isActive: true, // Mặc định tài khoản luôn active khi tạo
      roles: ['user'], // Quyền mặc định
      passwordHash: passwordHash,
    });

    // Thông báo cho Admin biết mật khẩu (nếu là do hệ thống tự sinh ra) để họ gửi cho khách
    const message = isAutoPassword 
      ? `Tạo tài khoản thành công. Mật khẩu tự động: ${plainPassword}` 
      : 'Tạo tài khoản thành công';

    return { message, data: toProfile(user) };
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
    return { message: 'Cập nhật hồ sơ cá nhân thành công', data: toProfile(updated) };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Kiểm tra mật khẩu cũ
    const passwordMatches = await comparePassword(changePasswordDto.oldPassword, user.passwordHash || '');
    if (!passwordMatches) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Băm mật khẩu mới và lưu
    const rounds = parseInt(this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10', 10);
    const passwordHash = await hashPassword(changePasswordDto.newPassword, rounds);

    await this.usersRepo.update(userId, { passwordHash } as any);

    return { message: 'Đổi mật khẩu thành công' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = { ...updateUserDto };

    // Kiểm tra trùng lặp Email và Username nếu Admin có thay đổi
    if (updateData.email) {
      updateData.email = updateData.email.trim().toLowerCase();
      const existing = await this.usersRepo.findByEmail(updateData.email);
      if (existing && existing.id !== id) {
        throw new BadRequestException('Email đã được sử dụng bởi tài khoản khác');
      }
    }

    if (updateData.username) {
      updateData.username = updateData.username.trim().toLowerCase();
      const existing = await this.usersRepo.findByUsername(updateData.username);
      if (existing && existing.id !== id) {
        throw new BadRequestException('Username đã được sử dụng bởi tài khoản khác');
      }
    }

    // Nếu Admin quyết định gõ password mới đè lên tài khoản này, ta phải Băm (Hash) nó!
    if (updateData.password) {
      const rounds = parseInt(this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10', 10);
      updateData.passwordHash = await hashPassword(updateData.password, rounds);
      delete updateData.password; // Không được phép lưu plaintext
    }

    const updated = await this.usersRepo.update(id, updateData);
    if (!updated) throw new NotFoundException('User not found');
    return { message: 'User updated', data: toProfile(updated) };
  }

  async remove(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.delete(id);
    return { message: 'User removed' };
  }
}
