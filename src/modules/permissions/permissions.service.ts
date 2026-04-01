import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  findAll() {
    return {
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_tasks'],
      description: 'Danh sách các permission mô phỏng',
    };
  }
}
