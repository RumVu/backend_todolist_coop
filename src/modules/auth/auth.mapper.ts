import { AuthUserRecord, refreshTokenRecord } from './auth.repository';
import { hashValue } from '../../common/utils/hash.util';

/**
 * Chuyển AuthUserRecord thành profile object dùng trong response.
 * Trả về các trường tương tự như `toProfileAccount` trong `AuthService`.
 */
export function toProfileAccount(user: AuthUserRecord) {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        // phoneNum là tùy chọn — include nếu có
        ...(user.phoneNum ? { phoneNum: user.phoneNum } : {}),
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        ...(user.roles ? { roles: user.roles } : {}),
    };
}

/**
 * Tạo object tương thích với AuthRepository.saveRefreshToken
 * - token: raw refresh token (JWT)
 * - tokenId: id của token (được sinh khi tạo token)
 * - userId: id người dùng
 * - expiresAt: ISO string biểu diễn thời điểm hết hạn
 *
 * Trả về object có shape: { userId, tokenId, tokenHash, expiresAt }
 * (lưu ý repository sẽ bổ sung createdAt khi lưu)
 */
export function buildRefreshTokenSave(
    token: string,
    tokenId: string,
    userId: string,
    expiresAt: string,
): Omit<refreshTokenRecord, 'createdAt'> {
    return {
        userId,
        tokenId,
        tokenHash: hashValue(token),
        expiresAt,
    };
}
