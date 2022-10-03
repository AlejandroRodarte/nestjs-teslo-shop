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
import { JwtStrategy } from './strategies/jwt.strategy';

const AuthTypeormModule = TypeOrmModule.forFeature([User]);
const AuthPassportModule = PassportModule.register({ defaultStrategy: 'jwt' });
const AuthJwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const jwtSecret = configService.get<string>('jwt.secret');
    return {
      secret: jwtSecret,
      signOptions: { expiresIn: '2h' },
    };
  },
});

@Module({
  controllers: [AuthController],
  imports: [AuthTypeormModule, AuthPassportModule, AuthJwtModule, CommonModule],
  exports: [
    AuthService,
    AuthTypeormModule,
    AuthPassportModule,
    AuthJwtModule,
    JwtStrategy,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: PASSWORD_HASHING_ADAPTER_AUTH_SERVICE,
      useClass: BcryptAdapter,
    },
  ],
})
export class AuthModule {}
