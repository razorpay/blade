import type { CSSObject, StyledProps } from 'styled-components';

import type { StyledAlertProps } from './types';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import size from '~tokens/global/size';

const MAX_WIDTH = size[584];

export const getCommonStyles = (props: StyledProps<StyledAlertProps>): CSSObject => {
  const { theme, contrastType, intent, isFullWidth, isDesktop } = props;

  const feedbackColors = theme.colors.feedback;

  return {
    background: feedbackColors.background[intent][contrastType],
    padding: isFullWidth
      ? `${makeSpace(theme.spacing[4])} ${makeSpace(theme.spacing[5])}`
      : `${makeSpace(theme.spacing[3])} ${makeSpace(theme.spacing[3])} ${makeSpace(
          theme.spacing[4],
        )} ${makeSpace(theme.spacing[3])}`,
    borderRadius: makeBorderSize(
      isFullWidth ? theme.border.radius.none : theme.border.radius.medium,
    ),
    borderColor: feedbackColors.border[intent][contrastType],
    borderWidth: makeBorderSize(isFullWidth ? theme.border.width.none : theme.border.width.thin),
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    maxWidth: isFullWidth ? 'auto' : makeSize(MAX_WIDTH),
    width: isFullWidth ? '100%' : undefined,
    alignItems: isFullWidth && isDesktop ? 'center' : 'flex-start',
    boxSizing: 'border-box',
  };
};
