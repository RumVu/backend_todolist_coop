import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { AppConfigService } from "./config/app.config";
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);
  app.setGlobalPrefix(appConfig.apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  await app.listen(process.env.PORT ?? 6969);
  console.log(`Server is running on port http://localhost:${process.env.PORT ?? 6969}`);
}
void bootstrap();
