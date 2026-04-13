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

  it('registers, creates a group, persists task status updates, and lists tasks through compatible routes', async () => {
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

    expect(registerResponse.body.data.userAccount.email).toBe(email);

    const loginResponse = await request(getHttpServer(app))
      .post('/api/auth/login')
      .send({ email, password: 'password123' })
      .expect(201);

    accessToken = loginResponse.body.tokens.accessToken as string;
    expect(accessToken).toBeDefined();

    const groupResponse = await request(getHttpServer(app))
      .post('/api/task-groups')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'E2E Test Group',
        description: 'Auto-generated group from integration test',
      })
      .expect(201);

    groupId = groupResponse.body.data.id as string;
    expect(groupId).toBeDefined();

    const taskResponse = await request(getHttpServer(app))
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Complete E2E Setup',
        description: 'The final step of enterprise update',
        priority: 'HIGH',
        status: 'TODO',
        groupId,
      })
      .expect(201);

    expect(taskResponse.body.data.title).toBe('Complete E2E Setup');
    const taskId = taskResponse.body.data.id as string;
    expect(taskResponse.body.data.status).toBe('TODO');

    const updateResponse = await request(getHttpServer(app))
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'IN_PROGRESS',
      })
      .expect(200);

    expect(updateResponse.body.data.status).toBe('IN_PROGRESS');

    const getTaskResponse = await request(getHttpServer(app))
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(getTaskResponse.body.data.id).toBe(taskId);
    expect(getTaskResponse.body.data.status).toBe('IN_PROGRESS');

    const listResponse = await request(getHttpServer(app))
      .get(`/api/tasks?workspaceId=${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(listResponse.body.data).toBeInstanceOf(Array);
    expect(listResponse.body.data.length).toBeGreaterThan(0);
    const persistedTask = listResponse.body.data.find(
      (task: { id: string }) => task.id === taskId,
    ) as { id: string; title: string; status: string } | undefined;

    expect(persistedTask).toBeDefined();
    expect(persistedTask?.title).toBe('Complete E2E Setup');
    expect(persistedTask?.status).toBe('IN_PROGRESS');
  }, 30000);
});
