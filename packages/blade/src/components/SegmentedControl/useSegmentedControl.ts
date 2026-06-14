import React from 'react';
import type {
  SegmentedControlProps,
  SegmentedControlContextType,
  SegmentedControlSize,
} from './types';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';

type UseSegmentedControlProps = Pick<
  SegmentedControlProps,
  'isDisabled' | 'name' | 'value' | 'defaultValue' | 'onChange' | 'size'
>;

type UseSegmentedControlReturn = {
  contextValue: SegmentedControlContextType;
  ids: { labelId: string };
};

const useSegmentedControl = ({
  value,
  defaultValue,
  isDisabled,
  onChange,
  name,
  size,
}: UseSegmentedControlProps): UseSegmentedControlReturn => {
  const idBase = useId('segmented-control');
  const labelId = `${idBase}-label`;
  const fallbackName = name ?? idBase;

  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: (v) => {
      onChange?.({ value: v, name: fallbackName });
    },
  });

  const setValueHandler = React.useCallback(
    (newValue: string) => {
      if (isDisabled) return;
      setSelectedValue(() => newValue);
    },
    [isDisabled, setSelectedValue],
  );

  const contextValue = React.useMemo<SegmentedControlContextType>(() => {
    return {
      isDisabled,
      name: fallbackName,
      selectedValue,
      setSelectedValue: setValueHandler,
      size: size as SegmentedControlSize,
      baseId: idBase,
    };
  }, [isDisabled, fallbackName, selectedValue, setValueHandler, size, idBase]);

  return { contextValue, ids: { labelId } };
};

export { useSegmentedControl };
