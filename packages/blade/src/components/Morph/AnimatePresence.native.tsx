import React from 'react';

/**
 * Native passthrough for framer-motion's `AnimatePresence`.
 *
 * React Native has no framer-motion runtime, so there is no exit-animation
 * choreography here — children simply mount/unmount instantly. This keeps
 * `Morph.stories.tsx` bundle-safe on Metro (framer-motion is web-only) while
 * preserving the same import site across platforms.
 */
const AnimatePresence = ({ children }: { children?: React.ReactNode }): React.ReactElement => {
  return <>{children}</>;
};

export { AnimatePresence };
