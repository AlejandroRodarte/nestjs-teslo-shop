export type AsyncTuple<DataType, ErrorType> = Promise<
  [DataType | undefined, ErrorType | undefined]
>;
