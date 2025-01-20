/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';
import { getPlatformType } from '~src/utils';
import { makeAccessible } from '~utils/makeAccessible';
import { throwBladeError } from '~utils/logger';

export type OnChange = ({
  isChecked,
  event,
  value,
}: {
  isChecked: boolean;
  event: React.ChangeEvent;
  value?: string;
}) => void;

type UseRadioProps = {
  hasError?: boolean;
  /**
   * If `true`, The Radio will be checked. This also makes the Radio controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the Radio will be initially checked. This also makes the Radio uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Radio` changes.
   */
  onChange?: OnChange;
  /**
   * The name of the input field in a Radio
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the Radio will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the Radio input is marked as required,
   * and `required` attribute will be added
   *
   * @default false
   */
  isRequired?: boolean;
};

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
  if (__DEV__) {
    if (isChecked && defaultChecked) {
      throwBladeError({
        message: `Do not provide both 'isChecked' and 'defaultChecked' to useRadio. Consider if you want this component to be controlled or uncontrolled.`,
        moduleName: 'Radio',
      });
    }
  }

  const [radioState, setRadioState] = useControllableState({
    value: isChecked,
    defaultValue: defaultChecked ?? false,
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement> | GestureResponderEvent) => {
    if (isDisabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    setRadioState((checked) => {
      // Prevent radio to be unchecked when clicked again
      // Once checked radios don't act as toggle buttons
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
    isChecked: radioState,
    setChecked: setRadioState,
  };

  const idBase = useId('radio');
  const helpTextId = useId(`${idBase}-helptext`);

  const accessibilityProps = makeAccessible({
    role: 'radio',
    required: Boolean(isRequired),
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
