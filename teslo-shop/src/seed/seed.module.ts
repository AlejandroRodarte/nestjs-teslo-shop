import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [SeedController],
  imports: [AuthModule, ProductsModule],
  providers: [SeedService],
})
export class SeedModule {}
