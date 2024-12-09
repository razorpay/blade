import React from 'react';
import type { MorphProps } from './types';
import { MotionDiv } from '~components/BaseMotion';
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles.web';
import { castWebType, useTheme } from '~utils';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { msToSeconds } from '~utils/msToSeconds';

const Morph = ({ children, layoutId }: MorphProps): React.ReactElement => {
  // Apart from framer-motion's layout morphing, we also support morph of backgroundColor and borderRadius
  const { borderRadius, backgroundColor, ...rest } = children.props;
  const { theme } = useTheme();
  const cssProps = useMemoizedStyles({ borderRadius, backgroundColor, theme });

  return (
    <MotionDiv
      as={children.type}
      {...rest}
      layout
      layoutId={layoutId}
      // The animations that are not supported by layout animation are animated using `animate` prop here
      animate={cssProps}
      transition={{
        duration: msToSeconds(theme.motion.duration.moderate),
        ease: cssBezierToArray(castWebType(theme.motion.easing.standard)),
      }}
    />
  );
};

export { Morph };
