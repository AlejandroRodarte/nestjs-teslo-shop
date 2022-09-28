import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './config/env.config';
import { EnvSchema } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
      isGlobal: true,
      validationSchema: EnvSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    HealthModule,
    ProductsModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
