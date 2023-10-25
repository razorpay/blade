import type { CSSObject } from 'styled-components';
import getIn from 'lodash/get';
import type { StyledBadgeProps } from './types';
import { makeBorderSize } from '~utils/makeBorderSize';

const getStyledBadgeStyles = ({ theme, backgroundColor }: StyledBadgeProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.radius.max),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
