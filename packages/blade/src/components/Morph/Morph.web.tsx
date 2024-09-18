import React from 'react';
import { MotionDiv } from '~components/BaseMotion';

export type MorphProps = {
  children: React.ReactElement;
  layoutId: string;
};

export const Morph = ({ children, layoutId }: MorphProps) => {
  return <MotionDiv as={children.type} {...children.props} layout layoutId={layoutId} />;
};
