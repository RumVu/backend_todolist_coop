import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { randomUUID } from 'crypto';

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
  constructor(private readonly usersRepo: UsersRepository) { }

  create(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();
    const normalizedUsername = createUserDto.username.trim().toLowerCase();

    if (this.usersRepo.findByEmail(normalizedEmail)) {
      throw new BadRequestException('Email already in use');
    }
    if (this.usersRepo.findByUsername(normalizedUsername)) {
      throw new BadRequestException('Username already in use');
    }

    const user = this.usersRepo.create({
      id: randomUUID(),
      email: normalizedEmail,
      name: createUserDto.name.trim(),
      username: normalizedUsername,
      phoneNum: createUserDto.phoneNum,
      isActive: true,
    });

    return { message: 'User created', data: toProfile(user) };
  }

  findAll() {
    const users = this.usersRepo.findAll();
    return { data: users.map(toProfile) };
  }

  findOne(id: string) {
    const user = this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return { data: toProfile(user) };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const updated = this.usersRepo.update(id, updateUserDto as any);
    if (!updated) throw new NotFoundException('User not found');
    return { message: 'User updated', data: toProfile(updated) };
  }

  remove(id: string) {
    const user = this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    this.usersRepo.delete(id);
    return { message: 'User removed' };
  }
}
