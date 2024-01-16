import type { CSSObject } from 'styled-components';
import getBaseTextStyles from '../BaseText/getBaseTextStyles';
import type { TextProps, TextVariant } from './Text';
import { getTextProps } from './Text';
import type { Theme } from '~components/BladeProvider';

const getTextStyles = <T extends { variant: TextVariant }>({
  variant,
  weight,
  size,
  theme,
  color,
}: Pick<TextProps<T>, 'variant' | 'weight' | 'size' | 'color'> & {
  theme: Theme;
}): CSSObject => {
  return getBaseTextStyles({ ...getTextProps({ variant, weight, size, color }), theme });
};

export default getTextStyles;
