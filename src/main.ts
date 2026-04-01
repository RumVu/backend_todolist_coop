import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TrimStringPipe } from './common/pipes/trim-string.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}/${apiPrefix}`);
}

const bootstrapPromise = bootstrap();

export default async function handler(req: any, res: any) {
  const app = await bootstrapPromise;
  if (app) {
    return app(req, res);
  }
}
