/* eslint-disable consistent-return */
import React from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useTourContext } from './TourContext';
import type { SpotlightPopoverTourStepProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SpotlightPopoverTourStep = ({
  name,
  children,
}: SpotlightPopoverTourStepProps): React.ReactElement => {
  const ref = React.useRef<View>(null);
  const { attachStep, removeStep, onStepLayout } = useTourContext();

  React.useLayoutEffect(() => {
    attachStep(name, ref);

    return () => {
      removeStep(name);
    };
  }, [attachStep, name, removeStep]);

  return (
    <View
      collapsable={false}
      ref={ref}
      style={{ alignSelf: 'stretch' }}
      onLayout={(_event: LayoutChangeEvent) => {
        onStepLayout?.(name);
      }}
    >
      {children}
    </View>
  );
};

const SpotlightPopoverTourStep = assignWithoutSideEffects(React.memo(_SpotlightPopoverTourStep), {
  displayName: 'TourStep',
});

export { SpotlightPopoverTourStep };
