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

describe('Workflow Integration (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let email: string;
  let groupId: string;

  beforeAll(async () => {
    await ensureBaseData();
    app = await createE2EApp();
    email = uniqueEmail('workflow');
  });

  afterAll(async () => {
    await cleanupUsersByEmail([email]);
    await app.close();
    await closeE2EPrisma();
  });

  it('registers, creates a group, creates a task, and lists tasks in that group', async () => {
    const registerPayload = {
      name: 'Workflow Tester',
      username: uniqueId('workflow-user'),
      email,
      password: 'password123',
      confirmPassword: 'password123',
      phoneNum: '0123456789',
    };

    const registerResponse = await request(getHttpServer(app))
      .post('/api/auth/register')
      .send(registerPayload)
      .expect(201);

    expect(registerResponse.body.data.data.userAccount.email).toBe(email);

    const loginResponse = await request(getHttpServer(app))
      .post('/api/auth/login')
      .send({ email, password: 'password123' })
      .expect(201);

    accessToken = loginResponse.body.data.tokens.accessToken as string;
    expect(accessToken).toBeDefined();

    const groupResponse = await request(getHttpServer(app))
      .post('/api/tasks-group')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'E2E Test Group',
        description: 'Auto-generated group from integration test',
      })
      .expect(201);

    groupId = groupResponse.body.data.data.id as string;
    expect(groupId).toBeDefined();

    const taskResponse = await request(getHttpServer(app))
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Complete E2E Setup',
        description: 'The final step of enterprise update',
        priority: 'HIGH',
        groupId,
      })
      .expect(201);

    expect(taskResponse.body.data.data.title).toBe('Complete E2E Setup');

    const listResponse = await request(getHttpServer(app))
      .get(`/api/tasks?groupId=${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(listResponse.body.data.data).toBeInstanceOf(Array);
    expect(listResponse.body.data.data.length).toBeGreaterThan(0);
    expect(listResponse.body.data.data[0].title).toBe('Complete E2E Setup');
  }, 30000);
});
