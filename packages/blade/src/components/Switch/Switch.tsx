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

  return (
    <BaseBox {...metaAttribute({ testID })} display={state.isReactNative ? 'flex' : 'inline-block'}>
      <SelectorLabel inputProps={state.isReactNative ? inputProps : {}}>
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
          {...makeAccessible({ hidden: true })}
          size={size}
          deviceType={matchedDeviceType}
          isDisabled={isDisabled}
          isChecked={state.isChecked}
        >
          <Thumb size={size} deviceType={matchedDeviceType} isChecked={state.isChecked}>
            <AnimatedThumb
              isChecked={state.isChecked}
              isDisabled={isDisabled}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
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
