import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseSuccessProps = {
  /**
   * Text under the badge (Blade's large heading), coming in as the badge pops in; any text. Without it, the badge alone.
   */
  label?: string;
  /**
   * What screen readers announce: the badge is exposed as an image with this name. As the badge pops in, its `label` (or this,
   * without one) is announced politely.
   * @default 'Success'
   */
  accessibilityLabel?: string;
  /**
   * Called once it has played out (about 5 seconds: the orb rises, Blade's success badge pops in where it is, its tick turns into
   * the badge's check and its label comes in). The badge and label stay. It plays once per mount: mount it again, with a new `key`, to play it again.
   */
  onComplete?: () => void;
  /**
   * Called once its orb is showing: its first frame drawn on the GPU. Not called when it can't animate or with reduced motion:
   * then the badge shows alone.
   */
  onLoad?: () => void;
  /**
   * Called when it can't animate: no WebGL2, a GPU that only draws on the CPU (a software renderer), its engine failed to load, its
   * first frame didn't come, or the browser took its GPU context back. Blade's success badge and its check pop in alone instead.
   */
  onError?: (error: Error) => void;
} & Omit<RazorSenseDrawProps, 'scale' | 'onLoad' | 'onError'>;

export type { RazorSenseSuccessProps };
