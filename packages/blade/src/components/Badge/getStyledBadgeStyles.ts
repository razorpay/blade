import type { CSSObject } from 'styled-components';
import type { StyledBadgeProps } from './types';
import { getIn, makeBorderSize } from '~utils';

const getStyledBadgeStyles = ({ theme, backgroundColor }: StyledBadgeProps): CSSObject => ({
  backgroundColor: getIn(theme.colors, backgroundColor),
  borderRadius: makeBorderSize(theme.border.radius.max),
  display: 'flex',
  flexWrap: 'nowrap',
});

export { getStyledBadgeStyles };
