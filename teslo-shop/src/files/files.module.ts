import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FilesController],
  imports: [AuthModule],
  providers: [FilesService],
})
export class FilesModule {}
