## Spark Animation

## Description

Spark Animation is a specialized compatibility pattern that combines a managed RazorSense branded preset with a separately animated RazorSenseGradient mask. Retain it when the authored two-layer composition itself is required. For semantic product state, AI chat, loading, success, caution, failure, interruption, or multi-step journeys, fetch and use the **RazorSense Journeys** pattern instead.

RazorSense owns its renderer readiness and fallback. A consumer may speculatively preload one probable target, but must not hide the component behind an asset-ready flag, add an opacity wrapper, seek media, or coordinate cleanup. The surrounding icon animation remains independent and cannot be the only product status.

For detailed props and individual usage, refer to the component docs:

- **RazorSense** — managed branded material (`rippleWave`, `bottomWave`, `success`, `compactLoader`, `audioWave`)
- **RazorSenseGradient** — Animated gradient clipped to SVG mask shapes (children must use `fill="white"`)

## Components Used

- RazorSense
- RazorSenseGradient
- preloadRazorSenseTarget
- Box
- Button
- Typography (Heading, Text)
- Icons (CheckIcon)
- framer-motion (motion)

## Example

### Ripple Wave with Animated Gradient Icon

A full-screen ripple wave background with an animated RazorSenseGradient icon centered on top — useful for branded loading or transition states.

```tsx
import React, { useEffect } from 'react';
import { m as motion } from 'framer-motion';
import {
  RazorSense,
  RazorSenseGradient,
  preloadRazorSenseTarget,
  Box,
} from '@razorpay/blade/components';

const RippleWaveScreen = () => {
  useEffect(() => {
    void preloadRazorSenseTarget({ preset: 'rippleWave' });
  }, []);

  return (
    <Box
      position="relative"
      width="100%"
      height="100vh"
      backgroundColor="surface.background.gray.intense"
    >
      {/* Layer 1: Full-screen ripple wave background */}
      <Box position="absolute" top="0px" left="0px" right="0px" bottom="0px">
        <RazorSense width="100%" height="100%" preset="rippleWave" playback="loop" />
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

This compatibility pattern permits:

- speculative target preload without delaying mount;
- managed RazorSense playback and fallback;
- a separate RazorSenseGradient icon overlay;
- SVG children with `fill="white"` and independent Framer Motion mask animation.

It does not permit manual opacity transitions around RazorSense, `circleSlideUp` in new code, timer-driven product truth, or using the animated material/icon as the only loading or result signal.
