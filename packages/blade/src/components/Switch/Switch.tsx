/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import React from 'react';
import { ThumbIcon } from './ThumbIcon';
import type { SwitchProps } from './types';
import { switchHoverTokens } from './switchTokens';
import { Thumb } from './Thumb';
import { AnimatedThumb } from './AnimatedThumb';
import { SwitchTrack } from './SwitchTrack';
import { useTheme } from '~components/BladeProvider';
import { BaseBox } from '~components/Box/BaseBox';
import { useCheckbox } from '~components/Checkbox/useCheckbox';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import { assignWithoutSideEffects, makeAccessible, metaAttribute, useBreakpoint } from '~utils';
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
    testID,
  },
  ref,
): React.ReactElement => {
  const [isPressed, setIsPressed] = React.useState(false);
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

  return (
    <BaseBox
      {...metaAttribute({ testID, name: 'Switch' })}
      // @ts-ignore on rn inline-block is not valid but type here will be `flex | inline-block`
      display={state.isReactNative ? 'flex' : 'inline-block'}
    >
      <SelectorLabel
        // TODO: handle disabled state
        onMouseDown={() => {
          if (isDisabled) return;
          setIsPressed(true);
        }}
        onMouseUp={() => {
          if (isDisabled) return;
          setIsPressed(false);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;
          if (e.key === ' ') {
            setIsPressed(true);
          }
        }}
        onKeyUp={(e) => {
          if (isDisabled) return;
          if (e.key === ' ') {
            setIsPressed(false);
          }
        }}
        inputProps={
          state.isReactNative
            ? // accessibility label for react-native needs to be added
              // since there is no text children inside Switch
              { ...inputProps, ...makeAccessible({ label: accessibilityLabel }) }
            : {}
        }
      >
        <SelectorInput
          hoverTokens={switchHoverTokens}
          ref={ref}
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
              isPressed={isPressed}
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
