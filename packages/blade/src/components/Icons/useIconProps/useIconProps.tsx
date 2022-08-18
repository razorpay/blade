import get from 'lodash/get';
import type { IconProps } from '..';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils';

const iconSize = {
  xxsmall: 8,
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
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
  const iconColor = get(theme.colors, color, '');

  return { height, width, iconColor };
}

export default useIconProps;
