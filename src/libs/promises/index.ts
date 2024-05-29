export type PromiseOrPromiseLike<T> =
  | Promise<T>
  | PromiseLike<T>