import React from 'react';
import { MotionDiv } from '~components/BaseMotion';
import { MorphProps } from './types';

const Morph = ({ children, layoutId }: MorphProps) => {
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
