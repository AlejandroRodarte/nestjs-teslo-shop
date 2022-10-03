import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { asyncWrapper } from '../../common/helpers/wrappers/async-wrapper.wrapper';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('jwt.secret');
    super({
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const [user, error] = await asyncWrapper(async () => {
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });
      return user;
    });

    if (error)
      throw new InternalServerErrorException(
        'A database error occured while performing the user search query',
      );
    if (!user) throw new UnauthorizedException('Token is not valid');
    if (!user.isActive)
      throw new UnauthorizedException(
        'User is banned from this web application',
      );

    // this gets attached to the req express object
    return user;
  }
}
