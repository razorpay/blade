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
   * load, its frames are too slow on this device even at its lowest step (under 20 a second for 3 seconds, counted after its
   * first 2), or the browser took its GPU context back. It shows its still frame instead. Too slow counts for the whole page:
   * once one RazorSense 2.0 animation finds that, every one on the page shows its still, including ones mounted later, until
   * the page reloads. Before that, a device that can't keep up (under 45 a second) steps down page-wide: every other frame, then
   * a lower sharpness too.
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

/**
 * The states RazorSense 2.0 takes from the page, with the same names as Ray's, so a page passes one set to both. Each has its own way
 * in and out, and turns back mid-way from wherever it is. One at a time: offline wins over listening (it goes at once).
 */
type RazorSenseStateProps = {
  /**
   * While true, RazorSense goes away (the app is offline): on a landing it fades away under its colours, under a chat input it
   * drops below the page's edge. Back to false, it comes back the same way.
   * @default false
   */
  isOffline?: boolean;
  /**
   * While true, RazorSense listens: it morphs into its voice look, a row of blobs moving with `voiceStream`'s voice (each a pitch
   * band of it), breathing while it's silent. Back to false, it morphs back.
   * @default false
   */
  isListening?: boolean;
  /**
   * The page's own microphone stream while it listens (the one it already has for its dictation). RazorSense only reads its levels,
   * once a frame, and never opens the microphone itself. Without it, the voice look shows as it does in silence.
   */
  voiceStream?: MediaStream;
};

export type { RazorSenseDrawProps, RazorSenseStateProps };
