## Component Name

RazorSenseGradient

## Description

RazorSenseGradient renders an animated WebGL fluid gradient clipped to an SVG mask shape. Pass SVG elements (path, g, circle, etc.) as children to define the visible area — the gradient fills those shapes. Works well with framer-motion SVG variants (`motion.path`, `motion.g`) for animated masks. Commonly used alongside RazorSense for icon/logo treatments in success and loading states.

## Important Constraints

- Children must be valid **SVG elements** (not HTML). They are placed inside an SVG `<mask>`.
- Shapes must use `fill="white"` to be visible through the gradient. Other fill values control opacity.
- The `viewBox` prop must match your SVG path's native coordinate system (defaults to `"0 0 24 24"`).
- The component only works on **web** (requires WebGL).
- The canvas is internally scaled 1.4x larger than the visible `size` to ensure the gradient fills edges — this is handled automatically.

## TypeScript Types

The following types represent the props that the RazorSenseGradient component accepts.

```ts
type RazorSenseGradientProps = {
  /**
   * SVG children define the mask shape.
   * Use SVG elements (path, g, circle, etc.) or framer-motion SVG
   * variants (motion.path, motion.g) directly.
   *
   * Shapes must use fill="white" to be visible through the gradient.
   * The coordinate space matches `viewBox` (defaults to "0 0 24 24").
   */
  children?: React.ReactNode;

  /** Side length of the square canvas in CSS pixels. Default: 200 */
  size?: number;

  /**
   * viewBox for the SVG mask coordinate space.
   * Match this to your path's native coordinate system.
   * Default: "0 0 24 24"
   */
  viewBox?: string;

  /**
   * Origin of the radial gradient in UV space.
   * [0, 0] = top-left, [0.5, 0.5] = center, [1, 1] = bottom-right.
   * Values outside [0,1] push the origin off-canvas.
   * Default: [0.5, 0.0]
   */
  origin?: [number, number];

  className?: string;
  style?: React.CSSProperties;
};
```

## Example

Here are examples demonstrating various ways to use the RazorSenseGradient component:

### Basic Static SVG Mask

Renders a fluid gradient clipped to a custom SVG path.

```jsx
import React from 'react';
import { RazorSenseGradient } from '@razorpay/blade/components';

const BasicExample = () => {
  return (
    <RazorSenseGradient size={100} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="white" />
    </RazorSenseGradient>
  );
};

export default BasicExample;
```

### Animated Mask with Framer Motion

Uses framer-motion SVG variants to animate the mask shape while the gradient plays.

```jsx
import React from 'react';
import { m as motion } from 'framer-motion';
import { RazorSenseGradient } from '@razorpay/blade/components';

const RayRotate = ({ isRunning = true }: { isRunning?: boolean }) => {
  return (
    <motion.g
      animate={isRunning ? 'start' : 'end'}
      variants={{
        start: {
          rotate: [0, 90],
          transition: {
            duration: 0.7,
            delay: 0.4,
            repeatDelay: 1.1,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          },
        },
        end: {
          rotate: 90,
          transition: { type: 'spring', stiffness: 300, damping: 40 },
        },
      }}
      initial="start"
      style={{ originX: '12px', originY: '12px' }}
    >
      <path
        d="M3 3H7.5H9.74999L12 12L14.25 3H16.5H21V7.5V9.75L12 12L21 14.25V16.5V21H16.5H14.25L12 12L9.74999 21H7.5H3V16.5V14.25L12 12L3 9.75V7.5V3Z"
        fill="white"
      />
    </motion.g>
  );
};

const AnimatedGradientIcon = () => {
  return (
    <RazorSenseGradient
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      size={50}
      viewBox="0 0 24 24"
      origin={[0.5, 0.5]}
    >
      <RayRotate isRunning={true} />
    </RazorSenseGradient>
  );
};

export default AnimatedGradientIcon;
```

### Combined with RazorSense

A common pattern — RazorSense provides the background animation while RazorSenseGradient renders an animated gradient icon on top.

```jsx
import React, { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import {
  RazorSense,
  RazorSenseGradient,
  preloadRazorSenseAssets,
  Box,
} from '@razorpay/blade/components';

const CombinedExample = () => {
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  useEffect(() => {
    preloadRazorSenseAssets('rippleWave')
      .then(() => setAssetsPreloaded(true))
      .catch(console.error);
  }, []);

  if (!assetsPreloaded) return <div>Loading...</div>;

  return (
    <Box position="relative" width="100%" height="100vh" backgroundColor="surface.background.gray.intense">
      {/* Background shader */}
      <Box position="absolute" top="0px" left="0px" right="0px" bottom="0px">
        <RazorSense width="100%" height="100%" preset="rippleWave" />
      </Box>

      {/* Gradient icon overlay */}
      <RazorSenseGradient
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        size={50}
        viewBox="0 0 24 24"
        origin={[0.5, 0.5]}
      >
        <path
          d="M3 3H7.5H9.74999L12 12L14.25 3H16.5H21V7.5V9.75L12 12L21 14.25V16.5V21H16.5H14.25L12 12L9.74999 21H7.5H3V16.5V14.25L12 12L3 9.75V7.5V3Z"
          fill="white"
        />
      </RazorSenseGradient>
    </Box>
  );
};

export default CombinedExample;
```
