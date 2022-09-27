import { DeepPartial, Repository } from 'typeorm';

export interface PreloadArgs<EntityType> {
  repository: Repository<EntityType>;
  entityLike: DeepPartial<EntityType>;
}
