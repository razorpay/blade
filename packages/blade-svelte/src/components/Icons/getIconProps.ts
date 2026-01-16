import { getTokenCSSVariable } from '@razorpay/blade-core/utils';
import { iconSizeMap } from './iconSizeMap';
import type { IconSizeMapKey } from './iconSizeMap';
import type { IconColor, IconSize } from './types';

type GetIconPropsInput = {
  size?: IconSize;
  color?: IconColor;
};

type GetIconPropsReturn = {
  height: number;
  width: number;
  iconColor: string;
};

/**
 * Get icon props based on size and color
 * Matches React's useIconProps hook behavior
 *
 * @param size - Icon size token
 * @param color - Icon color token or 'currentColor'
 * @returns height, width, and iconColor values
 */
export function getIconProps({
  size = 'medium',
  color = 'surface.icon.gray.normal',
}: GetIconPropsInput): GetIconPropsReturn {
  const dimension = iconSizeMap[size as IconSizeMapKey];

  // If currentColor, use CSS currentColor (inherits from parent)
  // Otherwise, resolve the token to a CSS variable
  const iconColor = color === 'currentColor' ? 'currentColor' : getTokenCSSVariable(color);

  return {
    height: dimension,
    width: dimension,
    iconColor,
  };
}
