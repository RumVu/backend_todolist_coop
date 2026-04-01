import { Global, Module } from '@nestjs/common';
import { WebSocketsGateway } from './websockets.gateway';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [WebSocketsGateway],
  exports: [WebSocketsGateway],
})
export class WebsocketsModule {}
