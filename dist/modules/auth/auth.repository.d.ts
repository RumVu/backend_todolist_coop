export interface AuthUserRecord {
    id: string;
    name: string;
    username: string;
    email: string;
    phoneNum?: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
    roles?: string[];
    isActive: boolean;
}
export interface refreshTokenRecord {
    userId: string;
    tokenId: string;
    tokenHash: string;
    expiresAt: string;
    createdAt: string;
}
export interface IAuthRepository {
    findByEmail(email: string): AuthUserRecord | null;
    findByUsername(username: string): AuthUserRecord | null;
    findByName(name: string): AuthUserRecord | null;
    findByPhoneNum(phoneNum: string): AuthUserRecord | null;
    findById(id: string): AuthUserRecord | null;
    createAccount(user: Omit<AuthUserRecord, 'createdAt' | 'updatedAt'>): AuthUserRecord;
    updateUserAccount(userId: string, updates: Partial<Omit<AuthUserRecord, 'id' | 'createdAt'>>): AuthUserRecord | null;
    saveRefreshToken(token: Omit<refreshTokenRecord, 'createdAt'>): refreshTokenRecord;
    findRefreshToken(tokenId: string): refreshTokenRecord | null;
    deleteRefreshTokenByUserId(userId: string): void;
    findRefreshTokenById(tokenId: string): refreshTokenRecord | null;
    deleteRefreshToken(tokenId: string): void;
    deleteRefreshTokensByUserId(userId: string): void;
}
export declare class AuthRepository implements IAuthRepository {
    private readonly users;
    private readonly refreshTokens;
    findByEmail(email: string): AuthUserRecord | null;
    findByUsername(username: string): AuthUserRecord | null;
    findByName(name: string): AuthUserRecord | null;
    findByPhoneNum(phoneNum: string): AuthUserRecord | null;
    findById(id: string): AuthUserRecord | null;
    createAccount(user: Omit<AuthUserRecord, 'createdAt' | 'updatedAt'>): AuthUserRecord;
    updateUserAccount(userId: string, updates: Partial<Omit<AuthUserRecord, 'id' | 'createdAt'>>): AuthUserRecord | null;
    saveRefreshToken(token: Omit<refreshTokenRecord, "createdAt">): refreshTokenRecord;
    findRefreshToken(tokenId: string): refreshTokenRecord | null;
    deleteRefreshTokenByUserId(userId: string): void;
    findRefreshTokenById(tokenId: string): refreshTokenRecord | null;
    deleteRefreshToken(tokenId: string): void;
    deleteRefreshTokensByUserId(userId: string): void;
}
