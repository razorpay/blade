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
import { useBreakpoint } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import type { BladeElementRef } from '~utils/types';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

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
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
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

  const handlePointerPressedIn = React.useCallback(() => {
    if (isDisabled) return;
    setIsPressed(true);
  }, [isDisabled]);

  const handlePointerPressedOut = React.useCallback(() => {
    if (isDisabled) return;
    setIsPressed(false);
  }, [isDisabled]);

  const handleKeyboardPressedIn = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) return;
      if (e.key === ' ') {
        setIsPressed(true);
      }
    },
    [isDisabled],
  );

  const handleKeyboardPressedOut = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) return;
      if (e.key === ' ') {
        setIsPressed(false);
      }
    },
    [isDisabled],
  );

  return (
    <BaseBox
      {...metaAttribute({ testID, name: MetaConstants.Switch })}
      // @ts-ignore on rn inline-block is not valid but type here will be `flex | inline-block`
      display={state.isReactNative ? 'flex' : 'inline-block'}
    >
      <SelectorLabel
        componentName={MetaConstants.SwitchLabel}
        onTouchStart={handlePointerPressedIn}
        onTouchEnd={handlePointerPressedOut}
        onMouseDown={handlePointerPressedIn}
        onMouseUp={handlePointerPressedOut}
        onMouseOut={handlePointerPressedOut}
        onKeyDown={handleKeyboardPressedIn}
        onKeyUp={handleKeyboardPressedOut}
        style={{ cursor: 'pointer' }}
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
