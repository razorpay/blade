import styled from 'styled-components';
import getIn from 'lodash/get';
import { getStyledChipStyles } from './getStyledChipStyles';
import type { StyledChipProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';

const StyledChip = styled(BaseBox)<StyledChipProps>((props) => {
  const easing = getIn(props.theme, 'motion.easing.standard.effective');
  const duration = makeMotionTime(getIn(props.theme, 'motion.duration.xquick'));
  return {
    ...getStyledChipStyles(props),
    width: 'fit-content',
    transform: `scale(${props.isPressed ? '0.8' : '1'})`,
    transitionDuration: duration,
    transitionTimingFunction: easing,
  };
});

export { StyledChip };
