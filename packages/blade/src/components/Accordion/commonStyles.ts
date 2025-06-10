import type { CSSObject, StyledProps } from 'styled-components';
import type { StyledAccordionButtonProps } from './types';
import type { Theme } from '~components/BladeProvider';
import { makeMotionTime } from '~utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTransitionDuration = (theme: Theme) => makeMotionTime(theme.motion.duration['2xquick']);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTransitionEasing = (theme: Theme) => theme.motion.easing.standard;

const getBackgroundColor = ({ theme, isActive }: { theme: Theme; isActive: boolean }): string => {
  const { gray } = theme.colors.interactive.background;

  return isActive ? gray.faded : theme.colors.transparent;
};

const getCommonAccordionButtonStyles = (
  props: StyledProps<StyledAccordionButtonProps>,
): CSSObject => {
  const { theme } = props;

  return {
    padding: theme.spacing[0],
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
