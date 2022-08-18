import styled from 'styled-components';

import type { StyledAlertProps } from './StyledAlert.d';
import { makeSpace } from '~utils';

const StyledAlert = styled.div<StyledAlertProps>((props) => {
  const { theme, contrastType, intent, isFullWidth, isBorderless } = props;
  const feedbackColors = theme.colors.feedback;
  const surfaceColors = theme.colors.surface;

  return {
    // todo: typography styles - color, size, family, line height
    // color: surfaceColors.text.subtle[contrastType],
    background: feedbackColors.background[intent][contrastType],
    padding: `${makeSpace(theme.spacing[3])} ${makeSpace(theme.spacing[4])}`,
    borderRadius: theme.border.radius.medium,
    borderColor: feedbackColors.border[intent][contrastType],
    borderWidth: theme.border.width.thin,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    maxWidth: isFullWidth ? 'auto' : 584,
    alignItems: 'flex-start',
  };
});

export default StyledAlert;
