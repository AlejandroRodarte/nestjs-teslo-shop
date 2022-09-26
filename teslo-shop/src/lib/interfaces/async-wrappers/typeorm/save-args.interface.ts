import { DeepPartial, Repository } from 'typeorm';

export interface SaveArgs<EntityType> {
  repository: Repository<EntityType>;
  entityLike: DeepPartial<EntityType>;
}
