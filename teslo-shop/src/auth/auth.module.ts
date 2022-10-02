import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from 'src/common/common.module';
import { PASSWORD_HASHING_ADAPTER_AUTH_SERVICE } from './interfaces/password-hashing-adapter.interface.tokens';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('jwt.secret');
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '2h' },
        };
      },
    }),
    CommonModule,
  ],
  providers: [
    AuthService,
    {
      provide: PASSWORD_HASHING_ADAPTER_AUTH_SERVICE,
      useClass: BcryptAdapter,
    },
  ],
})
export class AuthModule {}
