import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import './lib/docker/set-secrets';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = +process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(port);
}
bootstrap();
