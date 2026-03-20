import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Application } from 'express';
import request from 'supertest';
import { AppModule } from '../../app.module';

interface AuthApiResponse {
  message: string;
  data: {
    accessToken: string;
    user: {
      email: string;
    };
  };
}

describe('Auth e2e', () => {
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

  it('registers, logs in, and fetches the current user profile', async () => {
    const registerPayload = {
      email: 'tester@example.com',
      name: 'Tester',
      username: 'tester',
      password: 'secret123',
      confirmPassword: 'secret123',
    };

    const registerResponse = await request(expressApp)
      .post('/auth/register')
      .send(registerPayload)
      .expect(201);
    const registerBody = registerResponse.body as AuthApiResponse;

    expect(registerBody.message).toBe('Register successfully');
    expect(registerBody.data.user.email).toBe('tester@example.com');

    const loginResponse = await request(expressApp)
      .post('/auth/login')
      .send({
        email: 'tester@example.com',
        password: 'secret123',
      })
      .expect(201);
    const loginBody = loginResponse.body as AuthApiResponse;

    expect(loginBody.message).toBe('Login successfully');

    await request(expressApp)
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginBody.data.accessToken}`)
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        const responseBody = body as AuthApiResponse;

        expect(responseBody.message).toBe('Current user fetched successfully');
        expect(responseBody.data.user.email).toBe('tester@example.com');
      });
  });

  it('rejects registration when confirmPassword does not match', async () => {
    await request(expressApp)
      .post('/auth/register')
      .send({
        email: 'wrong-confirm@example.com',
        name: 'Tester',
        username: 'wrongconfirm',
        password: 'secret123',
        confirmPassword: 'secret456',
      })
      .expect(400)
      .expect(({ body }: { body: unknown }) => {
        const responseBody = body as { message: string };

        expect(responseBody.message).toBe(
          'Password confirmation does not match',
        );
      });
  });
});
