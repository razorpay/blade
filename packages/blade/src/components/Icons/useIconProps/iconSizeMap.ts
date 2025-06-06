import { size } from '~tokens/global';

const iconSizeMap = {
  xsmall: size[8],
  small: size[12],
  medium: size[16],
  large: size[20],
  xlarge: size[24],
  '2xlarge': size[32],
} as const;

export { iconSizeMap };
