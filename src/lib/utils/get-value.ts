type ObjectPart<T> = T extends object ? T : never;

type PathsOf<T> = T extends object
  ? {
      [K in keyof T & (string | number)]:
        | `${K & string}`
        | (ObjectPart<NonNullable<T[K]>> extends never
            ? never
            : `${K & string}.${PathsOf<ObjectPart<NonNullable<T[K]>>>}`);
    }[keyof T & (string | number)]
  : never;

type ValueAtPath<T, Path extends string> = T extends object
  ? Path extends keyof T
    ? T[Path]
    : Path extends `${infer Key}.${infer Rest}`
      ? Key extends keyof T
        ? ValueAtPath<ObjectPart<NonNullable<T[Key]>>, Rest>
        : undefined
      : undefined
  : T;

export function getValue<T, P extends PathsOf<ObjectPart<T>>>(
  value: T | null | undefined,
  path: P,
):
  | (ValueAtPath<ObjectPart<T>, P> | null | undefined)
  | (T extends string | number | boolean ? T : never);
export function getValue(value: any, path: string): any {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== 'object') {
    return value;
  }

  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let result = value;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return result;
    }

    if (typeof result === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      result = result[key];
    } else {
      return result;
    }
  }

  return result;
}
