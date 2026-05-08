/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import React from 'react';
import { View } from 'react-native';
import { useTourContext } from './TourContext';
import type { SpotlightPopoverTourStepProps } from './types';
import { mergeRefs } from '~utils/useMergeRefs';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SpotlightPopoverTourStep = ({
  name,
  children,
}: SpotlightPopoverTourStepProps): React.ReactElement => {
  const ref = React.useRef<View>(null);
  const { attachStep, removeStep } = useTourContext();

  React.useEffect(() => {
    if (!ref) return;
    attachStep(name, ref);

    return () => {
      removeStep(name);
    };
  }, [ref, attachStep, name, removeStep]);

  const child = children as React.ReactElement;
  return (
    <View ref={mergeRefs(ref, (child as any)?.ref)} collapsable={false}>
      {child}
    </View>
  );
};

const SpotlightPopoverTourStep = assignWithoutSideEffects(React.memo(_SpotlightPopoverTourStep), {
  displayName: 'TourStep',
});

export { SpotlightPopoverTourStep };
