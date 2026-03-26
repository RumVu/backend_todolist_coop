"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProfileAccount = toProfileAccount;
exports.buildRefreshTokenSave = buildRefreshTokenSave;
const hash_util_1 = require("../../common/utils/hash.util");
function toProfileAccount(user) {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        ...(user.phoneNum ? { phoneNum: user.phoneNum } : {}),
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        ...(user.roles ? { roles: user.roles } : {}),
    };
}
function buildRefreshTokenSave(token, tokenId, userId, expiresAt) {
    return {
        userId,
        tokenId,
        tokenHash: (0, hash_util_1.hashValue)(token),
        expiresAt,
    };
}
//# sourceMappingURL=auth.mapper.js.map