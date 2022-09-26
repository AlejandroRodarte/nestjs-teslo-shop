import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';

export interface DeleteArgs<EntityType> {
  repository: Repository<EntityType>;
  criteria:
    | string
    | string[]
    | number
    | number[]
    | Date
    | Date[]
    | ObjectID
    | ObjectID[]
    | FindOptionsWhere<EntityType>;
}
