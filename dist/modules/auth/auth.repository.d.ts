export interface AuthUserRecord {
    id: string;
    name: string;
    email: string;
    phoneNum?: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}
export interface refreshTokenRecord {
    userId: string;
    tokenId: string;
    expiresAt: string;
    createAt: string;
}
export declare class AuthRepository {
    private readonly users;
    private readonly refreshTokens;
    findByEmail(email: string): AuthUserRecord | null;
    findByUsername(username: string): AuthUserRecord | null;
    findByPhoneNum(phoneNum: string): AuthUserRecord | null;
    findById(id: string): AuthUserRecord | null;
    createAccount(user: Omit<AuthUserRecord, 'createdAt' | 'updatedAt'>): AuthUserRecord;
    updateUserAccount(userId: string, updates: Partial<Omit<AuthUserRecord, 'id' | 'createdAt'>>): AuthUserRecord | null;
    saveRefreshToken(tokenRecord: refreshTokenRecord): void;
    deleteRefreshTokenByUserId(userId: string): void;
}
