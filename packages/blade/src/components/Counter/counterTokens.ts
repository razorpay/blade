import type { CounterProps } from './Counter';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';
import sizes, { Sizes } from '~tokens/global/sizes';

type CounterMaxWidth = Sizes[2000] | Sizes[2050];

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
  onMobile: sizes[2000],
  onDesktop: sizes[2050],
};

export { maxWidth, verticalPadding, horizontalPadding };
