import styled from 'styled-components';
import type { ProgressBarFilledProps } from './types';
import Box from '~components/Box';
import { castWebType, getIn, makeMotionTime } from '~utils';

const ProgressBarFilled = styled(Box)<ProgressBarFilledProps>(
  ({ backgroundColor, theme, progress, fillMotionDuration, fillMotionEasing }) => ({
    backgroundColor,
    height: '100%',
    width: `${progress}%`,
    transitionProperty: 'width',
    transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, fillMotionDuration))),
    transitionTimingFunction: castWebType(getIn(theme.motion, fillMotionEasing)),
  }),
);

export { ProgressBarFilled };
