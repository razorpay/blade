import { get } from 'lodash';
import type { IconProps, IconSize } from '..';
import { useTheme } from '~components/BladeProvider';

type Dimension = '10px' | '12px' | '16px' | '20px' | '24px' | '32px';

const getIconDimensions = ({
  size,
}: {
  size: IconSize;
}): { width: Dimension; height: Dimension } => {
  switch (size) {
    case 'xlarge':
      return { width: '32px', height: '32px' };
    case 'large':
      return { width: '24px', height: '24px' };
    case 'medium':
      return { width: '20px', height: '20px' };
    case 'small':
      return { width: '16px', height: '16px' };
    case 'xsmall':
      return { width: '12px', height: '12px' };
    case 'xxsmall':
      return { width: '10px', height: '10px' };
    default:
      return { width: '20px', height: '20px' };
  }
};

function useIconProps({
  size,
  color,
}: IconProps): { height: string; width: string; iconColor: string } {
  const { theme } = useTheme();
  const { height, width } = getIconDimensions({ size });
  const iconColor = get(theme.colors, color, '');

  return { height, width, iconColor };
}

export default useIconProps;
