export class Disposer<T> implements Disposable {

  constructor(
    readonly inner: T,
    readonly dispose: (inner: T) => void
  ) { }

  static from<T>(disposable: T & Disposable) {
    return new Disposer(disposable, () => disposable[Symbol.dispose]())
  }

  [Symbol.dispose]() {
    this.dispose(this.inner)
  }

  get() {
    return this.inner
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

  get() {
    return this.inner
  }

}