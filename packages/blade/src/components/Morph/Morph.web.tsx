import React from 'react';
import type { MorphProps } from './types';
import { MotionDiv } from '~components/BaseMotion';

const Morph = ({ children, layoutId }: MorphProps): React.ReactElement => {
  return (
    <MotionDiv
      as={children.type}
      {...children.props}
      layout
      layoutId={layoutId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
};

export { Morph };
