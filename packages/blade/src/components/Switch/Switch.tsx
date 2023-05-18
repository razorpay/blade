import isNumber from 'lodash/isNumber';
import React from 'react';
import styled from 'styled-components';
import { CheckIcon } from './CheckIcon';
import type { SwitchProps } from './types';
import { switchIconColors, switchSizes } from './switchTokens';
import { Thumb } from './Thumb';
import { SwitchButton } from './SwitchButton';
import { AnimatedThumb } from './AnimatedThumb';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { useCheckbox } from '~components/Checkbox/useCheckbox';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import useInteraction from '~src/hooks/useInteraction';
import type { ActionStates } from '~tokens/theme/theme';
import {
  getIn,
  isReactNative,
  makeAccessible,
  makeMotionTime,
  makeSize,
  makeSpace,
  useBreakpoint,
} from '~utils';

const SwitchTrack = styled(BaseBox)<{
  size: 'small' | 'medium';
  deviceType: 'mobile' | 'desktop';
  isDisabled?: boolean;
  isChecked?: boolean;
  currentInteraction: keyof ActionStates;
}>(({ currentInteraction, theme, size, deviceType, isDisabled, isChecked }) => {
  let variant: 'default' | 'disabled' | 'hover' | 'focus' = 'default';
  if (isDisabled) variant = 'disabled';
  if (currentInteraction === 'hover') variant = 'hover';
  if (currentInteraction === 'active') variant = 'focus';
  const checked = isChecked ? 'checked' : 'unchecked';
  const background = switchIconColors.variants[variant].background[checked];
  const backgroundColor = getIn(theme, background);

  const width = switchSizes.track[deviceType][size].width;
  const height = switchSizes.track[deviceType][size].height;

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: isNumber(width) ? makeSize(width) : makeSpace(getIn(theme, width)),
    height: isNumber(height) ? makeSize(height) : makeSpace(getIn(theme, height)),
    borderRadius: makeSize(theme.border.radius.max),
    backgroundColor,
    transitionTimingFunction: `${theme.motion.easing.standard.effective}`,
    transitionDuration: `${makeMotionTime(theme.motion.duration['2xquick'])}`,
  };
});

const Switch = ({
  defaultChecked,
  isChecked,
  isDisabled,
  name,
  onChange,
  size = 'medium',
  value,
  accessibilityLabel,
  id,
}: SwitchProps): React.ReactElement => {
  const { state, inputProps } = useCheckbox({
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
  const { currentInteraction, setCurrentInteraction, ...syntheticEvents } = useInteraction();

  return (
    <BaseBox display={isReactNative() ? 'flex' : 'inline-block'}>
      <SwitchButton
        id={id}
        onClick={() => {
          state.setChecked((prev) => !prev);
        }}
        {...syntheticEvents}
        {...makeAccessible({
          role: 'switch',
          checked: state.isChecked,
          disabled: isDisabled,
          label: accessibilityLabel,
        })}
        disabled={isDisabled}
      >
        <SwitchTrack
          size={size}
          deviceType={matchedDeviceType}
          isDisabled={isDisabled}
          isChecked={state.isChecked}
          currentInteraction={currentInteraction}
        >
          <Thumb size={size} deviceType={matchedDeviceType} isChecked={state.isChecked}>
            <AnimatedThumb
              isChecked={state.isChecked}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              size={size}
            >
              <CheckIcon isChecked={state.isChecked} isDisabled={isDisabled} size={size} />
            </AnimatedThumb>
          </Thumb>
        </SwitchTrack>
      </SwitchButton>
      <SelectorInput
        tabIndex={-1}
        isChecked={state.isChecked}
        isDisabled={isDisabled}
        hasError={false}
        inputProps={inputProps}
        accessibilityLabel={accessibilityLabel}
      />
    </BaseBox>
  );
};

export { Switch };
