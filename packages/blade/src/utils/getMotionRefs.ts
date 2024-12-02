import type React from 'react';
import type { MotionMetaProp } from '~components/BaseMotion';
import type { BladeElementRef } from './types';

type MotionRefsType = {
  ref: React.Ref<BladeElementRef>;
} & MotionMetaProp;

/**
 *
 */
const getOuterMotionRef = ({ _motionMeta, ref }: MotionRefsType): any => {
  return _motionMeta?.isEnhanced ? ref : null;
};

/**
 *
 */
const getInnerMotionRef = ({ _motionMeta, ref }: MotionRefsType): any => {
  return _motionMeta?.isEnhanced ? _motionMeta.innerRef : ref;
};

export { getOuterMotionRef, getInnerMotionRef };
