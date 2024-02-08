# Disposer

A wrapper for an object with a dispose function

```bash
npm i @hazae41/disposer
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/disposer)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Create a disposable object from any object

## Usage

### Create a disposable object (Disposable or AsyncDisposable) from any object

```tsx
using d = new Disposer(something, () => { ... })
```

```tsx
await using d = new AsyncDisposer(something, async () => { ... })
```

You can get the inner object with `.inner` or `.get()` and the dispose function with `.dispose`

## Example

This can be useful for waiting for multiple listeners, and remove all listeners when one of them is triggered

```tsx
import { Future } from "@hazae41/future"
import { Disposer } from "@hazae41/disposer"

function waitA(): Disposer<Promise<"a">> {
  const future = new Future<"a">()
  const onevent = () => future.resolve("a")

  this.addEventListener("a", onevent)
  const off = () => this.removeEventListener("a", onevent)
  
  return new Disposer(future.promise, off)
}

function waitB(): Disposer<Promise<"b">> {
  const future = new Future<"b">()
  const onevent = () => future.resolve()

  this.addEventListener("b", onevent)
  const off = () => this.removeEventListener("b", onevent)
  
  return new Disposer(future.promise, off)
}

async function wait() {
  using a = waitA()
  using b = waitB()

  const x: "a" | "b" = await Promise.race([a.get(), b.get()])

  /**
   * All listeners will be removed
   */
}
```
