import "@hazae41/symbol-dispose-polyfill"

import { test } from "@hazae41/phobos"
import { AsyncPromiseDisposer, PromiseDisposer } from "./dispose.js"

await test("sync", async ({ message, test }) => {
  console.log(message)

  function f(i: number) {
    const create = async () => {
      await new Promise(ok => setTimeout(ok, 1000 - (1 * 100)))
      console.log(`created ${i}`)
    }

    const dispose = () => {
      console.log(`disposed ${i}`)
    }

    return new PromiseDisposer(create(), dispose)
  }

  using a = f(1)
  using b = f(2)
  using c = f(3)

  await Promise.all([a, b, c])
})

await test("async", async ({ message, test }) => {
  console.log(message)

  function f(i: number) {
    const create = async () => {
      await new Promise(ok => setTimeout(ok, 1000 - (1 * 100)))
      console.log(`created ${i}`)
    }

    const dispose = async () => {
      await new Promise(ok => setTimeout(ok, 1000 - (1 * 100)))
      console.log(`disposed ${i}`)
    }

    return new AsyncPromiseDisposer(create(), dispose)
  }

  await using a = f(1)
  await using b = f(2)
  await using c = f(3)

  await Promise.all([a, b, c])
})