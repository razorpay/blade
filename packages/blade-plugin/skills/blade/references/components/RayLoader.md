## Component Name

RayLoader

## Description

RayLoader is the Ray loader (secondary): Ray, Razorpay's AI mascot, charges up and dashes across the loader's box while a page loads, and when it's ready he slides on, turns round, jumps and drops through the floor, then `onComplete` is called. Its props mirror RazorSenseLoader's (`isLoading`, `onComplete`), so the two loaders read the same. Use it where a page loads an AI surface, in place of a ripple loader.

## Important Constraints

- `RayLoader` is **web only**; on React Native it throws "not yet implemented".
- It plays once per mount: after `onComplete`, setting `isLoading` back to `true` doesn't bring him back. Mount it again with a new `key` to show it again.
- His path runs across the box's width, so give it a width (it fills its parent by default) and leave the default height unless the layout needs another: the default fits his charge, his jump and his drop through the floor.
- Unmount it in `onComplete` (or swap it for the page's content then).

## TypeScript Types

The following types represent the props that the RayLoader component accepts.

```typescript
type RayLoaderProps = {
  /**
   * While `true` Ray charges up and dashes, and holds the dash while the page loads. Set it to `false` when the page is ready: he
   * slides on, turns round, jumps and drops through the floor, then `onComplete` is called. It plays once per mount: once he's
   * gone, setting it back to `true` doesn't bring him back (mount it again, with a new `key`). If it turns `false` before he has
   * started (his film still loading), `onComplete` is called straight away. The same prop as RazorSenseLoader's.
   *
   * @default true
   */
  isLoading?: boolean;
  /**
   * Called once he has dropped through the floor (after `isLoading` turns `false`), so the page can take the loader's place. The
   * same prop as RazorSenseLoader's.
   */
  onComplete?: () => void;
  /**
   * His width: `small` 38px, `medium` 48px (as on the dashboard), the same sizes as Ray's. His path across the loader's box scales
   * with the box's width.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * Width of the loader's box: his path runs across it.
   *
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the loader's box. By default it's what his charge, his jump and his drop through the floor need at his size.
   */
  height?: string | number;
  /**
   * What screen readers announce: the loader is exposed as a progress bar, as Spinner is.
   *
   * @default 'Loading'
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Show it while an AI surface loads, and set `isLoading={false}` when its data is in; swap in the content from `onComplete`.
- Use `size="medium"` on the dashboard and full-page chat, `size="small"` in side panels, as with Ray.
- Keep `accessibilityLabel` meaningful when the default "Loading" isn't specific enough ("Loading your settlements").

**Don't**

- Don't use it for non-AI loading; use `Spinner` or `ProgressBar`.
- Don't put it inside a container narrower than about six of his widths: his dash needs room to run.
- Don't show it and RazorSenseLoader at the same time for the same load.

## Example

### Loading A Page

The page shows the Ray loader until its data is in; he finishes his dash and the content takes his place.

```jsx
import React, { useEffect, useState } from 'react';
import { Box, RayLoader, Text } from '@razorpay/blade/components';

const PageWithRayLoader = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoaderDone, setIsLoaderDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000); // the page's data coming in
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box width="100%" maxWidth="720px">
      {isLoaderDone ? (
        <Text>Your settlements are ready.</Text>
      ) : (
        <RayLoader
          isLoading={!isReady}
          onComplete={() => setIsLoaderDone(true)}
          accessibilityLabel="Loading your settlements"
        />
      )}
    </Box>
  );
};

export default PageWithRayLoader;
```
