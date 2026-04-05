import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator @Roles() dùng để gắn nhãn danh sách các quyền (mảng chuỗi)
 * mà API hiện tại đang yêu cầu.
 *
 * Ví dụ: @Roles('admin', 'manager')
 *
 * Mảng quyền này sẽ được SetMetadata nhúng vào hàm hoặc class của Controller.
 * Lát nữa RolesGuard sẽ dùng Reflector để bứng (đọc) cái metadata này ra đối chiếu.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
