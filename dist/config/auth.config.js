"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("auth", () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET ?? "access-secret-key",
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "refresh-secret-key",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d"
}));
//# sourceMappingURL=auth.config.js.map