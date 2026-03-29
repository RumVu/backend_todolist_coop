import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api';

  app.setGlobalPrefix(apiPrefix);
  
  // Set up a redirect from the root URL to Swagger so Vercel preview works immediately
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req: any, res: any) => res.redirect(`/${apiPrefix}/docs`));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger (always enabled for now)
  try {
    setupSwagger(app);
  } catch (err) {
    // swallow; swagger is optional
    // eslint-disable-next-line no-console
    console.warn('Failed to setup Swagger:', err?.message ?? err);
  }

  const port = configService.get<number>('app.port') ?? 6969;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}/${apiPrefix}`);
}

void bootstrap();
