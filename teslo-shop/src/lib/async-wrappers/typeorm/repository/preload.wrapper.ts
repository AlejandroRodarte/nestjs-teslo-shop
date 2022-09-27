import { PreloadArgs } from 'src/lib/interfaces/async-wrappers/typeorm/repository/preload.interface';
import { AsyncTuple } from '../../../types/async-tuple.type';

export async function preloadWrapper<EntityType>(
  args: PreloadArgs<EntityType>,
): AsyncTuple<EntityType | undefined, Error> {
  try {
    const entity = await args.repository.preload(args.entityLike);
    return [entity, undefined];
  } catch (e) {
    if (e instanceof Error) return [undefined, e];
  }
}
