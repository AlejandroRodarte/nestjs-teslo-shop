import { SaveArgs } from 'src/lib/interfaces/async-wrappers/typeorm/save-args.interface';
import { AsyncTuple } from '../../types/async-tuple.type';

export async function saveWrapper<EntityType>(
  args: SaveArgs<EntityType>,
): AsyncTuple<EntityType, Error> {
  try {
    const savedEntity = await args.repository.save(args.entityLike);
    return [savedEntity, undefined];
  } catch (e) {
    if (e instanceof Error) return [undefined, e];
  }
}
