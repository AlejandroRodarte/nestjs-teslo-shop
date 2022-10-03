import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto, SignInUserDto } from './dto/requests';
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
import { SignInResponseDto } from './dto/responses/sign-in-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { GetNewTokenResponseDto } from './dto/responses/get-new-token-response.dto';

@Injectable()
export class AuthService extends RepositoryService<{ user: User }> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(PASSWORD_HASHING_ADAPTER_AUTH_SERVICE)
    private readonly passwordHasher: PasswordHashingAdapter,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async signUp(signUpUserDto: SignUpUserDto): Promise<SignUpResponseDto> {
    const savedUser = await this.saveNewUserEntity(signUpUserDto);
    return new SignUpResponseDto(
      PublicUserInformationResponseDto.buildFromUserEntity(savedUser),
      this._generateToken({ id: savedUser.id }),
    );
  }

  async signIn(signInUserDto: SignInUserDto): Promise<SignInResponseDto> {
    const [foundUser, findOneError] = await asyncWrapper(async () => {
      const foundUser = await this.userRepository.findOne({
        where: { email: signInUserDto.email },
      });
      return foundUser;
    });
    if (findOneError) this._handleError(findOneError);
    if (!foundUser)
      throw new UnauthorizedException(
        'Authenthication failed. Please revise your credentials',
      );

    const [isPasswordCorrect, hasherError] = await asyncWrapper(async () => {
      const result = await this.passwordHasher.compare(
        signInUserDto.password,
        foundUser.password,
      );
      return result;
    });
    if (hasherError) this._handleError(hasherError);

    if (!isPasswordCorrect)
      throw new UnauthorizedException(
        'Authenthication failed. Please revise your credentials',
      );

    return new SignInResponseDto(
      PublicUserInformationResponseDto.buildFromUserEntity(foundUser),
      this._generateToken({ id: foundUser.id }),
    );
  }

  getNewToken(userId: string): GetNewTokenResponseDto {
    const newToken = this._generateToken({ id: userId });
    return new GetNewTokenResponseDto(newToken);
  }

  async saveNewUserEntity(signUpUserDto: SignUpUserDto): Promise<User> {
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
    return savedUser;
  }

  async deleteAllUsers(): Promise<void> {
    const [, error] = await asyncWrapper(async () => {
      const deleteResult = await this.userRepository.delete({});
      return deleteResult;
    });
    if (error) this._handleError(error);
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

  private _generateToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
