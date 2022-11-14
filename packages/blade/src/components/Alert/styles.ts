import type { CSSObject, StyledProps } from 'styled-components';

import type { StyledAlertProps } from './types';
import { makeBorderSize, makeSize, makeSpace } from '~utils';

const MAX_WIDTH = 584;

export const getCommonStyles = (props: StyledProps<StyledAlertProps>): CSSObject => {
  const { theme, contrastType, intent, isFullWidth, isBorderless } = props;

  // a borderless alert is automatically set to full width
  const _isFullWidth = isFullWidth || isBorderless;
  const feedbackColors = theme.colors.feedback;

  return {
    background: feedbackColors.background[intent][contrastType],
    padding: isBorderless
      ? `${makeSpace(theme.spacing[4])} ${makeSpace(theme.spacing[5])}`
      : `${makeSpace(theme.spacing[3])} ${makeSpace(theme.spacing[3])} ${makeSpace(
          theme.spacing[4],
        )} ${makeSpace(theme.spacing[3])}`,
    borderRadius: makeBorderSize(
      isBorderless ? theme.border.radius.none : theme.border.radius.medium,
    ),
    borderColor: feedbackColors.border[intent][contrastType],
    borderWidth: makeBorderSize(isBorderless ? theme.border.width.none : theme.border.width.thin),
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    maxWidth: _isFullWidth ? 'auto' : makeSize(MAX_WIDTH),
    alignItems: 'flex-start',
  };
};
