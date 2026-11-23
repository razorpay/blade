import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseSuccessProps = {
  /**
   * Text under the badge (Blade's large heading), coming in as the badge pops in; any text. Without it, the badge alone.
   */
  label?: string;
  /**
   * What screen readers announce: the badge is exposed as an image with this name.
   * @default 'Success'
   */
  accessibilityLabel?: string;
  /**
   * Called once it has played out (about 5 seconds: the orb rises, Blade's success badge pops in where it is, its tick turns into
   * the badge's check and its label comes in). The badge and label stay. It plays once per mount: mount it again, with a new `key`, to play it again.
   */
  onComplete?: () => void;
} & Omit<RazorSenseDrawProps, 'scale'>;

export type { RazorSenseSuccessProps };
