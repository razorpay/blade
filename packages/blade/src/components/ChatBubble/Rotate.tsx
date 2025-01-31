import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';

const Rotate = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  const { theme } = useTheme();
  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <LazyMotion features={domAnimation}>
      {/* //TODO: use blade tokens for duration and repeat */}
      <m.div
        style={{
          display: 'flex',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

export default Rotate;
