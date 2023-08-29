# Cleaner

Helpers for Disposable

```bash
npm i @hazae41/cleaner
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/cleaner)

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

### Create a thenable disposable object from a thenable object (PromiseLike)

```tsx
using d = new PromiseDisposer(doSomethingAsync(), () => { ... })

await d
```

```tsx
await using d = new AsyncPromiseDisposer(doSomethingAsync(), async () => { ... })

await d
```

### Race multiple thenable and disposable objects (PromiseLike & Disposable)

```tsx
/**
 * Will dispose both a and b once one of them settles
 **/
await Disposable.race([a, b])
```

This can be useful for waiting for multiple listeners, and remove all listeners when one of them is triggered

```tsx
function waitA(): PromiseLike<"a"> & Disposable {
  const future = new Future<"a">()
  const onevent = () => future.resolve("a")

  this.addEventListener("a", onevent)
  const off = () => this.removeEventListener("a", onevent)
  
  return new PromiseDisposer(future.promise, off)
}

function waitB(): PromiseLike<"b"> & Disposable {
  const future = new Future<"b">()
  const onevent = () => future.resolve()

  this.addEventListener("b", onevent)
  const off = () => this.removeEventListener("b", onevent)
  
  return new PromiseDisposer(future.promise, off)
}

/**
 * When one listener is triggered, the other is removed
 **/
const x: "a" | "b" = await Disposable.race([waitA(), waitB()])
```
