import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type RayLoaderProps = {
  /**
   * While `true` Ray charges up and dashes, and holds the dash while the page loads. Set it to `false` when the page is ready: he
   * slides on, turns round, jumps and drops through the floor, then `onComplete` is called. It plays once per mount: once he's
   * gone, setting it back to `true` doesn't bring him back (mount it again, with a new `key`). If it turns `false` before he has
   * started (his film still loading), `onComplete` is called straight away. The same prop as RazorSenseLoader's.
   *
   * @default true
   */
  isLoading?: boolean;
  /**
   * Called once he has dropped through the floor (after `isLoading` turns `false`), so the page can take the loader's place. The
   * same prop as RazorSenseLoader's.
   */
  onComplete?: () => void;
  /**
   * His width: `small` 38px, `medium` 48px (as on the dashboard), the same sizes as Ray's. His path across the loader's box scales
   * with the box's width.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * Width of the loader's box: his path runs across it.
   *
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the loader's box. By default it's what his charge, his jump and his drop through the floor need at his size.
   */
  height?: string | number;
  /**
   * What screen readers announce: the loader is exposed as a progress bar, as Spinner is.
   *
   * @default 'Loading'
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { RayLoaderProps };
