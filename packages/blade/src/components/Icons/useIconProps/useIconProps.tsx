import get from 'lodash/get';
import type { IconProps } from '..';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils';

const iconSize = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  '2xlarge': 32,
} as const;

function useIconProps({
  size,
  color,
}: IconProps): {
  height: `${typeof iconSize[keyof typeof iconSize]}px`;
  width: `${typeof iconSize[keyof typeof iconSize]}px`;
  iconColor: string;
} {
  const { theme } = useTheme();
  const height = makeSize(iconSize[size]);
  const width = makeSize(iconSize[size]);
  const iconColor = color === 'currentColor' ? 'currentColor' : get(theme.colors, color, '');

  return { height, width, iconColor };
}

export default useIconProps;
