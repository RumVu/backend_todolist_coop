import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    
    // Attempt to extract token from handshake headers or query
    const token = 
      this.extractTokenFromHeader(client.handshake.headers) || 
      this.extractTokenFromQuery(client.handshake.query);

    if (!token) {
      throw new UnauthorizedException('Authentication token required for WebSocket connection');
    }

    try {
      const payload = await this.authService.validateAccessToken(token);
      // Injects user into socket instance state so we know who is who:
      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        roles: (payload as any).roles || [],
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired WebSocket authentication token');
    }
  }

  private extractTokenFromHeader(headers: any): string | null {
    const authHeader = headers['authorization'] || headers['Authorization'];
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token;
  }

  private extractTokenFromQuery(query: any): string | null {
    const token = query['token'] || query['access_token'];
    return typeof token === 'string' ? token : null;
  }
}
