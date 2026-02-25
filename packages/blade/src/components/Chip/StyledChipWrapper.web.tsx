import styled from 'styled-components';
import type { StyledChipWrapperProps } from './types';
import { chipMotionTokens, chipColorTokens, chipBorderRadiusTokens } from './chipTokens';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils';

const StyledChipWrapper = styled(BaseBox)<StyledChipWrapperProps>(
  ({ theme, borderColor, isChecked, isDisabled, color, size = 'small' as const }) => {
    const easing = getIn(theme.motion, chipMotionTokens.easing);
    const duration = castWebType(makeMotionTime(getIn(theme.motion, chipMotionTokens.duration)));
    const borderRadiusKey = chipBorderRadiusTokens[size];
    const outerRadius = theme.border.radius[borderRadiusKey];
    const outerBorderWidth = theme.border.width.thin;

    return {
      display: 'flex',
      borderColor: isChecked ? getIn(theme.colors, borderColor) : 'transparent',
      borderRadius: `${outerRadius - outerBorderWidth}px`,

      ...(!isDisabled && {
        '&:hover': {
          backgroundColor: getIn(
            theme.colors,
            chipColorTokens.background[isChecked && color ? color : 'unchecked'].hover,
          ),
          transitionTimingFunction: easing,
          transitionDuration: duration,
        },
      }),
    };
  },
);

export { StyledChipWrapper };
