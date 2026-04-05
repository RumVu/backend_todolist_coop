import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  closeE2EPrisma,
  cleanupUsersByEmail,
  createE2EApp,
  ensureBaseData,
  getHttpServer,
  uniqueEmail,
  uniqueId,
} from './e2e-helpers';

describe('Auth e2e (full flow)', () => {
  let app: INestApplication;
  let email: string;

  beforeAll(async () => {
    await ensureBaseData();
    app = await createE2EApp();
    email = uniqueEmail('auth');
  });

  afterAll(async () => {
    await cleanupUsersByEmail([email]);
    await app.close();
    await closeE2EPrisma();
  });

  it('register -> login -> me -> refresh -> logout', async () => {
    const registerPayload = {
      email,
      name: 'E2E User',
      username: uniqueId('user'),
      password: 'secret123',
      confirmPassword: 'secret123',
    };

    const registerRes = await request(getHttpServer(app))
      .post('/api/auth/register')
      .send(registerPayload)
      .expect(201);

    expect(registerRes.body.data.message).toBe('User registered successfully');
    expect(registerRes.body.data.data.userAccount.email).toBe(email);

    const loginRes = await request(getHttpServer(app))
      .post('/api/auth/login')
      .send({ email, password: 'secret123' })
      .expect(201);

    expect(loginRes.body.data.message).toBe('Login successful');
    const accessToken = loginRes.body.data.tokens.accessToken as string;
    const refreshToken = loginRes.body.data.tokens.refreshToken as string;

    const meRes = await request(getHttpServer(app))
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(meRes.body.data.message).toBe('User profile fetched');
    expect(meRes.body.data.data.email).toBe(email);

    const refreshRes = await request(getHttpServer(app))
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(201);

    expect(refreshRes.body.data.message).toBe('Token refreshed');
    expect(refreshRes.body.data.tokens.accessToken).toBeDefined();

    const logoutRes = await request(getHttpServer(app))
      .post('/api/auth/logout')
      .send({ refreshToken: refreshRes.body.data.tokens.refreshToken })
      .expect(201);

    expect(logoutRes.body.data.message).toBe('Logout successful');
  }, 20000);
});
