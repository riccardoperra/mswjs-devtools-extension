import { SetStoreFunction } from "solid-js/store";

type _GetObjectPaths<T> = {
  [P in keyof T]-?: T[P] extends object ? [P] | [P, ...Path<T[P]>] : [P];
};

type Path<T> = _GetObjectPaths<T>[keyof T];

export type GetTypeFromPathArray<
  T,
  Path extends unknown[]
> = Path["length"] extends 0
  ? T
  : T extends object
  ? Path extends [infer Head, ...infer Rest]
    ? GetTypeFromPathArray<T[Head & keyof T], Rest>
    : never
  : never;

export function createDerivedSetter<T extends object, TPaths extends Path<T>>(
  setStore: SetStoreFunction<T>,
  path: TPaths
): SetStoreFunction<GetTypeFromPathArray<T, TPaths>> {
  const setState: SetStoreFunction<GetTypeFromPathArray<T, TPaths>> = (
    ...args: unknown[]
  ) => {
    const localSetState = setStore as (...args: unknown[]) => void;
    localSetState(...path, ...args);
  };
  return setState;
}
