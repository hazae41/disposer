export class Disposer<T> implements Disposable {

  constructor(
    readonly inner: T,
    readonly clean: (inner: T) => void
  ) { }

  static from<T>(disposable: T & Disposable) {
    return new Disposer(disposable, () => disposable[Symbol.dispose]())
  }

  static async wait<T>(this: Disposer<PromiseLike<T>>) {
    try {
      await this.get()
    } finally {
      this.dispose()
    }
  }

  [Symbol.dispose]() {
    this.dispose()
  }

  dispose() {
    this.clean(this.inner)
  }

  get() {
    return this.inner
  }

}

export class AsyncDisposer<T> implements AsyncDisposable {

  constructor(
    readonly inner: T,
    readonly clean: (inner: T) => PromiseLike<void>
  ) { }

  static from<T>(disposable: T & AsyncDisposable) {
    return new AsyncDisposer(disposable, () => disposable[Symbol.asyncDispose]())
  }

  static async wait<T>(this: AsyncDisposer<PromiseLike<T>>) {
    try {
      await this.get()
    } finally {
      await this.dispose()
    }
  }

  async [Symbol.asyncDispose]() {
    await this.dispose()
  }

  async dispose() {
    await this.clean(this.inner)
  }

  get() {
    return this.inner
  }

}
