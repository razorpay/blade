import get from 'lodash/get';
import type { IconProps } from '..';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import { makeSize } from '~utils/makeSize';

const iconSize = {
  xsmall: size[8],
  small: size[12],
  medium: size[16],
  large: size[20],
  xlarge: size[24],
  '2xlarge': size[32],
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
