import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { join } from 'path';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TrimStringPipe } from './common/pipes/trim-string.pipe';
import { setupSwagger } from './config/swagger.config';

export function configureApp(app: NestExpressApplication) {
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api';

  app.setGlobalPrefix(apiPrefix);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (_req: Request, res: Response) =>
    res.redirect(`/${apiPrefix}/docs`),
  );

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
    new ResponseInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const nodeEnv =
    configService.get<string>('app.nodeEnv') ?? process.env.NODE_ENV;

  if (nodeEnv !== 'test') {
    try {
      setupSwagger(app);
    } catch (err) {
      console.warn('Failed to setup Swagger:', err);
    }
  }

  return { apiPrefix };
}
