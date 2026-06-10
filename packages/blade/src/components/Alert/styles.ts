import type { CSSObject, StyledProps } from 'styled-components';

import type { StyledAlertProps, AlertColors } from './types';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import type { IconColors } from '~components/Icons';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';
import { size } from '~tokens/global';

export const getAlertIconColor = (color: AlertColors, emphasis: SubtleOrIntense): IconColors => {
  if (emphasis === 'intense') {
    return 'surface.icon.staticWhite.normal';
  }
  if (color === 'primary') {
    return 'surface.icon.primary.normal';
  }
  return `feedback.icon.${color}.intense` as IconColors;
};

const MAX_WIDTH = size[584];

export const getCommonStyles = (props: StyledProps<StyledAlertProps>): CSSObject => {
  const { theme, emphasis, color, isFullWidth, isDesktop } = props;

  const background =
    color === 'primary'
      ? theme.colors.surface.background.primary[emphasis]
      : theme.colors.feedback.background[color][emphasis];

  return {
    background,
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
