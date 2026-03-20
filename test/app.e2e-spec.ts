import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Application } from 'express';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let expressApp: Application;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    expressApp = app.getHttpAdapter().getInstance() as Application;
  });

  it('/ (GET)', () => {
    return request(expressApp).get('/').expect(200).expect('Hello World!');
  });
});
