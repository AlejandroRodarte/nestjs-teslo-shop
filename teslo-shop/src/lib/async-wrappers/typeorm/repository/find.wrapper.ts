import { FindArgs } from 'src/lib/interfaces/async-wrappers/typeorm/repository/find.interface';
import { AsyncTuple } from '../../../types/async-tuple.type';

export async function findWrapper<EntityType>(
  args: FindArgs<EntityType>,
): AsyncTuple<EntityType[], Error> {
  try {
    const entities = await args.repository.find(args.options);
    return [entities, undefined];
  } catch (e) {
    if (e instanceof Error) return [undefined, e];
  }
}
