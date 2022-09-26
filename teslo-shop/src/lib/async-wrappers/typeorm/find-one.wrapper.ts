import { FindOneArgs } from 'src/lib/interfaces/async-wrappers/typeorm/find-one.interface';
import { AsyncTuple } from '../../types/async-tuple.type';

export async function findOneWrapper<EntityType>(
  args: FindOneArgs<EntityType>,
): AsyncTuple<EntityType | null, Error> {
  try {
    const entity = await args.repository.findOne(args.options);
    return [entity, undefined];
  } catch (e) {
    if (e instanceof Error) return [undefined, e];
  }
}
