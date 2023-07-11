import type { CounterProps } from './Counter';
import type { TypographyPlatforms, Size } from '~tokens/global';
import type { DotNotationSpacingStringToken } from '~utils/types';

import { size } from '~tokens/global';

type CounterMaxWidth = Size[100] | Size[120];

const verticalPadding: Record<NonNullable<CounterProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.0',
  medium: 'spacing.1',
  large: 'spacing.1',
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

export { maxWidth, verticalPadding, horizontalPadding };
