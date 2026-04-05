import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth() // Hiện thị nút ổ khoá JWT góc phải Swagger
@UseGuards(JwtAuthGuard, RolesGuard) // Bật cổng bảo vệ đa lớp: Yêu cầu Đăng nhập (Jwt) và có Quyền (Roles)
@ApiResponse({
  status: 401,
  description: 'Unauthorized (Missing or invalid access token)',
})
@ApiResponse({
  status: 403,
  description: 'Forbidden (Tài khoản không đủ thẩm quyền Admin)',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // API Độc quyền của Admin: Tạo tài khoản hệ thống (Có kèm Set mật khẩu auto)
  @Post()
  @Roles('admin') // Rào chắn chỉ cho Admin gọi API này
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (Email or username already in use)',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // API Độc quyền của Admin: Xem toàn bộ danh sách thành viên trong hệ thống
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.usersService.findAll();
  }

  // API Độc quyền của Admin: Xem chi tiết 1 user bất kỳ theo ID
  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // API dành cho mọi User: Tự cập nhật tài khoản (Tên, SĐT)
  // Ghi chú: Endpoint 'me' phải đặt TIẾP TUYẾN TRƯỚC ':id' để tránh bị đè route.
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  // API dành cho mọi User: Tự đổi mật khẩu
  @Patch('me/password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (Mật khẩu cũ sai hoặc xác nhận không khớp)',
  })
  changePassword(
    @CurrentUser('userId') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, changePasswordDto);
  }

  // API Độc quyền của Admin: Cập nhật thông tin (ví dụ cấm tài khoản, đổi sđt, đổi tên)
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // API Độc quyền của Admin: Xoá triệt để user khỏi hệ thống
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User removed' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
