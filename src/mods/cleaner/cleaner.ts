import { Promiseable } from "libs/promises/promises.js"

export type Cleanup =
  () => void

export interface Cleanable {
  readonly clean: Cleanup
}

export namespace Cleanable {

  export async function use<T extends Cleanable | undefined, U>(cleanable: T, callback: (cleanable: T) => Promiseable<U>) {
    try {
      return await callback(cleanable)
    } finally {
      cleanable?.clean()
    }
  }

  export function useSync<T extends Cleanable | undefined, U>(cleanable: T, callback: (cleanable: T) => U) {
    try {
      return callback(cleanable)
    } finally {
      cleanable?.clean()
    }
  }

}

export interface Cleaner<T> {
  readonly inner: T
  readonly clean: Cleanup
}

export class Cleaner<T> {

  constructor(
    readonly inner: T,
    readonly clean: Cleanup
  ) { }

}

export namespace Cleaner {

  export async function wait<T>(cleaner: Cleaner<T>): Promise<Awaited<T>> {
    try {
      return await cleaner.inner
    } finally {
      cleaner.clean()
    }
  }

  export async function race<T>(cleaners: Cleaner<Promise<T>>[]) {
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