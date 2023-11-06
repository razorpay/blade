/* eslint-disable consistent-return */
import React from 'react';
import { useTourContext } from './TourContext';
import { mergeRefs } from '~utils/useMergeRefs';

type TourStepProps = {
  name: string;
  children: React.ReactNode;
};

const TourStep = ({ name, children }: TourStepProps): React.ReactElement => {
  const ref = React.useRef(null);
  const { attachStep, removeStep } = useTourContext();

  React.useEffect(() => {
    if (!ref) return;
    attachStep(name, ref);

    return () => {
      removeStep(name, ref);
    };
  }, [ref, attachStep, name, removeStep]);

  const child = children as React.ReactElement;
  // TODO: check ref
  return React.cloneElement(child, { ...child.props, ref: mergeRefs(ref, child.props.ref) });
};

export { TourStep };
