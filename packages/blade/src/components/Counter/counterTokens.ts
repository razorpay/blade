import type { CounterProps } from './Counter';
import type { TypographyPlatforms, Size } from '~tokens/global';
import type { DotNotationSpacingStringToken } from '~utils/types';

import { size } from '~tokens/global';

type CounterMaxWidth = Size[100] | Size[120];

const counterHeight: Record<NonNullable<CounterProps['size']>, number> = {
  small: size[16],
  medium: size[20],
  large: size[24],
};

const horizontalPadding: Record<
  NonNullable<CounterProps['size']>,
  DotNotationSpacingStringToken
> = {
  small: 'spacing.2',
  medium: 'spacing.3',
  large: 'spacing.3',
};

const maxWidth: Record<NonNullable<TypographyPlatforms>, CounterMaxWidth> = {
  onMobile: size[100],
  onDesktop: size[120],
};

export { maxWidth, counterHeight, horizontalPadding };
