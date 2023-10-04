export type FilterFunction<T> = (
  item: T,
  value: string,
  theSecondValue?: string,
  projectId?: string,
) => boolean;
