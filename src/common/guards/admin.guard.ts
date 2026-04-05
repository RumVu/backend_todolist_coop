import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào khu vực này',
      );
    }

    // Role names now come as a string array from the JWT payload
    const isAdmin = user.roles.some(
      (role: string) =>
        role.toLowerCase() === 'admin' ||
        role.toLowerCase() === 'administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'Chỉ tài khoản Administrator mới có quyền thực hiện thao tác này',
      );
    }

    return true;
  }
}
