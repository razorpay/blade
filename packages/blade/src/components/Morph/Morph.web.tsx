import React from 'react';
import { MotionDiv } from '~components/BaseMotion';
import { MorphProps } from './types';

const Morph = ({ children, layoutId }: MorphProps) => {
  return <MotionDiv as={children.type} {...children.props} layout layoutId={layoutId} />;
};

export { Morph };
