import styled from 'styled-components';

import type { StyledAlertProps } from './StyledAlert.d';
import { makeSpace } from '~utils';

const StyledAlert = styled.div<StyledAlertProps>((props) => {
  const { theme, contrastType, intent, isFullWidth, isBorderless } = props;

  // a borderless alert is automatically set to full width
  const _isFullWidth = isFullWidth || isBorderless;
  const feedbackColors = theme.colors.feedback;

  return {
    background: feedbackColors.background[intent][contrastType],
    padding: `${makeSpace(theme.spacing[3])} ${makeSpace(theme.spacing[4])}`,
    borderRadius: isBorderless ? theme.border.radius.none : theme.border.radius.medium,
    borderColor: feedbackColors.border[intent][contrastType],
    borderWidth: isBorderless ? theme.border.width.none : theme.border.width.thin,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    maxWidth: _isFullWidth ? 'auto' : 584,
    alignItems: 'flex-start',
  };
});

export default StyledAlert;
