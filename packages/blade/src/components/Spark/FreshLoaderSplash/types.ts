import type { TestID } from '~utils/types';

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
   * Called once the animation is drawing (its engine loaded and running on the GPU).
   */
  onLoad?: () => void;
  /**
   * Called when it can't draw: no WebGL2, a GPU that only draws on the CPU (a software renderer), or its engine failed to
   * load. The component then shows as the page would without it.
   */
  onError?: (error: Error) => void;
} & TestID;

export type { FreshLoaderSplashProps };
