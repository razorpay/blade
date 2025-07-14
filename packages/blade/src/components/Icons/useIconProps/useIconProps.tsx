import type { IconProps } from '..';
import { iconSizeMap } from './iconSizeMap';
import get from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';

function useIconProps({
  size = 'medium',
  color = 'surface.icon.gray.normal',
}: IconProps): {
  height: `${typeof iconSizeMap[keyof typeof iconSizeMap]}px`;
  width: `${typeof iconSizeMap[keyof typeof iconSizeMap]}px`;
  iconColor: string;
} {
  const { theme } = useTheme();
  const height = makeSize(iconSizeMap[size]);
  const width = makeSize(iconSizeMap[size]);
  const iconColor = color === 'currentColor' ? 'currentColor' : get(theme.colors, color, '');

  return { height, width, iconColor };
}

const useIconProps = assignWithoutSideEffects(_useIconProps, {
  componentId: 'useIconProps',
});

export default useIconProps;
