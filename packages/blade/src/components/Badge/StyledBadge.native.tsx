import styled from 'styled-components/native';
import { getStyledBadgeStyles } from './getStyledBadgeStyles';
import type { StyledBadgeProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledBadge = styled(BaseBox)<StyledBadgeProps>((props) => ({
  ...getStyledBadgeStyles(props),
  alignSelf: 'center',
  justifyContent: 'center',
  // iOS adds extra lineHeight space above glyphs; paddingBottom shifts the flex-center
  // reference upward by 0.5px to compensate, centering the visual text in the badge
  paddingBottom: 0.5,
}));

export { StyledBadge };
