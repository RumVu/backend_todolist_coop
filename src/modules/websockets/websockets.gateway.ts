import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: { origin: '*' }, // Allow all origins explicitly for development/mobile
  namespace: '/realtime',
})
export class WebSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WebSocketsGateway');

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`🔗 Client connecting: ${client.id}`);
    try {
        // Since handleConnection doesn't trigger guards automatically in NestJS, we manually validate:
        const authHeader = client.handshake.headers.authorization;
        const queryToken = client.handshake.query.token as string;
        
        let token = queryToken;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) throw new UnauthorizedException('No token provided');

        const payload = await this.authService.validateAccessToken(token);
        client.data.user = { userId: payload.sub, email: payload.email };
        
        this.logger.log(`✅ Client authenticated: ${client.id} (User: ${payload.email})`);
    } catch (error) {
        this.logger.warn(`❌ Client unauthorized: ${client.id} - ${error.message}`);
        client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`👋 Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinGroup')
  handleJoinGroup(@MessageBody('groupId') groupId: string, @ConnectedSocket() client: Socket) {
    if (groupId) {
        client.join(groupId);
        this.logger.log(`User ${client.data.user.email} joined Group Room: ${groupId}`);
        return { event: 'joined', data: { groupId } };
    }
    return { event: 'error', data: 'Missing groupId' };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(@MessageBody('groupId') groupId: string, @ConnectedSocket() client: Socket) {
      if (groupId) {
          client.leave(groupId);
          this.logger.log(`User ${client.data.user.email} left Group Room: ${groupId}`);
          return { event: 'left', data: { groupId } };
      }
  }
}
