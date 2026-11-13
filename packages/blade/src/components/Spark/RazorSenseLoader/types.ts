import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseLoaderProps = {
  /**
   * While true, the Razorpay glyph keeps looping. Set it to false when the page is ready: the glyph finishes the pass it's on,
   * grows, and everything fades to the plain background, as designed (3.5 to 8 seconds); then `onComplete` is called. If it
   * turns false before the splash has started drawing (its engine still loading), `onComplete` is called straight away.
   * It plays once per mount: once it's done, setting it back to true doesn't start it again (mount it again, with a new `key`,
   * to show the splash again).
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
   * Called once the splash has faded out completely (after `isLoading` turns false), so the page can take its place. From then
   * on it's invisible and lets clicks through, even if it stays mounted; unmount it here. To show the splash again, mount it
   * again (a new `key`).
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
} & Omit<RazorSenseDrawProps, 'isPaused' | 'scale'>;

export type { RazorSenseLoaderProps };
