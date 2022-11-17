import type { CounterProps } from './Counter';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

type BadgeMaxWidth = 100 | 120;

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

const maxWidth: Record<NonNullable<TypographyPlatforms>, BadgeMaxWidth> = {
  onMobile: 100,
  onDesktop: 120,
};

export { maxWidth, verticalPadding, horizontalPadding };
