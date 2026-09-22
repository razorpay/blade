import type { DotLoaderSize } from '@razorpay/blade-core/styles';
import type { IconColor } from '../Icons/types';

export type DotLoaderProps = {
  /**
   * Color token for the dots. Defaults to `currentColor` when not set, so the
   * loader inherits the color of whatever it is rendered inside.
   */
  color?: IconColor;
  /**
   * Size of the loader. `large` is the same loader scaled 1.5x, for hosts tall
   * enough that the default reads as undersized (the 48px large Button).
   *
   * @default 'medium'
   */
  size?: DotLoaderSize;
  /**
   * When provided, the loader is exposed to assistive tech as a `status` region
   * with this label. Leave it unset when the surrounding component already
   * announces its loading state (as `Button` does) so screen readers do not
   * hear it twice.
   */
  accessibilityLabel?: string;
  /** Additional class names applied to the loader root. */
  className?: string;
};
