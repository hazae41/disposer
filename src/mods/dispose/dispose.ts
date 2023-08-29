export type MaybeAsyncDisposable =
  | Disposable
  | AsyncDisposable

export class Disposer<T> implements Disposable {

  constructor(
    readonly inner: T,
    readonly dispose: () => void
  ) { }

  static from<T>(disposable: T & Disposable) {
    return new Disposer(disposable, () => disposable[Symbol.dispose]())
  }

  [Symbol.dispose]() {
    this.dispose()
  }

}

export class AsyncDisposer<T> implements AsyncDisposable {

  constructor(
    readonly inner: T,
    readonly dispose: () => PromiseLike<void>
  ) { }

  static from<T>(disposable: T & AsyncDisposable) {
    return new AsyncDisposer(disposable, () => disposable[Symbol.asyncDispose]())
  }

  async [Symbol.asyncDispose]() {
    await this.dispose()
  }

}

export class PromiseDisposer<T> implements PromiseLike<T>, Disposable {

  constructor(
    readonly inner: PromiseLike<T>,
    readonly dispose: () => void
  ) { }

  static from<T>(disposable: PromiseLike<T> & Disposable) {
    return new PromiseDisposer(disposable, () => disposable[Symbol.dispose]())
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
    return this.inner.then(onfulfilled, onrejected)
  }

  [Symbol.dispose]() {
    this.dispose()
  }

}


export class AsyncPromiseDisposer<T> implements PromiseLike<T>, AsyncDisposable {

  constructor(
    readonly inner: PromiseLike<T>,
    readonly dispose: () => PromiseLike<void>
  ) { }

  static from<T>(disposable: PromiseLike<T> & AsyncDisposable) {
    return new PromiseDisposer(disposable, () => disposable[Symbol.asyncDispose]())
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
    return this.inner.then(onfulfilled, onrejected)
  }

  async [Symbol.asyncDispose]() {
    await this.dispose()
  }

}

export namespace Disposable {

  export async function race<T>(promises: (PromiseLike<T> & MaybeAsyncDisposable)[]): Promise<Awaited<T>> {
    try {
      return await Promise.race(promises)
    } finally {
      for (const disposer of promises) {
        await using _ = disposer
      }
    }
  }

}