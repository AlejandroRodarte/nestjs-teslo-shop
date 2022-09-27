import { FindOneOptions, Repository } from 'typeorm';

export interface FindOneArgs<EntityType> {
  repository: Repository<EntityType>;
  options: FindOneOptions<EntityType>;
}
