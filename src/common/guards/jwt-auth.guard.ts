import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../modules/auth/auth.service';

type AuthenticatedRequest = Request & {
  user?: { userId: string; email?: string; name?: string; roles?: string[] };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authorization header is invalid');
    }

    const payload = await this.authService.validateAccessToken(token);

    request.user = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      ...(payload.hasOwnProperty('roles') ? { roles: (payload as any).roles } : {}),
    };

    return true;
  }

}
