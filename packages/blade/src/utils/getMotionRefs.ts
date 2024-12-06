/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import type { BladeElementRef } from './types';
import type { MotionMetaProp } from '~components/BaseMotion';

type MotionRefsType = {
  ref: React.Ref<BladeElementRef>;
} & MotionMetaProp;

/**
 * ## What are `getOuterMotionRef` and `getInnerMotionRef` functions?
 *
 * - Motion react requires refs on outermost element to animate components
 * - But we have certain components like input where we already pass refs on inner elements with certain expectation (e.g. in input to focus on the input)
 *
 * Using these 2 utility functions, we can use 2 refs from same forwardRef. One on outer element and one on inner element
 *
 * ---
 *
 * ### Examples
 *
 * ```jsx
 *
 * const MyComponent = ({ _motionMeta }: MotionMetaProp, ref: React.Ref<BladeElementRef>) => {
 *
 *  return (
 *   <BaseBox ref={getOuterMotionRef({ _motionMeta, ref })}>
 *    <Text>Something something</Text>
 *    <BaseInput ref={getInnerMotionRef({ _motionMeta, ref })} />
 *  </BaseBox>
 *  )
 * }
 * ```
 *
 * ### What does it internally do?
 *
 * - On BaseMotion.tsx, we inject _motionMeta prop with ref that is passed to child.
 * - i.e. we pick the `ref` prop of child, and pass it as `_motionMeta.innerRef`. This way in our components, we have access to both the refs. The motion/react ref that we get from forwardRef, and `_motionMeta.innerRef` (ref that you pass on child component of motion)
 * - Both `getOuterMotionRef` and `getInnerMotionRef` are simple one line utility functions to use the correct ref on correct element.
 *
 * ### When to use this?
 *
 * - When you want to forward ref to component on inner element instead of outer element (e.g. passing down the ref to input in checkbox)
 */
const getOuterMotionRef = ({ _motionMeta, ref }: MotionRefsType): any => {
  return _motionMeta?.isEnhanced ? ref : null;
};

/**
 * ## What are `getOuterMotionRef` and `getInnerMotionRef` functions?
 *
 * - Motion react requires refs on outermost element to animate components
 * - But we have certain components like input where we already pass refs on inner elements with certain expectation (e.g. in input to focus on the input)
 *
 * Using these 2 utility functions, we can use 2 refs from same forwardRef. One on outer element and one on inner element
 *
 * ---
 *
 * ### Examples
 *
 * ```jsx
 *
 * const MyComponent = ({ _motionMeta }: MotionMetaProp, ref: React.Ref<BladeElementRef>) => {
 *
 *  return (
 *   <BaseBox ref={getOuterMotionRef({ _motionMeta, ref })}>
 *    <Text>Something something</Text>
 *    <BaseInput ref={getInnerMotionRef({ _motionMeta, ref })} />
 *  </BaseBox>
 *  )
 * }
 * ```
 *
 * ### What does it internally do?
 *
 * - On BaseMotion.tsx, we inject _motionMeta prop with ref that is passed to child.
 * - i.e. we pick the `ref` prop of child, and pass it as `_motionMeta.innerRef`. This way in our components, we have access to both the refs. The motion/react ref that we get from forwardRef, and `_motionMeta.innerRef` (ref that you pass on child component of motion)
 * - Both `getOuterMotionRef` and `getInnerMotionRef` are simple one line utility functions to use the correct ref on correct element.
 *
 * ### When to use this?
 *
 * - When you want to forward ref to component on inner element instead of outer element (e.g. passing down the ref to input in checkbox)
 */
const getInnerMotionRef = ({ _motionMeta, ref }: MotionRefsType): any => {
  return _motionMeta?.isEnhanced ? _motionMeta.innerRef : ref;
};

export { getOuterMotionRef, getInnerMotionRef };
