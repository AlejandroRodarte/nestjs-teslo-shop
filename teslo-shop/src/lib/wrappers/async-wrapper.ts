import { AsyncTuple } from 'src/lib/types/async-tuple.type';

export const asyncWrapper = async <ReturnType>(
  fn: () => Promise<ReturnType>,
): AsyncTuple<ReturnType, Error> => {
  try {
    const data = await fn();
    return [data, undefined];
  } catch (e) {
    if (e instanceof Error) return [undefined, e];
  }
};
