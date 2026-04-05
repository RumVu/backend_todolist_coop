import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Bước 1: Dùng Reflector để lấy danh sách role đã được định nghĩa qua decorator @Roles()
    // getAllAndOverride có nghĩa là nó xét @Roles() ở method (hàm) trước, nếu không có thì lấy ở class (controller)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu cái API đó không gắn @Roles() gì hết, thì cho phép (pass) luôn, ai cũng được vô.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Bước 2: Lấy thông tin tài khoản user hiện tại. (Đã được JwtAuthGuard parse và gắn sẵn vào request).
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles: string[] = Array.isArray(user?.roles) ? user.roles : [];

    // Bước 3: So khớp. Dùng .some() để kiểm tra xem mảng (roles của User có)
    // có chứa ít nhất một quyền (role) nào nằm trong mảng requiredRoles (yêu cầu của API) hay không.
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    // Nếu trật khớp, ném thẳng lỗi 403 Forbidden không cho truy cập.
    if (!hasRole) {
      throw new ForbiddenException(
        'Tài khoản của bạn không đủ quyền hạn (roles) để thực hiện thao tác này',
      );
    }

    return true;
  }
}
