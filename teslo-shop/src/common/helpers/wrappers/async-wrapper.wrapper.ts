import { AsyncTuple } from 'src/common/types/async-tuple.type';

export const asyncWrapper = async <ReturnType>(
  tryFn: () => Promise<ReturnType>,
  catchFn?: () => Promise<void>,
  finallyFn?: () => Promise<void>,
): AsyncTuple<ReturnType, Error> => {
  try {
    const data = await tryFn();
    return [data, undefined];
  } catch (e) {
    if (catchFn) await catchFn();
    if (e instanceof Error) return [undefined, e];
  } finally {
    if (finallyFn) await finallyFn();
  }
};
