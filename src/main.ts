import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { winstonConfig } from './config/winston.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonConfig,
  });

  const enableRedisTransport = process.env.ENABLE_REDIS_TRANSPORT === 'true';
  if (enableRedisTransport) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });
  }
  const configService = app.get(ConfigService);
  const { apiPrefix } = configureApp(app);
  const expressApp = app.getHttpAdapter().getInstance();

  if (process.env.VERCEL) {
    await app.init();
    return expressApp;
  }

  const port =
    configService.get<number>('app.port') ?? process.env.PORT ?? 6969;
  if (enableRedisTransport) {
    await app.startAllMicroservices();
  }
  await app.listen(port);

  Logger.log(`REST API running on: http://localhost:${port}/${apiPrefix}`);
}

const bootstrapPromise = bootstrap();

export default async function handler(req: Request, res: Response) {
  const app = await bootstrapPromise;
  if (app) {
    return app(req, res);
  }
}
