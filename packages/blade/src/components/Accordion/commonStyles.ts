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
  const { gray } = theme.colors.brand;

  if (isActive) {
    if (isExpanded) {
      return gray.a100.lowContrast;
    }
    return gray.a50.lowContrast;
  }

  if (isExpanded) {
    return gray.a50.lowContrast;
  }

  const TRANSPARENT = 'hsla(0, 0%, 100%, 0)';
  return TRANSPARENT;
};

export { getTransitionDuration, getTransitionEasing, getBackgroundColor };
