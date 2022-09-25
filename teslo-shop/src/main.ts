import { NestFactory } from '@nestjs/core';
import './lib/docker/set-secrets';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
