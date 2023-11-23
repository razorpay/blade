/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import React from 'react';
import { useTourContext } from './TourContext';
import type { SpotlightPopoverTourStepProps } from './types';
import { mergeRefs } from '~utils/useMergeRefs';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SpotlightPopoverTourStep = ({
  name,
  children,
}: SpotlightPopoverTourStepProps): React.ReactElement => {
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
  return React.cloneElement(child, {
    ...child.props,
    ref: mergeRefs(ref, (child as any)?.ref),
  });
};

const SpotlightPopoverTourStep = assignWithoutSideEffects(React.memo(_SpotlightPopoverTourStep), {
  displayName: 'TourStep',
});

export { SpotlightPopoverTourStep };
