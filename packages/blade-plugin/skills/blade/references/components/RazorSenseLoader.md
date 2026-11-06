## Component Name

RazorSenseLoader

## Description

RazorSenseLoader is RazorSense's loading splash: the Razorpay glyph loops while the page loads; once it's ready, the glyph finishes its loop, grows, and everything fades to the plain background as designed, then `onComplete` is called. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- It fills its box, cropping the comp's edges to cover it: give it a sized container, such as a fixed full-screen `Box`.
- Once `isLoading` turns false it plays out at its own pace: the rest of the glyph's pass, then about 4 seconds of growing and fading (3.5 to 8 seconds in all). If the page is ready before the splash has drawn anything, `onComplete` is called straight away. In a hidden tab or a `display: none` box it still completes, a second after the splash would have ended.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Each still is its own small module, downloaded only then. The splash's still is the glyph, which fades out once `isLoading` turns false.
- With reduced motion on it shows the glyph still while loading, then completes as soon as `isLoading` turns false.
- `scale` is held between 0.75 and 1.25; a value outside that range is held at the nearest end, with a warning in development.
- Screen readers see it as a progress bar labelled by `accessibilityLabel` (default "Loading"), as `Spinner` is; it's hidden from them once it completes.
- `isPaused` only holds it while loading: once `isLoading` turns false it always plays out and calls `onComplete`.
- The engine and the splash's data load on demand (a dynamic import) the first time it renders.
- Its `ref`, `className` and `style` go to its root element (web).

## TypeScript Types

The following types represent the props that the RazorSenseLoader component accepts.

```ts
type RazorSenseLoaderProps = {
  /**
   * While true, the Razorpay glyph keeps looping. Set it to false when the page is ready: the glyph finishes the pass it's on,
   * grows, and everything fades to the plain background, as designed (3.5 to 8 seconds); then `onComplete` is called. If it
   * turns false before the splash has started drawing (its engine still loading), `onComplete` is called straight away.
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
   * Called once the animation is drawing (its engine loaded and running on the GPU).
   */
  onLoad?: () => void;
  /**
   * Called when it can't animate: no WebGL2, a GPU that only draws on the CPU (a software renderer), its engine failed to
   * load, or its frames are too slow on this device (under 20 a second for 3 seconds). It shows its still frame instead.
   */
  onError?: (error: Error) => void;
  /**
   * A class name for its root element (web).
   */
  className?: string;
  /**
   * Inline styles for its root element (web), merged over its own.
   */
  style?: React.CSSProperties;
} & TestID;
```

## Usage Guidelines

**Do**

- Show `RazorSenseLoader` full screen while the app's first data loads, and set `isLoading` to `false` the moment it's ready.
- Remove the splash in `onComplete`, after it has faded out, so the page never pops in under a half-faded splash.
- Let the theme decide light or dark by rendering it inside `BladeProvider`.

**Don't**

- Don't use it as an inline spinner for a section or a button; use `Spinner` for that.
- Don't unmount it the moment loading ends; it finishes its loop, grows and fades first.
- Don't use it on React Native; it's web only.

## Example

### Full-screen splash handing over to the page

The splash covers the page while it loads, then fades out and removes itself.

```jsx
import React from 'react';
import { Box, RazorSenseLoader } from '@razorpay/blade/components';

const App = ({ isDataReady, children }) => {
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
          <RazorSenseLoader isLoading={!isDataReady} onComplete={() => setIsSplashDone(true)} />
        </Box>
      )}
    </>
  );
};

export default App;
```
