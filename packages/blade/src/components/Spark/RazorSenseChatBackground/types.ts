import type React from 'react';
import type { TestID } from '~utils/types';

type RazorSenseChatBackgroundProps = {
  /**
   * The chat input it sits behind (flow 9's landing). The strip stretches to the input's width and height, the bands keeping
   * their size, and its glow spills outside it. Fits chat inputs 280-1260 px wide (a phone's, up to 1.5x flow 9's 840) and
   * 58-320 px tall (growing with lines or attachments); past those it stretches as for the nearest end, centred on the input.
   * Typing in it (any input, textarea or editable element inside) pulses the strip into its typing surge; it dies back down when
   * the typing stops. What's typed is never read.
   */
  children: React.ReactNode;
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

export type { RazorSenseChatBackgroundProps };
