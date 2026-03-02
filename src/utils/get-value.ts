function isIndexable(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

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
): ValueAtPath<ObjectPart<T>, P> | null;

export function getValue<T, K extends string & keyof T>(
  value: T | null | undefined,
  path: K,
): T[K] | null | undefined;

export function getValue(value: unknown, path: string): unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== 'object') {
    return value;
  }

  const keys = path.split('.');
  let result: unknown = value;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return result;
    }

    if (isIndexable(result)) {
      result = result[key];
    } else {
      return result;
    }
  }

  return result;
}
