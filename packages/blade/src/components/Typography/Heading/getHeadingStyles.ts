import type { CSSObject } from 'styled-components';
import getBaseTextStyles from '../BaseText/getBaseTextStyles';
import type { HeadingProps } from './Heading';
import { getHeadingProps } from './Heading';
import type { Theme } from '~components/BladeProvider';

const getHeadingStyles = ({
  weight,
  size,
  theme,
  color,
}: Pick<HeadingProps, 'weight' | 'size' | 'color'> & {
  theme: Theme;
}): CSSObject => {
  return getBaseTextStyles({ ...getHeadingProps({ weight, size, color }), theme });
};

export default getHeadingStyles;
