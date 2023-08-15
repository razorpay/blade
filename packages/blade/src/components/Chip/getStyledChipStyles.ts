import type { CSSObject } from 'styled-components';
import getIn from 'lodash/get';
import type { StyledChipProps } from './types';
import { makeBorderSize } from '~utils/makeBorderSize';

const getStyledChipStyles = ({ theme, backgroundColor }: StyledChipProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.width.thin),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledChipStyles };
