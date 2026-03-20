import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  findAll() {
    return `This action returns all health`;
  }

  findOne(id: number) {
    return `This action returns a #${id} health`;
  }

  remove(id: number) {
    return `This action removes a #${id} health`;
  }
}
