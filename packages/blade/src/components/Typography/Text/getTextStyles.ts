import type { CSSObject } from 'styled-components';
import getBaseTextStyles from '../BaseText/getBaseTextStyles';
import type { TextProps, TextVariant } from './Text';
import { getTextProps } from './Text';
import type { Theme } from '~components/BladeProvider';

const getTextStyles = <T extends { variant: TextVariant }>({
  variant,
  type,
  weight,
  size,
  contrast,
  theme,
}: Pick<TextProps<T>, 'type' | 'variant' | 'weight' | 'size' | 'contrast'> & {
  theme: Theme;
}): CSSObject => {
  return getBaseTextStyles({ ...getTextProps({ variant, type, weight, size, contrast }), theme });
};

export default getTextStyles;
