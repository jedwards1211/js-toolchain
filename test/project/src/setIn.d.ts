export default function setIn<T extends Object>(
  obj: T,
  path: Iterable<any>,
  newValue: any
): T
