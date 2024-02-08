# Disposer

Helpers for Disposable

```bash
npm i @hazae41/disposer
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/disposer)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Create a disposable object from any object
- Create a thenable disposable object from a thenable object
- Race multiple thenable and disposable objects

## Usage

### Create a disposable object (Disposable or AsyncDisposable) from any object

```tsx
using d = new Disposer(something, () => { ... })
```

```tsx
await using d = new AsyncDisposer(something, async () => { ... })
```

This can be useful for waiting for multiple listeners, and remove all listeners when one of them is triggered

```tsx
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
