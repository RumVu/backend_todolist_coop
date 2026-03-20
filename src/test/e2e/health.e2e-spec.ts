import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Application } from 'express';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('Health e2e', () => {
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

  it('returns health resources', async () => {
    await request(expressApp)
      .get('/health')
      .expect(200)
      .expect('This action returns all health');

    await request(expressApp)
      .get('/health/1')
      .expect(200)
      .expect('This action returns a #1 health');
  });
});
