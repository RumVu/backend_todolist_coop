import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 10;

/** Hash a value with SHA-256 (used for tokens) */
export function hashValue(value: string): string {
    return createHash('sha256').update(value).digest('hex');
}

/** Hash a password using bcrypt */
export async function hashPassword(password: string, saltRounds?: number): Promise<string> {
    const rounds = typeof saltRounds === 'number' ? saltRounds : BCRYPT_SALT_ROUNDS;
    return bcrypt.hash(password, rounds);
}

/** Compare a plain password with a bcrypt hash */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
