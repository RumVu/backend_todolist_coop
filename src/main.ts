import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api';

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

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
