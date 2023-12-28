import type { CSSObject, StyledProps } from 'styled-components';
import type { StyledAccordionButtonProps } from './types';
import type { Theme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTransitionDuration = (theme: Theme) => makeMotionTime(theme.motion.duration['2xquick']);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTransitionEasing = (theme: Theme) => theme.motion.easing.standard.effective;

const getBackgroundColor = ({
  theme,
  isExpanded,
  isActive,
}: {
  theme: Theme;
  isExpanded: boolean;
  isActive: boolean;
}): string => {
  const { gray } = theme.colors.interactive.background;

  if (isActive) {
    return gray.faded;
  }

  if (isExpanded) {
    return gray.default;
  }

  const TRANSPARENT = 'hsla(0, 0%, 100%, 0)';
  return TRANSPARENT;
};

const getCommonAccordionButtonStyles = (
  props: StyledProps<StyledAccordionButtonProps>,
): CSSObject => {
  const { theme } = props;

  return {
    padding: theme.spacing[5],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
};

export {
  getTransitionDuration,
  getTransitionEasing,
  getBackgroundColor,
  getCommonAccordionButtonStyles,
};
