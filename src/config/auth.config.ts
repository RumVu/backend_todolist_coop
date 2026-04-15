import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET ?? 'access-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret-key',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  // number of bcrypt salt rounds (work factor). Can be overridden via env.
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS ?? '10',
}));
