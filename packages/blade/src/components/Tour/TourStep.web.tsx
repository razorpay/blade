/* eslint-disable consistent-return */
import React from 'react';
import { useTourContext } from './TourContext';
import type { TourStepProps } from './types';
import { mergeRefs } from '~utils/useMergeRefs';

const _TourStep = ({ name, children }: TourStepProps): React.ReactElement => {
  const ref = React.useRef<HTMLElement>(null);
  const { attachStep, removeStep } = useTourContext();

  React.useLayoutEffect(() => {
    if (!ref) return;
    attachStep(name, ref);

    return () => {
      removeStep(name);
    };
  }, [ref, attachStep, name, removeStep]);

  const child = children as React.ReactElement;
  // TODO: check ref
  return React.cloneElement(child, { ...child.props, ref: mergeRefs(ref, child.props.ref) });
};

const TourStep = React.memo(_TourStep);

export { TourStep };
