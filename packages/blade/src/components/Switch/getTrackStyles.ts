import type { CSSObject } from 'styled-components';
import type { TrackProps } from './types';
import { switchColors, switchSizes } from './switchTokens';
import getIn from '~utils/lodashButBetter/get';
import isNumber from '~utils/lodashButBetter/isNumber';
import { isReactNative } from '~utils';
import type { Theme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { makeSpace } from '~utils/makeSpace';
import { makeMotionTime } from '~utils/makeMotionTime';

const getTrackStyles = ({
  isChecked,
  isDisabled,
  deviceType,
  size,
  theme,
}: TrackProps & {
  theme: Theme;
}): CSSObject => {
  let variant: 'default' | 'disabled' = 'default';
  if (isDisabled) variant = 'disabled';
  const checked = isChecked ? 'checked' : 'unchecked';
  const background = switchColors.track[variant].background[checked];
  const backgroundColor = getIn(theme, background);

  const widthToken = switchSizes.track[deviceType][size].width;
  const heightToken = switchSizes.track[deviceType][size].height;
  const width = isNumber(widthToken) ? makeSize(widthToken) : makeSpace(getIn(theme, widthToken));
  const height = isNumber(heightToken)
    ? makeSize(heightToken)
    : makeSpace(getIn(theme, heightToken));

  return {
    pointerEvents: 'none',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    margin: makeSpace(theme.spacing[1]),
    padding: makeSpace(theme.spacing[1]),
    width,
    height,
    borderRadius: makeSize(theme.border.radius.max),
    backgroundColor,
    transitionTimingFunction: `${theme.motion.easing.standard}`,
    transitionDuration: isReactNative()
      ? undefined
      : `${makeMotionTime(theme.motion.duration['2xquick'])}`,
  };
};

export { getTrackStyles };
