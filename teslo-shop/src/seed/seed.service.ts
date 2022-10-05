import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { SEED_DATA } from './data/seed.data';
import { ProductsService } from '../products/products.service';
import { User } from 'src/auth/entities/user.entity';
import { PopulateResponseDto } from './dto/responses/populate-response-dto';

@Injectable()
export class SeedService {
  private readonly _environment = this.configService.get<string>('environment');

  constructor(
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async populate(): Promise<PopulateResponseDto> {
    if (this._environment !== 'production') {
      await this._purge();
      await this._seed();
      return new PopulateResponseDto('Database seeded');
    }
    return new PopulateResponseDto(
      'Seeding not available in production environment',
    );
  }

  private async _purge() {
    await this.authService.deleteAllUsers();
  }

  private async _seed() {
    const users: User[] = [];
    const seedUsersAmount = SEED_DATA.users.length;

    for (const user of SEED_DATA.users) {
      const newUser = await this.authService.saveNewUserEntity(user);
      users.push(newUser);
    }

    for (const product of SEED_DATA.products) {
      const randomIndex = Math.floor(Math.random() * seedUsersAmount);
      await this.productsService.create(product, users[randomIndex]);
    }
  }
}
