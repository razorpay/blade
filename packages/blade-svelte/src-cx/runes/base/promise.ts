/** A promise, or anything shaped like one (a thenable). */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return typeof (value as { then?: unknown } | null)?.then === 'function';
}

export type Resolver<T> = (value: T | PromiseLike<T>) => void;

export function promisePair<T>(): [Promise<T>, Resolver<T>] {
  let resolver: Resolver<T> = () => undefined;
  const promise = new Promise<T>((resolve) => {
    resolver = resolve;
  });
  return [promise, resolver];
}
