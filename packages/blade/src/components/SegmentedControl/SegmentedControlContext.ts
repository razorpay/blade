import React from 'react';
import type { SegmentedControlSize } from './types';
import { throwBladeError } from '~utils/logger';
import type { ControllableStateSetter } from '~utils/useControllable';

type SegmentedControlContextProps = {
  selectedValue: string;
  setSelectedValue: ControllableStateSetter<string>;
  size: SegmentedControlSize;
  isDisabled: boolean;
  name?: string;
  baseId: string;
} | null;

const SegmentedControlContext = React.createContext<SegmentedControlContextProps>(null);

const useSegmentedControlContext = (): NonNullable<SegmentedControlContextProps> => {
  const context = React.useContext(SegmentedControlContext);

  if (!context) {
    throwBladeError({
      moduleName: 'SegmentedControl',
      message: 'useSegmentedControlContext must be used within SegmentedControl',
    });
  }

  return context!;
};

export { SegmentedControlContext, useSegmentedControlContext };
