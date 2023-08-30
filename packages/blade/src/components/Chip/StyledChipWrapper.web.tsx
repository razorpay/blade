import styled from 'styled-components';
import getIn from 'lodash/get';
import type { StyledChipWrapperProps } from './types';
import { chipMotionTokens, chipColorTokens } from './chipTokens';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const StyledChipWrapper = styled(BaseBox)<StyledChipWrapperProps>(
  ({ theme, borderColor, isChecked, isDisabled, intent }) => {
    const easing = getIn(theme, chipMotionTokens.easing);
    const duration = castWebType(makeMotionTime(getIn(theme, chipMotionTokens.duration)));

    return {
      display: 'flex',
      borderColor: isChecked ? getIn(theme.colors, borderColor) : 'transparent',

      ...(!isDisabled && {
        '&:hover': {
          backgroundColor: getIn(
            theme.colors,
            chipColorTokens.background[isChecked && intent ? intent : 'unchecked'].hover,
          ),
          transitionTimingFunction: easing,
          transitionDuration: duration,
        },
      }),
    };
  },
);

export { StyledChipWrapper };
