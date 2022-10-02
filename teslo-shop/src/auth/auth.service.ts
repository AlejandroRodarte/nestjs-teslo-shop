import { Inject, Injectable } from '@nestjs/common';
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
import { PASSWORD_HASHING_ADAPTER_AUTH_SERVICE } from './interfaces/password-hashing-adapter.interface.tokens';
import { PasswordHashingAdapter } from 'src/common/interfaces/password-hashing-adapter.interface';
import { SignUpResponseDto } from './dto/responses/sign-up-response.dto';
import { PublicUserInformationResponseDto } from './dto/responses/objects/user/public-user-information-response.dto';

@Injectable()
export class AuthService extends RepositoryService<{ user: User }> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(PASSWORD_HASHING_ADAPTER_AUTH_SERVICE)
    private readonly passwordHasher: PasswordHashingAdapter,
  ) {
    super();
  }

  async signUp(signUpUserDto: SignUpUserDto): Promise<SignUpResponseDto> {
    const [hashedPassword, hashError] = await asyncWrapper(async () => {
      const hashedPassword = await this.passwordHasher.hash(
        signUpUserDto.password,
      );
      return hashedPassword;
    });
    if (hashError) this._handleError(hashError);

    const user = this.userRepository.create({
      ...signUpUserDto,
      password: hashedPassword,
    });

    const [savedUser, saveError] = await asyncWrapper(async () => {
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    });
    if (saveError) this._handleError(saveError, { user });

    return PublicUserInformationResponseDto.buildFromUserEntity(savedUser);
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
