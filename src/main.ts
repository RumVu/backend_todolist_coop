import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TrimStringPipe } from './common/pipes/trim-string.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Setup Microservices Bridge (Redis Transporter) - Bỏ qua nếu chạy trên Vercel
  if (!process.env.VERCEL) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });
  }

  // Setup view/static assets for uploaded files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api';

  app.setGlobalPrefix(apiPrefix);
  
  // Set up a redirect from the root URL to Swagger so Vercel preview works immediately
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req: any, res: any) => res.redirect(`/${apiPrefix}/docs`));

  app.useGlobalPipes(
    new TrimStringPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor()
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger (always enabled for now)
  try {
    setupSwagger(app);
  } catch (err) {
    // swallow; swagger is optional
    // eslint-disable-next-line no-console
    console.warn('Failed to setup Swagger:', err?.message ?? err);
  }

  if (process.env.VERCEL) {
    await app.init();
    return expressApp;
  }

  const port = configService.get<number>('app.port') ?? process.env.PORT ?? 6969;
  // Khởi động cả REST API lẫn hệ thống Microservices lắng nghe song song
  await app.startAllMicroservices();
  await app.listen(port);
  
  Logger.log(`🚀 REST API chạy trên: http://localhost:${port}/${apiPrefix}`);
}

const bootstrapPromise = bootstrap();

export default async function handler(req: any, res: any) {
  const app = await bootstrapPromise;
  if (app) {
    return app(req, res);
  }
}
