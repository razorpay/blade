import type React from 'react';
import type { TestID } from '~utils/types';

/** The props every RazorSense 2.0 component takes (RazorSenseLoader has its own `isPaused` and `scale`) */
type RazorSenseDrawProps = {
  /**
   * Holds the animation where it is.
   * @default false
   */
  isPaused?: boolean;
  /**
   * The whole effect bigger or smaller, bands included. Held between 0.75 and 1.25.
   * @default 1
   */
  scale?: number;
  /**
   * Called once the animation is drawing (its engine loaded and running on the GPU).
   */
  onLoad?: () => void;
  /**
   * Called when it can't animate: no WebGL2, a GPU that only draws on the CPU (a software renderer), its engine failed to
   * load, its frames are too slow on this device (under 20 a second for 3 seconds, counted after its first 2; once one RazorSense
   * animation finds that, the others on the page go to their stills too), or the browser took its GPU context back. It shows
   * its still frame instead.
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

export type { RazorSenseDrawProps };
