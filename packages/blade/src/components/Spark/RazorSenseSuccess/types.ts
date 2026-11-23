import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseSuccessProps = {
  /**
   * What screen readers announce: the badge is exposed as an image with this name.
   * @default 'Success'
   */
  accessibilityLabel?: string;
  /**
   * Called once it has played out (about 5 seconds: the orb rises, Blade's success badge pops in where it is and its tick turns
   * into the badge's check). The badge stays. It plays once per mount: mount it again, with a new `key`, to play it again.
   */
  onComplete?: () => void;
} & Omit<RazorSenseDrawProps, 'scale'>;

export type { RazorSenseSuccessProps };
