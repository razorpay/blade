import type { CSSObject, StyledProps } from 'styled-components';

import type { StyledAlertProps } from './types';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';
import { size } from '~tokens/global';

const MAX_WIDTH = size[584];

export const getCommonStyles = (props: StyledProps<StyledAlertProps>): CSSObject => {
  const { theme, emphasis, color, isFullWidth, isDesktop } = props;

  return {
    background: theme.colors.feedback.background[color][emphasis],
    padding: makeSpace(theme.spacing[4]),
    borderRadius: makeBorderSize(
      isFullWidth ? theme.border.radius.none : theme.border.radius.medium,
    ),
    display: 'flex',
    flexDirection: 'row',
    maxWidth: isFullWidth ? 'auto' : makeSize(MAX_WIDTH),
    width: isFullWidth ? '100%' : undefined,
    alignItems: isFullWidth && isDesktop ? 'center' : 'flex-start',
    boxSizing: 'border-box',
  };
};
