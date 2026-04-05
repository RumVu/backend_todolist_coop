import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Workflow Integration (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let groupId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const uniqueId = Date.now().toString().slice(-6);
  const testUser = {
    name: 'E2E Tester',
    username: `e2e_${uniqueId}`,
    email: `e2e${uniqueId}@ex.com`,
    password: 'password123',
    confirmPassword: 'password123',
    phoneNum: '0123456789',
  };

  it('/api/auth/register (POST) - Register User', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    if (response.status !== 201) {
      console.log('REGISTER ERROR:', response.body);
    }
    expect(response.status).toBe(201);
  });

  it('/api/auth/login (POST) - Login & Get Token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    if (response.status !== 201) {
      console.log('LOGIN ERROR:', response.body);
    }
    expect(response.status).toBe(201);

    accessToken =
      response.body.data.accessToken || response.body.data.tokens?.accessToken;
    expect(accessToken).toBeDefined();
  });

  it('/api/tasks-group (POST) - Create Group', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks-group')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'E2E Test Group',
        description: 'Auto-generated group from integration test',
      })
      .expect(201);

    groupId = response.body.data.id;
    expect(groupId).toBeDefined();
  });

  it('/api/tasks (POST) - Create Task in Group', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Complete E2E Setup',
        description: 'The final step of enterprise update',
        priority: 'HIGH',
        status: 'TODO',
        groupId: groupId,
      })
      .expect(201);

    taskId = response.body.data.id;
    expect(taskId).toBeDefined();
  });

  it('/api/tasks (GET) - Fetch Tasks with Cache', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tasks?groupId=${groupId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.data.data).toBeInstanceOf(Array);
    expect(response.body.data.data.length).toBeGreaterThan(0);
    expect(response.body.data.data[0].title).toBe('Complete E2E Setup');
  });
});
