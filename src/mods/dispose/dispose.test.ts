import { test } from "@hazae41/phobos"
import { AsyncPromiseDisposer, Disposable, PromiseDisposer } from "./dispose.js"

await test("sync", async ({ message, test }) => {
  console.log(message)

  const disposables = Array.from({ length: 3 }, (x, i) => {
    const create = async () => {
      await new Promise(ok => setTimeout(ok, 1000 - (1 * 100)))
      console.log(`created ${i}`)
    }

    const dispose = () => console.log(`disposed ${i}`)
    return new PromiseDisposer(create(), dispose)
  })

  await Disposable.raceSync(disposables)
  await Promise.all(disposables)
})

await test("async", async ({ message, test }) => {
  console.log(message)

  const disposables = Array.from({ length: 3 }, (x, i) => {
    const create = async () => {
      await new Promise(ok => setTimeout(ok, 1000 - (1 * 100)))
      console.log(`created ${i}`)
    }

    const dispose = async () => console.log(`disposed ${i}`)
    return new AsyncPromiseDisposer(create(), dispose)
  })

  await Disposable.race(disposables)
  await Promise.all(disposables)
})