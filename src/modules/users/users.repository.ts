import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface UserRecord {
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

@Injectable()
export class UsersRepository {
    private readonly users = new Map<string, UserRecord>();

    findByEmail(email: string): UserRecord | null {
        const normalized = email.trim().toLowerCase();
        for (const u of this.users.values()) {
            if (u.email === normalized) return u;
        }
        return null;
    }

    findByUsername(username: string): UserRecord | null {
        const normalized = username.trim().toLowerCase();
        for (const u of this.users.values()) {
            if (u.username === normalized) return u;
        }
        return null;
    }

    findByName(name: string): UserRecord | null {
        const normalized = name.trim().toLowerCase();
        for (const u of this.users.values()) {
            if (u.name.toLowerCase() === normalized) return u;
        }
        return null;
    }

    findByPhoneNum(phoneNum: string): UserRecord | null {
        const normalized = phoneNum.trim();
        for (const u of this.users.values()) {
            if (u.phoneNum === normalized) return u;
        }
        return null;
    }

    findById(id: string): UserRecord | null {
        return this.users.get(id) ?? null;
    }

    create(user: Omit<UserRecord, 'createdAt' | 'updatedAt'>): UserRecord {
        const now = new Date().toISOString();
        const record: UserRecord = { ...user, createdAt: now, updatedAt: now };
        this.users.set(record.id, record);
        return record;
    }

    update(id: string, updates: Partial<Omit<UserRecord, 'id' | 'createdAt'>>): UserRecord | null {
        const existing = this.users.get(id);
        if (!existing) return null;
        const updated: UserRecord = { ...existing, ...updates, updatedAt: new Date().toISOString() };
        this.users.set(id, updated);
        return updated;
    }

    delete(id: string): void {
        this.users.delete(id);
    }

    findAll(): UserRecord[] {
        return Array.from(this.users.values());
    }
}
