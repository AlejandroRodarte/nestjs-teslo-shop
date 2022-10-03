export type FilterKeys<ObjectType, Condition> = {
  [Key in keyof ObjectType]: ObjectType[Key] extends Condition ? never : Key;
};
