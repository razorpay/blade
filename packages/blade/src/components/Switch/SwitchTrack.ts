import isNumber from 'lodash/isNumber';
import styled from 'styled-components';
import { switchColors, switchSizes } from './switchTokens';
import type { SwitchProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { getIn, makeSpace, makeSize, isReactNative, makeMotionTime } from '~utils';

type TrackProps = Required<Pick<SwitchProps, 'size' | 'isDisabled' | 'isChecked'>> & {
  deviceType: 'mobile' | 'desktop';
};

const SwitchTrack = styled(BaseBox)<TrackProps>(
  ({ theme, size, deviceType, isDisabled, isChecked }) => {
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
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      margin: makeSpace(theme.spacing[1]),
      width,
      height,
      borderRadius: makeSize(theme.border.radius.max),
      backgroundColor,
      transitionTimingFunction: `${theme.motion.easing.standard.effective}`,
      transitionDuration: isReactNative()
        ? undefined
        : `${makeMotionTime(theme.motion.duration['2xquick'])}`,
    };
  },
);

export { SwitchTrack };
