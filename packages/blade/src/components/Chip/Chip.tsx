import React from 'react';
import getIn from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useChipGroupContext } from './ChipGroupContext';
import {
  chipIconSizes,
  chipTextSizes,
  chipColorTokens,
  getChipHoverTokens,
  chipHeightTokens,
  chipHorizontalPaddingTokens,
} from './chipTokens';
import type { ChipProps } from './types';
import { AnimatedChip } from './AnimatedChip';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { useCheckbox } from '~components/Checkbox/useCheckbox';
import { useRadio } from '~components/Radio/useRadio';
import { isReactNative, makeSize, useBreakpoint } from '~utils';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';

type OnChange = ({
  isChecked,
  event,
  value,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

const _Chip: React.ForwardRefRenderFunction<BladeElementRef, ChipProps> = (
  { isDisabled, value, children, icon: Icon, intent, testID, ...styledProps },
  ref,
) => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const groupProps = useChipGroupContext();
  const isInsideGroup = !isEmpty(groupProps);
  const [isPressed, setIsPressed] = React.useState(false);

  if (__DEV__) {
    if (!isInsideGroup) {
      throwBladeError({
        moduleName: 'Chip',
        message:
          '<Chip /> component should only be used within the context of a <ChipGroup /> component',
      });
    }
  }

  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _name = groupProps?.name;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const _isChecked = groupProps?.state?.isChecked(value!);
  // Check if the defaultValue property of groupProps is undefined
  const defaultChecked =
    typeof groupProps?.defaultValue === 'undefined'
      ? undefined // If undefined, defaultChecked is also undefined
      : groupProps?.defaultValue?.includes(value as string); // If multiple selection, check if value is in defaultValue array
  const useChip = groupProps?.selectionType === 'single' ? useRadio : useCheckbox;
  const _size = groupProps?.size || 'small';
  const _intent = intent ?? groupProps?.intent;

  const handleChange: OnChange = ({ isChecked, value }) => {
    if (isChecked) {
      groupProps?.state?.addValue(value!);
    } else {
      groupProps?.state?.removeValue(value!);
    }
  };

  const { state, inputProps } = useChip({
    defaultChecked,
    isChecked: _isChecked,
    isDisabled: _isDisabled,
    name: _name,
    value,
    onChange: handleChange,
  });

  const handlePointerPressedIn = React.useCallback(() => {
    if (_isDisabled) return;
    setIsPressed(true);
  }, [_isDisabled]);

  const handlePointerPressedOut = React.useCallback(() => {
    if (_isDisabled) return;
    setIsPressed(false);
  }, [_isDisabled]);

  const handleKeyboardPressedIn = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (_isDisabled) return;
      if (e.key === ' ') {
        setIsPressed(true);
      }
    },
    [_isDisabled],
  );

  const handleKeyboardPressedOut = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (_isDisabled) return;
      if (e.key === ' ') {
        setIsPressed(false);
      }
    },
    [_isDisabled],
  );

  let textVariant = 'unchecked';
  if (_isChecked && _intent) {
    textVariant = _intent;
  }
  if (_isDisabled) {
    textVariant = 'disabled';
  }
  const chipTextColor = chipColorTokens.text[textVariant];
  const chipIconColor = chipColorTokens.icon[textVariant];

  let intentVariant = 'unchecked';
  const stateVariant = _isDisabled ? 'disabled' : 'default';
  if (_isChecked && _intent) {
    intentVariant = _intent;
  }
  const chipBackgroundColor = chipColorTokens.background[intentVariant][stateVariant];
  const chipBorderColor = chipColorTokens.border[intentVariant][stateVariant];

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.Chip, testID })}
      {...getStyledProps(styledProps)}
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
    >
      <SelectorLabel
        componentName={MetaConstants.ChipLabel}
        onTouchStart={handlePointerPressedIn}
        onTouchEnd={handlePointerPressedOut}
        onMouseDown={handlePointerPressedIn}
        onMouseUp={handlePointerPressedOut}
        onMouseOut={handlePointerPressedOut}
        onKeyDown={handleKeyboardPressedIn}
        onKeyUp={handleKeyboardPressedOut}
        inputProps={isReactNative() ? inputProps : {}}
        style={{ cursor: _isDisabled ? 'not-allowed' : 'pointer' }}
      >
        <BaseBox display="flex" flexDirection="column">
          <BaseBox display="flex" alignItems="center" flexDirection="row">
            <SelectorInput
              hoverTokens={getChipHoverTokens(_intent)}
              isChecked={state.isChecked}
              isDisabled={_isDisabled}
              inputProps={inputProps}
              ref={ref}
            />
            <AnimatedChip
              borderColor={chipBorderColor}
              isDisabled={_isDisabled}
              isPressed={isPressed}
              isDesktop={matchedDeviceType === 'desktop'}
            >
              <BaseBox
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
                backgroundColor={chipBackgroundColor}
                borderRadius="max"
                borderWidth={['xsmall', 'small'].includes(_size) ? 'thinner' : 'thin'}
                paddingLeft={
                  chipHorizontalPaddingTokens[Boolean(Icon) ? 'withIcon' : 'withoutIcon'].left[
                    _size
                  ]
                }
                paddingRight={
                  chipHorizontalPaddingTokens[Boolean(Icon) ? 'withIcon' : 'withoutIcon'].right[
                    _size
                  ]
                }
                height={makeSize(chipHeightTokens[_size])}
                style={{
                  borderColor: _isChecked ? getIn(theme.colors, chipBorderColor) : 'transparent',
                }}
              >
                {Icon ? (
                  <BaseBox paddingRight="spacing.3" display="flex">
                    <Icon color={chipIconColor as never} size={chipIconSizes[_size]} />
                  </BaseBox>
                ) : null}
                <Text
                  {...chipTextSizes[_size]}
                  type="normal"
                  truncateAfterLines={1}
                  color={chipTextColor}
                >
                  {children}
                </Text>
              </BaseBox>
            </AnimatedChip>
          </BaseBox>
        </BaseBox>
      </SelectorLabel>
    </BaseBox>
  );
};

const Chip = assignWithoutSideEffects(React.forwardRef(_Chip), {
  displayName: 'Chip',
});

export { Chip };
export type { ChipProps };
