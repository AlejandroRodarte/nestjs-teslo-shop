import { GetOneArgs } from 'src/lib/interfaces/async-wrappers/typeorm/query-builder/get-one.interface';
import { AsyncTuple } from '../../../types/async-tuple.type';

export async function getOneWrapper<EntityType>(
  args: GetOneArgs<EntityType>,
): AsyncTuple<EntityType | null, Error> {
  try {
    const entity = await args.selectQueryBuilder.getOne();
    return [entity, undefined];
  } catch (e) {
    if (e instanceof Error) return [undefined, e];
  }
}
