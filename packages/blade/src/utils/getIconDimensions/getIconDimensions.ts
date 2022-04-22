import type { IconSize } from '../../components/Icons';

type Dimension = 10 | 12 | 16 | 20 | 24 | 32;

const getIconDimensions = ({
  size,
}: {
  size: IconSize;
}): { width: Dimension; height: Dimension } => {
  switch (size) {
    case 'xlarge':
      return { width: 32, height: 32 };
    case 'large':
      return { width: 24, height: 24 };
    case 'medium':
      return { width: 20, height: 20 };
    case 'small':
      return { width: 16, height: 16 };
    case 'xsmall':
      return { width: 12, height: 12 };
    case 'xxsmall':
      return { width: 10, height: 10 };
    default:
      return { width: 20, height: 20 };
  }
};

export default getIconDimensions;
