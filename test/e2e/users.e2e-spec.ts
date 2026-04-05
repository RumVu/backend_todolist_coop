import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  closeE2EPrisma,
  cleanupUsersByEmail,
  createE2EApp,
  ensureBaseData,
  getHttpServer,
  uniqueId,
} from './e2e-helpers';

describe('Users e2e (admin CRUD)', () => {
  let app: INestApplication;
  let adminAccessToken: string;
  let email: string;

  beforeAll(async () => {
    await ensureBaseData();
    app = await createE2EApp();
    email = `${uniqueId('users')}@example.com`;

    const loginRes = await request(getHttpServer(app))
      .post('/api/auth/login')
      .send({ email: 'admin@ex.com', password: 'admin123' })
      .expect(201);

    adminAccessToken = loginRes.body.data.tokens.accessToken as string;
  });

  afterAll(async () => {
    await cleanupUsersByEmail([email]);
    await app.close();
    await closeE2EPrisma();
  });

  it('create -> list -> get -> update -> delete user', async () => {
    const createPayload = {
      email,
      name: 'User E2E',
      username: uniqueId('usere2e'),
      phoneNum: '+84123456789',
      password: 'secret123',
    };

    const createRes = await request(getHttpServer(app))
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(createPayload)
      .expect(201);

    const created = createRes.body.data.data;
    expect(created.email).toBe(email);
    const id = created.id as string;

    const listRes = await request(getHttpServer(app))
      .get('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(Array.isArray(listRes.body.data.data)).toBe(true);

    const getRes = await request(getHttpServer(app))
      .get(`/api/users/${id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(getRes.body.data.data.email).toBe(email);

    const updateRes = await request(getHttpServer(app))
      .patch(`/api/users/${id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ name: 'Updated E2E' })
      .expect(200);

    expect(updateRes.body.data.data.name).toBe('Updated E2E');

    await request(getHttpServer(app))
      .delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
  }, 20000);
});
