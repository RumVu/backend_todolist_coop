import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.systemSetting.findMany();
  }

  async findOne(key: string) {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key },
    });
    if (!setting)
      throw new NotFoundException(`Setting with key ${key} not found`);
    return setting;
  }

  async update(key: string, value: string, description?: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  async remove(key: string) {
    try {
      return await this.prisma.systemSetting.delete({ where: { key } });
    } catch {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
  }
}
