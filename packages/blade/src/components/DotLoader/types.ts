import type { dotLoaderGeometry } from './dotLoaderTokens';
import type { IconColors } from '~components/Icons';
import type { TestID } from '~utils/types';

export type DotLoaderSize = keyof typeof dotLoaderGeometry;

export type DotLoaderProps = {
  /**
   * Size of the loader. `large` is the same loader scaled 1.5x, for hosts tall
   * enough that the default reads as undersized (the 48px `large` Button).
   *
   * @default 'medium'
   */
  size?: DotLoaderSize;
  /**
   * Color token for the dots.
   *
   * Restricted to icon tokens because the dots are a foreground mark that reads
   * like an icon glyph — background or border tokens are never a meaningful fill
   * for them, and the narrower union keeps the Svelte and React APIs identical.
   *
   * @default 'interactive.icon.gray.muted'
   */
  color?: IconColors;
  /**
   * When provided, the loader is exposed to assistive tech as a `status` region
   * with this label. Leave it unset when the surrounding component already
   * announces its loading state (as `Button` does) so screen readers do not hear
   * it twice.
   */
  accessibilityLabel?: string;
} & TestID;
