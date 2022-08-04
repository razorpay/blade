/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { RadioProps } from './Radio';
import { useControllableState } from '~src/hooks/useControllable';
import { useId } from '~src/hooks/useId';
import { getPlatformType, makeAccessible } from '~src/utils';

type UseRadioProps = Pick<
  RadioProps,
  'isChecked' | 'defaultChecked' | 'isDisabled' | 'isRequired' | 'onChange' | 'name' | 'value'
> & { hasError?: boolean };

const useRadio = ({
  isChecked,
  defaultChecked,
  isDisabled,
  isRequired,
  hasError,
  onChange,
  name,
  value,
}: UseRadioProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isReactNative = getPlatformType() === 'react-native';
  if (isChecked && defaultChecked) {
    throw new Error(
      `[Blade useRadio] Do not provide both 'isChecked' and 'defaultChecked' to useRadio. Consider if you want this component to be controlled or uncontrolled.`,
    );
  }

  const [radioState, setRadioStateChange] = useControllableState({
    value: isChecked,
    defaultValue: defaultChecked ?? false,
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement> | GestureResponderEvent) => {
    if (isDisabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    setRadioStateChange((checked) => {
      if (checked === false) {
        onChange?.({
          isChecked: true,
          event: event as React.ChangeEvent,
          value,
        });
        return true;
      }
      return checked;
    });
  };

  const state = {
    isReactNative,
    isChecked: radioState,
    setChecked: setRadioStateChange,
  };

  const idBase = useId('radio');
  const helpTextId = useId(`${idBase}-helptext`);

  const accessibilityProps = makeAccessible({
    role: 'radio',
    required: Boolean(isRequired),
    hidden: !isReactNative,
    invalid: Boolean(hasError),
    disabled: Boolean(isDisabled),
    checked: radioState,
    describedBy: helpTextId,
  });

  if (isReactNative) {
    return {
      state,
      inputProps: {
        onPress: handleOnChange,
        name,
        value,
        ...accessibilityProps,
      },
    };
  }

  return {
    state,
    ids: { helpTextId },
    inputProps: {
      ref: inputRef,
      onChange: handleOnChange,
      type: 'radio',
      name,
      value,
      checked: radioState,
      disabled: isDisabled,
      required: isRequired,
      ...accessibilityProps,
    },
  };
};

export type InputProps = ReturnType<typeof useRadio>['inputProps'];

export { useRadio };
