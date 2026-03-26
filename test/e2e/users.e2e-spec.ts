import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Application } from 'express';
import { AppModule } from './../../src/app.module';

describe('Users e2e (CRUD)', () => {
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

    it('create -> list -> get -> update -> delete user', async () => {
        const createPayload = {
            email: 'user-e2e@example.com',
            name: 'User E2E',
            username: 'usere2e',
            phoneNum: '+84123456789'
        };

        const createRes = await request(expressApp)
            .post('/users')
            .send(createPayload)
            .expect(201);

        const created = createRes.body.data;
        expect(created.email).toBe('user-e2e@example.com');
        const id = created.id as string;

        const listRes = await request(expressApp).get('/users').expect(200);
        // listRes.body is { data: [...] }
        expect(Array.isArray(listRes.body.data)).toBe(true);

        const getRes = await request(expressApp).get(`/users/${id}`).expect(200);
        expect(getRes.body.data.email).toBe('user-e2e@example.com');

        const updateRes = await request(expressApp)
            .patch(`/users/${id}`)
            .send({ name: 'Updated E2E' })
            .expect(200);

        expect(updateRes.body.data.name).toBe('Updated E2E');

        await request(expressApp).delete(`/users/${id}`).expect(200);
    }, 15000);
});
