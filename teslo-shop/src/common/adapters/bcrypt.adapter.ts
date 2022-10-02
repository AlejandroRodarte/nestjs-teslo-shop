import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHashingAdapter } from '../interfaces/password-hashing-adapter.interface';

@Injectable()
export class BcryptAdapter implements PasswordHashingAdapter {
  async hash(plainPassword: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return hashedPassword;
  }
}
