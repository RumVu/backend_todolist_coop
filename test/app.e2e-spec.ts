import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { closeE2EPrisma, createE2EApp, getHttpServer } from './e2e/e2e-helpers';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2EApp();
  });

  afterAll(async () => {
    await app.close();
    await closeE2EPrisma();
  });

  it('/ (GET) redirects to Swagger docs', async () => {
    await request(getHttpServer(app))
      .get('/')
      .expect(302)
      .expect('Location', '/api/docs');
  });
});
