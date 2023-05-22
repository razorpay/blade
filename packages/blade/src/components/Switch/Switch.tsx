/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import React from 'react';
import { ThumbIcon } from './ThumbIcon';
import type { SwitchProps } from './types';
import { switchHoverVariants } from './switchTokens';
import { Thumb } from './Thumb';
import { AnimatedThumb } from './AnimatedThumb';
import { SwitchTrack } from './SwitchTrack';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { useCheckbox } from '~components/Checkbox/useCheckbox';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import {
  assignWithoutSideEffects,
  makeAccessible,
  metaAttribute,
  useBreakpoint,
  usePrevious,
} from '~utils';
import type { BladeElementRef } from '~src/hooks/types';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';

const _Switch: React.ForwardRefRenderFunction<BladeElementRef, SwitchProps> = (
  {
    defaultChecked,
    isChecked,
    isDisabled,
    name,
    onChange,
    size = 'medium',
    value,
    accessibilityLabel,
    id,
    testID,
  },
  ref,
): React.ReactElement => {
  const { state, inputProps } = useCheckbox({
    role: 'switch',
    defaultChecked,
    isChecked,
    isIndeterminate: false,
    hasError: false,
    hasHelperText: false,
    isDisabled,
    isRequired: false,
    name,
    value,
    onChange,
  });

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const previousChecked = usePrevious(state.isChecked);

  return (
    <BaseBox
      {...metaAttribute({ testID })}
      // @ts-ignore on rn inline-block is not valid but type here will be `flex | inline-block`
      display={state.isReactNative ? 'flex' : 'inline-block'}
    >
      <SelectorLabel
        inputProps={
          state.isReactNative
            ? // accessibility label for react-native needs to be added
              //since there is no text children inside Switch
              { ...inputProps, ...makeAccessible({ label: accessibilityLabel }) }
            : {}
        }
      >
        <SelectorInput
          hoverStyles={switchHoverVariants}
          ref={ref}
          id={id}
          isChecked={state.isChecked}
          isDisabled={isDisabled}
          hasError={false}
          inputProps={inputProps}
          accessibilityLabel={accessibilityLabel}
        />
        <SwitchTrack
          size={size}
          deviceType={matchedDeviceType}
          isDisabled={Boolean(isDisabled)}
          isChecked={state.isChecked}
          {...makeAccessible({ hidden: true })}
        >
          <Thumb size={size} deviceType={matchedDeviceType} isChecked={state.isChecked}>
            <AnimatedThumb
              shouldRunAnimation={
                // do not run animation on first render
                // or if the isChecked state hasn't been changed
                previousChecked !== undefined && previousChecked !== state.isChecked
              }
              isChecked={state.isChecked}
              isDisabled={isDisabled}
              size={size}
            >
              <ThumbIcon isChecked={state.isChecked} isDisabled={isDisabled} size={size} />
            </AnimatedThumb>
          </Thumb>
        </SwitchTrack>
      </SelectorLabel>
    </BaseBox>
  );
};

const Switch = assignWithoutSideEffects(React.forwardRef(_Switch), {
  displayName: 'Switch',
});

export { Switch };
