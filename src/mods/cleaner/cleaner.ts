export type Cleanup =
  () => void

export interface Cleanable {
  clean(): void
}

export class Cleaner<T> {

  constructor(
    readonly inner: T,
    readonly clean: Cleanup
  ) { }

  static async wait<T>(cleaner: Cleaner<Promise<T>>) {
    try {
      return await cleaner.inner
    } finally {
      cleaner.clean()
    }
  }

  static async race<T>(cleaners: Cleaner<Promise<T>>[]) {
    const promises = new Array<Promise<T>>(cleaners.length)
    const cleanups = new Array<Cleanup>(cleaners.length)

    for (let i = 0; i < cleaners.length; i++) {
      promises[i] = cleaners[i].inner
      cleanups[i] = cleaners[i].clean
    }

    try {
      return await Promise.race(promises)
    } finally {
      cleanups.forEach(cleanup => cleanup())
    }
  }

}