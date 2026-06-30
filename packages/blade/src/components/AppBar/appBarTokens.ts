import type { AppBarProps } from './types';
import { size } from '~tokens/global';
import type { BaseBoxProps, SpacingValueType } from '~components/Box/BaseBox/types';

/**
 * Height of the AppBar bar.
 *
 * Maps to Figma frame height (`size[64]` → 64px).
 */
export const APP_BAR_HEIGHT = size[64];

/**
 * Surface background color per AppBar variant.
 *
 * - `neutral`: transparent surface (matches Figma — the AppBar has no background
 *   of its own and sits directly over the page). Foreground stays light via the
 *   forced dark color scheme so it remains legible over a dark page.
 * - `subtle`: gray surface that adapts to an embedded/light page context.
 */
export const APP_BAR_BACKGROUND_COLOR: Record<
  NonNullable<AppBarProps['variant']>,
  BaseBoxProps['backgroundColor']
> = {
  neutral: 'transparent',
  subtle: 'surface.background.gray.intense',
};

/**
 * Horizontal padding of the AppBar surface.
 *
 * Figma: 20px on mobile, 24px on desktop → `spacing.5` / `spacing.6`.
 */
export const APP_BAR_PADDING_X: BaseBoxProps['paddingX'] = {
  base: 'spacing.5',
  m: 'spacing.6',
};

/**
 * Vertical padding of the AppBar surface.
 *
 * Figma: 4px → `spacing.3` keeps the 64px height comfortable with the medium IconButton.
 */
export const APP_BAR_PADDING_Y: BaseBoxProps['paddingY'] = 'spacing.3';

/**
 * Gap between the back button and AppBarLeading content.
 *
 * Figma: 12px → `spacing.4`.
 */
export const APP_BAR_BACK_BUTTON_GAP: SpacingValueType = 'spacing.4';

/**
 * Gap between leading items (logo, title, badge).
 */
export const APP_BAR_LEADING_GAP: SpacingValueType = 'spacing.3';

/**
 * Gap between trailing action items.
 */
export const APP_BAR_ACTIONS_GAP: SpacingValueType = 'spacing.3';
