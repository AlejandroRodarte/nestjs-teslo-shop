import { FindManyOptions, Repository } from 'typeorm';

export interface FindArgs<EntityType> {
  repository: Repository<EntityType>;
  options?: FindManyOptions<EntityType>;
}
