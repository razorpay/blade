import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';

const Rotate = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        style={{
          display: 'inline-block', // Ensures the box wraps around its children
          backgroundColor: 'pink',
          //   height: '24px',
          //   width: '24px',
        }}
        // animate={{ rotate: 360 }}
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
