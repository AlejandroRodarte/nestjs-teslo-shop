import { NestFactory } from '@nestjs/core';
import './lib/docker/set-secrets';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = +process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
