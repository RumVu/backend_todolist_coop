import { AuthUserRecord, refreshTokenRecord } from './auth.repository';
export declare function toProfileAccount(user: AuthUserRecord): {
    roles?: string[] | undefined;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    phoneNum?: string | undefined;
    id: string;
    name: string;
    username: string;
    email: string;
};
export declare function buildRefreshTokenSave(token: string, tokenId: string, userId: string, expiresAt: string): Omit<refreshTokenRecord, 'createdAt'>;
