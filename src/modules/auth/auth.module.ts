import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthController } from './auth.controller';
import { OAuthController } from './oauth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.accessSecret'),
      }),
    }),
  ],
  controllers: [AuthController, OAuthController],
  providers: [AuthRepository, AuthService, JwtAuthGuard],
  exports: [AuthService, AuthRepository, JwtAuthGuard],
})
export class AuthModule {}
