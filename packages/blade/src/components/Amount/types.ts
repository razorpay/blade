import type { AmountProps } from './Amount';
import type { Theme } from '~components/BladeProvider';

export type StyledAmountProps = {
  size: NonNullable<AmountProps['size']>;
  theme: Theme;
};
