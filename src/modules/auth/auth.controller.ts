import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({ status: 201, description: 'Register successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request (e.g., Email or username already in use, password mismatch)',
  })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 201, description: 'Login successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request (Invalid payload)' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Incorrect credentials or inactive account)',
  })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 201, description: 'Refresh token successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid or expired refresh token)',
  })
  @ApiBody({ type: RefreshTokenDto })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 201, description: 'Logout successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid refresh token)',
  })
  @ApiBody({ type: RefreshTokenDto })
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user fetched successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Missing or invalid access token)',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  me(@CurrentUser('userId') userId: string) {
    return this.authService.getCurrentUser(userId);
  }
}
