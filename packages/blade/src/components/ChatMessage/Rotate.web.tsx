import React from 'react';
import { m } from 'framer-motion';
import { castWebType } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';

const Rotate = ({
  children,
  animate,
}: {
  children: React.ReactElement;
  animate?: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();

  return (
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
  );
};

export default Rotate;
