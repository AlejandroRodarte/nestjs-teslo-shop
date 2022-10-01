import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpUserDto } from './dto/requests/sign-up-user.dto';
import { User } from './entities/user.entity';
import { asyncWrapper } from '../common/helpers/wrappers/async-wrapper.wrapper';
import { RepositoryService } from '../common/services/repository.service';
import {
  UNIQUE_USER_EMAIL_CONSTRAINT,
  MATCHES_REGEX_USER_EMAIL_CONSTRAINT,
} from './entities/user.constraint-names';

@Injectable()
export class AuthService extends RepositoryService<{ user: User }> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async signUp(signUpUserDto: SignUpUserDto): Promise<User> {
    const user = this.userRepository.create(signUpUserDto);
    const [savedUser, error] = await asyncWrapper(async () => {
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    });
    if (error) this._handleError(error, { user });
    return savedUser;
  }

  protected _getConstraintMessage(
    constraint: string,
    { user }: { user: User },
  ): string {
    switch (constraint) {
      case UNIQUE_USER_EMAIL_CONSTRAINT:
        return `There is already a user with email '${user.email}' in the database`;
      case MATCHES_REGEX_USER_EMAIL_CONSTRAINT:
        return `${user.email} is not an email`;
      default:
        return 'Unhandled constraint type. Create a custom message!';
    }
  }
}
