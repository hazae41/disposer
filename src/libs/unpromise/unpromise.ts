export type Unpromise<T> =
  () => T

export namespace Unpromise {

  /**
   * Like Promise.all but sync
   * @param callbacks 
   * @returns 
   */
  export function all<T>(callbacks: Iterable<Unpromise<T>>) {
    const results = new Array<T>()

    let error: { e: unknown } | undefined = undefined

    for (const callback of callbacks) {
      try {
        results.push(callback())
      } catch (e: unknown) {
        error = { e }
      }
    }

    if (error)
      throw error.e
    return results
  }

}