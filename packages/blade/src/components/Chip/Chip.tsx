/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { useChipGroupContext } from './ChipGroup/ChipGroupContext';
// import { ChipIcon } from './ChipIcon';
import {
  iconPadding,
  iconSize,
  chipHorizontalPaddingTokens,
  chipColorTokens,
  getChipHoverTokens,
} from './chipTokens';
import { StyledChip } from './StyledChip';
import { IconComponent, IconProps } from '~components/Icons';
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
import { isReactNative } from '~utils';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { Text } from '~components/Typography';
import type { Feedback } from '~tokens/theme/theme';
import { StyledChipProps } from './types';

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
   * If `true`, the Chip will be initially checked. This also makes the Chip uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Displays the Blade Icon component within the Chip
   * Accepts a component of type `IconComponent` from Blade.
   *
   */
  icon?: IconComponent;
  /**
   * If `true`, The Chip will be checked. This also makes the Chip controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the Chip will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Specifies the size of the rendered Chip
   *
   * @default "small"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * The value to be used in the Chip input.
   * This is the value that will be returned on form submission.
   * Use `onChange` to update its value
   */
  value?: string;
  /**
   * Sets the Chip's visual variant
   *
   */
  variant?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
} & TestID &
  StyledPropsBlade;

const _Chip: React.ForwardRefRenderFunction<BladeElementRef, ChipProps> = (
  {
    defaultChecked,
    isChecked,
    isDisabled,
    value,
    children,
    icon: Icon,
    size = 'small',
    variant,
    testID,
    ...styledProps
  },
  ref,
) => {
  const groupProps = useChipGroupContext();
  if (__DEV__) {
    // mandate value prop when using inside group
    if (!value && !isEmpty(groupProps)) {
      throw new Error(
        `[Blade Chip]: <ChipGroup /> requires that you pass unique "value" prop to each <Chip />
      <ChipGroup>
        <Chip value="apple">Apple</Chip>
        <Chip value="mango">Mango</Chip>
      </ChipGroup>
      `,
      );
    }
  }

  const chipTextSizes = {
    xsmall: {
      variant: 'body',
      size: 'small',
    },
    small: {
      variant: 'body',
      size: 'medium',
    },
    medium: {
      variant: 'body',
      size: 'large',
    },
    large: {
      variant: 'body',
      size: 'large',
    },
  } as const;

  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _name = name ?? groupProps?.name;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const _isChecked = isChecked ?? groupProps?.state?.isChecked(value!);
  const useChip = groupProps?.selectionType === 'single' ? useRadio : useCheckbox;
  const _size = groupProps?.size ?? size;
  const _variant = variant ?? groupProps?.variant;

  const handleChange: OnChange = ({ isChecked, value }) => {
    if (isChecked) {
      if (groupProps?.selectionType === 'single') {
        groupProps?.state?.setValue(value!);
      } else {
        groupProps?.state?.addValue(value!);
      }
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

  const chipTextColor =
    chipColorTokens.text[
      _isDisabled ? 'disabled' : _isChecked && _variant ? _variant : 'unchecked'
    ];
  const chipBackgroundColor =
    chipColorTokens.background[_isChecked && _variant ? _variant : 'unchecked'][
      _isDisabled ? 'disabled' : 'default'
    ];
  const chipBorderColor =
    chipColorTokens.border[_isChecked && _variant ? _variant : 'unchecked'][
      _isDisabled ? 'disabled' : 'default'
    ];

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.Chip, testID })}
      {...getStyledProps(styledProps)}
    >
      <SelectorLabel
        componentName={MetaConstants.ChipLabel}
        inputProps={isReactNative() ? inputProps : {}}
        style={{ cursor: _isDisabled ? 'not-allowed' : 'pointer' }}
      >
        <BaseBox display="flex" flexDirection="column">
          <BaseBox display="flex" alignItems="center" flexDirection="row">
            <SelectorInput
              hoverTokens={getChipHoverTokens(_variant)}
              isChecked={state.isChecked}
              isDisabled={_isDisabled}
              inputProps={inputProps}
              ref={ref}
            />
            <StyledChip
              backgroundColor={chipBackgroundColor as never}
              borderColor={chipBorderColor as never}
              size={_size}
              paddingLeft={
                chipHorizontalPaddingTokens[Icon ? 'icon' : 'default'].left[_size] as never
              }
              paddingRight={
                chipHorizontalPaddingTokens[Icon ? 'icon' : 'default'].right[_size] as never
              }
              textAlign={'left' as never}
              display={(isReactNative() ? 'flex' : 'inline-flex') as never}
            >
              <BaseBox
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
                display="flex"
              >
                {Icon ? (
                  <BaseBox paddingRight="spacing.3" display="flex">
                    <Icon color={chipTextColor as never} size={iconSize[size]} />
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
            </StyledChip>
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
