import { Injectable } from '@nestjs/common';
import { USER_ROLES } from '../../shared/constants/role.constant';

@Injectable()
export class RolesService {
  findAll() {
    return {
      roles: USER_ROLES,
      description: 'Danh sách các role hợp lệ cho phép gán cho tài khoản',
    };
  }
}
