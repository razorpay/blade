import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { castWebType } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';

const Rotate = ({
  children,
  animate,
}: {
  children: React.ReactElement | string;
  animate?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        style={{
          display: 'flex',
        }}
        animate={{ rotate: animate ? 90 : 0 }}
        transition={{
          duration: msToSeconds(theme.motion.duration.gentle),
          repeat: Infinity,
          ease: cssBezierToArray(castWebType(theme.motion.easing.emphasized)),
          delay: msToSeconds(theme.motion.delay.gentle),
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

export default Rotate;
