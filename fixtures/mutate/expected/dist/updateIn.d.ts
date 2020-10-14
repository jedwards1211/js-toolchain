export default function updateIn<T>(
  obj: T,
  path: Iterable<any>,
  notSetValue: any,
  updater: (value: any) => any
): T
export default function updateIn<T>(
  obj: T,
  path: Iterable<any>,
  updater: (value: any) => any
): T
