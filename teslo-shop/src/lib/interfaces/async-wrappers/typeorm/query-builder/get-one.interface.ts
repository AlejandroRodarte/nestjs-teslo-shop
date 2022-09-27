import { SelectQueryBuilder } from 'typeorm';

export interface GetOneArgs<EntityType> {
  selectQueryBuilder: SelectQueryBuilder<EntityType>;
}
