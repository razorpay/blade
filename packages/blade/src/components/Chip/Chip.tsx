/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { useChipGroupContext } from './ChipGroup/ChipGroupContext';
// import { ChipIcon } from './ChipIcon';
import {
  chipHoverTokens,
  iconPadding,
  iconSize,
  horizontalPadding,
  verticalPadding,
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
   * @default "neutral"
   */
  variant?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
} & TestID &
  StyledPropsBlade;

// type ColorProps = {
//   iconColor: IconProps['color'];
//   textColor: BaseTextProps['color'];
//   borderColor: StyledChipProps['borderColor'];
//   backgroundColor?: StyledChipProps['backgroundColor'];
// };

type ColorProps = Record<string, string>;

const getColorProps = ({
  variant,
  isChecked,
  isDisabled,
}: {
  variant: NonNullable<ChipProps['variant']>;
  isChecked: boolean | undefined;
  isDisabled: boolean | undefined;
}): ColorProps => {
  const props: ColorProps = {
    iconColor: 'surface.text.subtle.lowContrast',
    textColor: 'surface.text.subtle.lowContrast',
    borderColor: 'brand.gray.400.lowContrast',
  };

  if (isDisabled) {
    props.textColor = 'surface.text.placeholder.lowContrast';
    props.iconColor = 'surface.text.placeholder.lowContrast';
  } else if (isChecked) {
    if (variant === 'neutral') {
      props.textColor = 'brand.primary.500';
      props.iconColor = 'brand.primary.500';
      props.borderColor = 'brand.primary.500';
      props.backgroundColor = 'brand.primary.300';
    }
    props.textColor = `feedback.text.${variant}.lowContrast`;
    props.iconColor = `feedback.text.${variant}.lowContrast`;
    props.borderColor = `feedback.action.primary.border.${variant}.lowContrast.default`;
    props.backgroundColor = `feedback.action.primary.background.${variant}.lowContrast.default`;
  }

  return props;
};

const _Chip: React.ForwardRefRenderFunction<BladeElementRef, ChipProps> = (
  {
    defaultChecked,
    isChecked,
    isDisabled,
    value,
    children,
    icon: Icon,
    size = 'small',
    variant = 'neutral',
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
  const { backgroundColor, iconColor, textColor, borderColor } = getColorProps({
    variant,
    isChecked,
    isDisabled,
  });
  console.log('🚀 ~ file: Chip.tsx:170 ~ borderColor:', variant, borderColor);

  const chipTextSizes = {
    small: {
      variant: 'body',
      size: 'xsmall',
    },
    medium: {
      variant: 'body',
      size: 'small',
    },
    large: {
      variant: 'body',
      size: 'small',
    },
  } as const;

  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _name = name ?? groupProps?.name;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const _isChecked = isChecked ?? groupProps?.state?.isChecked(value!);
  // const ChipIcon = groupProps?.selectionType === 'single' ? RadioIcon : CheckboxIcon;
  const useChip = groupProps?.selectionType === 'single' ? useRadio : useCheckbox;
  // const _size = groupProps?.size ?? size;

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

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.Chip, testID })}
      {...getStyledProps(styledProps)}
    >
      <SelectorLabel
        componentName={MetaConstants.ChipLabel}
        inputProps={isReactNative() ? inputProps : {}}
      >
        <BaseBox display="flex" flexDirection="column">
          <BaseBox display="flex" alignItems="center" flexDirection="row">
            <SelectorInput
              hoverTokens={chipHoverTokens}
              isChecked={state.isChecked}
              isDisabled={_isDisabled}
              inputProps={inputProps}
              ref={ref}
            />
            <StyledChip backgroundColor={backgroundColor} size={size} textAlign={'left' as never}>
              <BaseBox
                // paddingRight={Icon ? horizontalPadding.icon[size] : horizontalPadding.default[size]}
                // paddingLeft={horizontalPadding[Icon ? 'icon' : 'default'][size]}
                paddingRight="spacing.4"
                paddingLeft="spacing.4"
                borderColor={borderColor}
                display={(isReactNative() ? 'flex' : 'inline-flex') as never}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
              >
                {Icon ? (
                  <BaseBox
                    // paddingRight={Boolean(Icon) ? iconPadding[size] : 'spacing.0'}
                    display="flex"
                  >
                    <Icon color={iconColor} size={iconSize[size]} />
                  </BaseBox>
                ) : null}
                <Text
                  // {...badgeTextSizes[size]}
                  type="normal"
                  // weight={fontWeight}
                  truncateAfterLines={1}
                  // color={textColor}
                >
                  {children}
                </Text>
              </BaseBox>
            </StyledChip>
            {/* <ChipIcon size="small" isChecked={state.isChecked} isDisabled={_isDisabled} />
            <SelectorTitle size="small" isDisabled={_isDisabled}>
              {children}
            </SelectorTitle> */}
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
