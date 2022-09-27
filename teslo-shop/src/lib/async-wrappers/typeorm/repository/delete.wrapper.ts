import { DeleteArgs } from 'src/lib/interfaces/async-wrappers/typeorm/repository/delete.interface';
import { DeleteResult } from 'typeorm';
import { AsyncTuple } from '../../../types/async-tuple.type';

export async function deleteWrapper<EntityType>(
  args: DeleteArgs<EntityType>,
): AsyncTuple<DeleteResult, Error> {
  try {
    const deleteResult = await args.repository.delete(args.criteria);
    return [deleteResult, undefined];
  } catch (e) {
    if (e instanceof Error) return [undefined, e];
  }
}
