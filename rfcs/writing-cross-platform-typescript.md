# Writing Cross Platform TypeScript 

This document outlines few guidelines for writing cross platform types internal to blade

Currently Blade uses TypeScript 4.7 to provide better DX to platform specific consumers like `web` or `native`

## Our Goals

- TypeScript 4.7+ versioned consumers should get correct type defs depending on their projects 
- Ensure backward compatibility with older versions of TypeScript
- Provide some standard type utilities to help write cross platform types for blade developers 

## The Build Process 

1. Generate types for web/native with `tsconfig` specific to platform
2. Copy types for web/native into `build`
3. Output and bundle both types into `build` folder with rollup

In step `1` it is important to exclude other platform's files. For example if we are building for `web` we should ignore `.native` files. 

## Backward Compatibility

To ensure that our types work in older TypeScript version we outputed our `.web` targetted types from rollup to emit `index.d.ts` file instead of `index.web.d.ts`. 
This way even on older version TypeScript can pick up `index.d.ts` file which will give users `web` types only. 

And for native we are emitting `index.native.d.ts` which TypeScript 4.7+ will pick it up based on `moduleSuffixes` option in `tsconfig.json`

## Blade DX 

With this system in place, blade developers have to be bit more deligent while writing types. 

Tips: 

1. If you have platform specific types or files ensure they are properly suffixed `.native` & `.web`
2. If you don't have `filename.web.ts` suffix then unsuffixed `filename.ts` will picked up.

### Writing Types For Components

To ease the pain of writing cross-platform types we've added few utilities `Platform.Select`, `Platform.CastWe` `Platform.CastNative`

When writing cross-platform component which has no platform suffix and you need to switch between types on correct platform use the `Platform.Select` utility.

```tsx
// blade internal
type ButtonProps = {
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
}

const Button = (props: ButtonProps) => {
  return <>
}

// consumer end: on native `e` is GestureResponderEvent
<Button onClick={e => {}} />

// consumer end: on web `e` is MouseEvent
<Button onClick={e => {}} />
```

In rare cases we need to cast to web or native types to ensure there are no platform specific erorrs, especially happens with `styled-component` types in those cases use `Platform.Cast*` types.

```ts
// blade internal: 
type ButtonProps = {
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
}

// blade internal: web.ts
const Styled = styled.div();
<Styled onClick={onClick as Platform.CastNative<typeof onClick>} />

// blade internal: native.ts
const Styled = styled.div();
<Styled onClick={onClick as Platform.CastWeb<typeof onClick>} />
```

**Module Resolution Examples:**

Here are few examples of module resolution. We should avoid few of these patterns see below: 

**Example 1:**

- Button.web.ts
- Button.native.ts

`.web` & `.native` platforms will be independantly pick the types. 

> **Note**
> Recommended, prefer explicit platform specific files

---

**Example 2**

- Button.ts
- Button.native.ts

For web the unsuffixed `Button.ts` will be taken. 
For native the `.native` file

> **Note**
> Okay but better to suffix when you know `Button.ts` is gonna be picked for web

---

**Example 3**

- Button.ts
- Button.web.ts

For native the unsuffixed `Button.ts` will be taken. 
For web the `.web` file

> **Note**
> HIGHLY not recommended, this will cause lot of confusion

---

**Example 4:**

- Button.ts

For both platforms Button.ts will be taken. 

> **Note**
> Okay, but blade developers have to make sure that all types work in both platforms.

---
