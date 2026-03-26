import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Application } from 'express';
import { AppModule } from './../../src/app.module';

describe('Auth e2e (full flow)', () => {
    let app: INestApplication;
    let expressApp: Application;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        expressApp = app.getHttpAdapter().getInstance() as Application;
    });

    afterAll(async () => {
        await app.close();
    });

    it('register -> login -> me -> refresh -> logout', async () => {
        const registerPayload = {
            email: 'e2e-user@example.com',
            name: 'E2E User',
            username: 'e2euser',
            password: 'secret123',
            confirmPassword: 'secret123',
        };

        const registerRes = await request(expressApp)
            .post('/auth/register')
            .send(registerPayload)
            .expect(201);

        expect(registerRes.body.message).toBe('User registered successfully');
        expect(registerRes.body.data.userAccount.email).toBe('e2e-user@example.com');

        const loginRes = await request(expressApp)
            .post('/auth/login')
            .send({ email: 'e2e-user@example.com', password: 'secret123' })
            .expect(201);

        expect(loginRes.body.message).toBe('Login successfully');
        const accessToken = loginRes.body.tokens.accessToken as string;
        const refreshToken = loginRes.body.tokens.refreshToken as string;

        // me
        const meRes = await request(expressApp)
            .get('/auth/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(meRes.body.message).toBe('Current user fetched successfully');
        expect(meRes.body.data.email || meRes.body.data.userAccount?.email).toBe(
            'e2e-user@example.com',
        );

        // refresh
        const refreshRes = await request(expressApp)
            .post('/auth/refresh')
            .send({ refreshToken })
            .expect(201);

        expect(refreshRes.body.message).toBe('Refresh token successfully');
        expect(refreshRes.body.tokens.accessToken).toBeDefined();

        // logout
        const logoutRes = await request(expressApp)
            .post('/auth/logout')
            .send({ refreshToken })
            .expect(201);

        expect(logoutRes.body.message).toBe('Logout successfully');
    }, 20000);
});
