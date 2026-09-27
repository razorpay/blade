## Spark Animation

## Description

The Spark Animation pattern combines RazorSense (WebGL glass refraction) and RazorSenseGradient (animated gradient mask) to create rich, animated visual treatments for success states, loading screens, and branded moments. RazorSense provides the full-screen or contained background animation while RazorSenseGradient renders a fluid gradient clipped to an SVG icon/logo shape on top. Assets should always be preloaded before mounting to avoid visible loading artifacts.

For detailed props and individual usage, refer to the component docs:
- **RazorSense** — WebGL background animation with presets (`default`, `zoomed`, `bottomWave`, `rippleWave`, `circleSlideUp`)
- **RazorSenseGradient** — Animated gradient clipped to SVG mask shapes (children must use `fill="white"`)

## Components Used
- RazorSense
- RazorSenseGradient
- preloadRazorSenseAssets
- Box
- Button
- Typography (Heading, Text)
- Icons (CheckIcon)
- framer-motion (motion)

## Example

### Ripple Wave with Animated Gradient Icon

A full-screen ripple wave background with an animated RazorSenseGradient icon centered on top — useful for branded loading or transition states.

```tsx
import React, { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import {
  RazorSense,
  RazorSenseGradient,
  preloadRazorSenseAssets,
  Box,
} from '@razorpay/blade/components';

const RippleWaveScreen = () => {
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  useEffect(() => {
    preloadRazorSenseAssets('rippleWave')
      .then(() => setAssetsPreloaded(true))
      .catch(console.error);
  }, []);

  if (!assetsPreloaded) return <div>Loading...</div>;

  return (
    <Box position="relative" width="100%" height="100vh" backgroundColor="surface.background.gray.intense">
      {/* Layer 1: Full-screen ripple wave background */}
      <Box position="absolute" top="0px" left="0px" right="0px" bottom="0px">
        <RazorSense width="100%" height="100%" preset="rippleWave" />
      </Box>

      {/* Layer 2: Centered animated gradient icon */}
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
        <motion.g
          animate={{ rotate: [0, 90] }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            repeatDelay: 1.1,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{ originX: '12px', originY: '12px' }}
        >
          <path
            d="M3 3H7.5H9.74999L12 12L14.25 3H16.5H21V7.5V9.75L12 12L21 14.25V16.5V21H16.5H14.25L12 12L9.74999 21H7.5H3V16.5V14.25L12 12L3 9.75V7.5V3Z"
            fill="white"
          />
        </motion.g>
      </RazorSenseGradient>
    </Box>
  );
};

export default RippleWaveScreen;
```

This pattern showcases:
- Preloading assets with `preloadRazorSenseAssets()` before mounting to avoid frame skipping
- Layering RazorSense as a background with RazorSenseGradient as a foreground icon overlay
- Different presets for different contexts: `circleSlideUp` for success, `rippleWave` for loading/transitions, `bottomWave` for decorative strips
- SVG children in RazorSenseGradient with `fill="white"` and framer-motion animation
