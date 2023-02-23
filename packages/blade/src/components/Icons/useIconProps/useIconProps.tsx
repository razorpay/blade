import get from 'lodash/get';
import type { IconProps } from '..';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils';
import sizes from '~tokens/global/sizes';

const iconSize = {
  xsmall: sizes[200],
  small: sizes[300],
  medium: sizes[400],
  large: sizes[500],
  xlarge: sizes[600],
  '2xlarge': sizes[800],
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
