
export type SyncOrAsyncDisposable =
  | Disposable
  | AsyncDisposable

export class Disposer<T> implements Disposable {

  constructor(
    readonly inner: T,
    readonly dispose: (inner: T) => void
  ) { }

  static from<T>(disposable: T & Disposable) {
    return new Disposer(disposable, () => disposable[Symbol.dispose]())
  }

  then<TResult1 = T, TResult2 = never>(
    this: Disposer<PromiseLike<T>>,
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
  ): PromiseLike<TResult1 | TResult2> {
    return this.inner.then(onfulfilled, onrejected)
  }

  [Symbol.dispose]() {
    this.dispose(this.inner)
  }

}

export class AsyncDisposer<T> implements AsyncDisposable {

  constructor(
    readonly inner: T,
    readonly dispose: (inner: T) => PromiseLike<void>
  ) { }

  static from<T>(disposable: T & AsyncDisposable) {
    return new AsyncDisposer(disposable, () => disposable[Symbol.asyncDispose]())
  }

  async [Symbol.asyncDispose]() {
    await this.dispose(this.inner)
  }

  then<TResult1 = T, TResult2 = never>(
    this: AsyncDisposer<PromiseLike<T>>,
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
  ): PromiseLike<TResult1 | TResult2> {
    return this.inner.then(onfulfilled, onrejected)
  }

}