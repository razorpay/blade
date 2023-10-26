import type { CSSObject, StyledProps } from 'styled-components';

import type { StyledAlertProps } from './types';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';
import { size } from '~tokens/global';

const MAX_WIDTH = size[584];

export const getCommonStyles = (props: StyledProps<StyledAlertProps>): CSSObject => {
  const { theme, contrastType, color, isFullWidth, isDesktop } = props;

  const feedbackColors = theme.colors.feedback;

  return {
    background: feedbackColors.background[color][contrastType],
    padding: isFullWidth
      ? `${makeSpace(theme.spacing[4])} ${makeSpace(theme.spacing[5])}`
      : `${makeSpace(theme.spacing[3])} ${makeSpace(theme.spacing[3])} ${makeSpace(
          theme.spacing[4],
        )} ${makeSpace(theme.spacing[3])}`,
    borderRadius: makeBorderSize(
      isFullWidth ? theme.border.radius.none : theme.border.radius.medium,
    ),
    borderColor: feedbackColors.border[color][contrastType],
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
