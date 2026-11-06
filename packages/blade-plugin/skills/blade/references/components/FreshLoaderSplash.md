## Component Name

FreshLoaderSplash

## Description

FreshLoaderSplash is RazorSense's loading splash: the Razorpay glyph loops while the page loads, then grows and fades to the plain background and calls `onComplete`. It is one of the Fresh RazorSense components, which ship next to RazorSense (unchanged) and follow Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- It fills its box, cropping the comp's edges to cover it: give it a sized container, such as a fixed full-screen `Box`.
- `scale` is held between 0.75 and 1.25; a value outside that range is held at the nearest end, with a warning in development.
- Without WebGL2, or with reduced motion on, it shows the plain background and calls `onComplete` as soon as `isLoading` turns false.
- Screen readers see it as a progress bar labelled by `accessibilityLabel` (default "Loading"), as `Spinner` is.
- `isPaused` only holds it while loading: once `isLoading` turns false it always plays out and calls `onComplete`.
- The engine and the splash's data load on demand (a dynamic import) the first time it renders.

## TypeScript Types

The following types represent the props that the FreshLoaderSplash component accepts.

```ts
type FreshLoaderSplashProps = {
  /**
   * While true, the Razorpay glyph keeps looping. Set it to false when the page is ready: the glyph finishes its loop,
   * grows, and everything fades to the plain background; then `onComplete` is called.
   * @default true
   */
  isLoading?: boolean;
  /**
   * Holds the animation where it is while loading. Once `isLoading` turns false the splash always plays out and calls
   * `onComplete`, so a pause never holds the page up.
   * @default false
   */
  isPaused?: boolean;
  /**
   * The splash bigger or smaller inside its box (the glyph and everything round it). Held between 0.75 and 1.25.
   * @default 1
   */
  scale?: number;
  /**
   * What screen readers announce: the splash is exposed as a progress bar, as Spinner is.
   * @default 'Loading'
   */
  accessibilityLabel?: string;
  /**
   * Called once the splash has faded out completely (after `isLoading` turns false), so the page can take its place.
   */
  onComplete?: () => void;
  /**
   * Width of the splash. It fills its box and crops the comp's edges to cover it.
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the splash.
   * @default '100%'
   */
  height?: string | number;

  /**
   * Called once the animation is drawing (its engine loaded and running on the GPU)
   */
  onLoad?: () => void;

  /**
   * Called when it can't draw: no WebGL2, a GPU that only draws on the CPU (a software renderer), or its engine failed to
   * load. The component then shows as the page would without it
   */
  onError?: (error: Error) => void;
} & TestID;
```

## Usage Guidelines

**Do**

- Show `FreshLoaderSplash` full screen while the app's first data loads, and set `isLoading` to `false` when it's ready.
- Remove the splash in `onComplete`, after it has faded out, so the page never pops in under a half-faded splash.
- Let the theme decide light or dark by rendering it inside `BladeProvider`.

**Don't**

- Don't use it as an inline spinner for a section or a button; use `Spinner` for that.
- Don't unmount it the moment loading ends; the glyph finishes its loop and fades first.
- Don't use it on React Native; it's web only.

## Example

### Full-screen splash handing over to the page

The splash covers the page while it loads, then fades out and removes itself.

```jsx
import React from 'react';
import { Box, FreshLoaderSplash } from '@razorpay/blade/components';

const AppShell = ({ isReady, children }) => {
  const [isSplashDone, setIsSplashDone] = React.useState(false);
  return (
    <>
      {children}
      {isSplashDone ? null : (
        <Box
          position="fixed"
          top="spacing.0"
          left="spacing.0"
          width="100%"
          height="100%"
          zIndex={1000}
        >
          <FreshLoaderSplash isLoading={!isReady} onComplete={() => setIsSplashDone(true)} />
        </Box>
      )}
    </>
  );
};

export default AppShell;
```
