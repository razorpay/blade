import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { useChipGroupContext } from './ChipGroup/ChipGroupContext';
import {
  chipIconSizes,
  chipTextSizes,
  chipColorTokens,
  getChipHoverTokens,
  chipHeightTokens,
  chipHorizontalPaddingTokens,
} from './chipTokens';
import { AnimatedChip } from './AnimatedChip';
import type { IconComponent } from '~components/Icons';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import type { BladeElementRef } from '~utils/useBladeInnerRef';
import type { StringChildrenType, TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { useCheckbox } from '~components/Checkbox/useCheckbox';
import { useRadio } from '~components/Radio/useRadio';
import { isReactNative, useBreakpoint } from '~utils';
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

type ChipProps = {
  /**
   * Sets the label of the Chip
   */
  children: StringChildrenType;
  /**
   * Displays the Blade Icon component within the Chip
   * Accepts a component of type `IconComponent` from Blade.
   *
   */
  icon?: IconComponent;
  /**
   * If `true`, the Chip will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * The value to be used in the Chip input.
   * This is the value that will be returned on form submission.
   * Use `onChange` to update its value
   */
  value?: string;
} & TestID &
  StyledPropsBlade;

const _Chip: React.ForwardRefRenderFunction<BladeElementRef, ChipProps> = (
  { isDisabled, value, children, icon: Icon, testID, ...styledProps },
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
  const _intent = groupProps?.intent;

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

  const chipTextColor =
    chipColorTokens.text[_isDisabled ? 'disabled' : _isChecked && _intent ? _intent : 'unchecked'];
  const chipBackgroundColor =
    chipColorTokens.background[_isChecked && _intent ? _intent : 'unchecked'][
      _isDisabled ? 'disabled' : 'default'
    ];
  const chipBorderColor =
    chipColorTokens.border[_isChecked && _intent ? _intent : 'unchecked'][
      _isDisabled ? 'disabled' : 'default'
    ];

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
              borderColor={chipBorderColor as never}
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
                backgroundColor={chipBackgroundColor as never}
                borderRadius="max"
                borderWidth={['xsmall', 'small'].includes(_size) ? 'thinner' : 'thin'}
                paddingLeft={
                  chipHorizontalPaddingTokens[Boolean(Icon) ? 'icon' : 'default'].left[_size]
                }
                paddingRight={
                  chipHorizontalPaddingTokens[Boolean(Icon) ? 'icon' : 'default'].right[_size]
                }
                style={{
                  height: chipHeightTokens[_size],
                  borderColor: _isChecked ? 'inherit' : 'transparent',
                }}
              >
                {Icon ? (
                  <BaseBox paddingRight="spacing.3" display="flex">
                    <Icon color={chipTextColor as never} size={chipIconSizes[_size]} />
                  </BaseBox>
                ) : null}
                <Text
                  {...chipTextSizes[_size]}
                  type="normal"
                  truncateAfterLines={1}
                  color={chipTextColor as never}
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
