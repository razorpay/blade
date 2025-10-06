import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import { getBaseInputBorderStyles } from './getBaseInputBorderStyles';
import {
  baseInputBackgroundColor,
  baseInputBorderColor,
  baseInputBorderWidth,
  baseInputBorderlessBackgroundColor,
  baseInputCounterInputPaddingTokens,
  baseInputHeight,
  baseInputPaddingTokens,
  baseInputWrapperMaxHeight,
} from './baseInputTokens';
import { getInputVisualsToBeRendered } from './BaseInputVisuals';
import type { BaseInputWrapperProps } from './types';
import type { Theme } from '~components/BladeProvider';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeSpace } from '~utils/makeSpace';
import { makeBorderSize } from '~utils/makeBorderSize';
import { getPlatformType } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import getHeadingStyles from '~components/Typography/Heading/getHeadingStyles';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type GetInputStyles = Pick<
  BaseInputProps,
  | 'isDisabled'
  | 'validationState'
  | 'leadingIcon'
  | 'prefix'
  | 'trailingInteractionElement'
  | 'leadingInteractionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'textAlign'
  | 'isDropdownTrigger'
  | 'valueComponentType'
> & {
  isHovered?: boolean;
  isFocused?: boolean;
  isTextArea?: boolean;
  hasTags?: boolean;
  theme: Theme;
  size: NonNullable<BaseInputProps['size']>;
  isTableInputCell: NonNullable<BaseInputProps['isTableInputCell']>;
  hasLeadingDropdown?: boolean;
  color?: BaseTextProps['color'];
  disabledColor?: BaseTextProps['color'];
  isInsideCounterInput?: boolean;
};

export const getBaseInputState = ({
  isFocused,
  isHovered,
  isDisabled,
}: {
  isFocused?: boolean;
  isHovered?: boolean;
  isDisabled?: boolean;
}): 'focused' | 'hovered' | 'disabled' | 'default' => {
  if (isDisabled) {
    return 'disabled';
  } else if (isFocused) {
    return 'focused';
  } else if (isHovered) {
    return 'hovered';
  } else {
    return 'default';
  }
};

export const getInputBackgroundAndBorderStyles = ({
  theme,
  isHovered,
  isFocused,
  isDisabled,
  validationState,
  isTextArea,
  isDropdownTrigger,
  isTableInputCell,
}: Pick<
  GetInputStyles,
  | 'theme'
  | 'isFocused'
  | 'isDisabled'
  | 'validationState'
  | 'isHovered'
  | 'isTextArea'
  | 'isDropdownTrigger'
  | 'isTableInputCell'
>): CSSObject => {
  // normal state
  const backgroundColorTokens = isTableInputCell
    ? baseInputBorderlessBackgroundColor
    : baseInputBackgroundColor;
  let backgroundColor = getIn(theme.colors, backgroundColorTokens.default);
  let borderColor = isTableInputCell
    ? theme.colors.transparent
    : getIn(theme.colors, baseInputBorderColor.default);
  let borderWidth = getIn(theme.border.width, baseInputBorderWidth.default);
  let zIndex: number | undefined;

  const baseInputState = getBaseInputState({ isFocused, isHovered, isDisabled });

  backgroundColor = getIn(theme.colors, backgroundColorTokens[baseInputState]);
  borderColor =
    isTableInputCell && baseInputState !== 'focused'
      ? theme.colors.transparent
      : getIn(theme.colors, baseInputBorderColor[baseInputState]);
  borderWidth = getIn(theme.border.width, baseInputBorderWidth[baseInputState]);

  if (!isTableInputCell && validationState && validationState !== 'none') {
    borderColor = getIn(theme.colors, baseInputBorderColor[validationState]);
    borderWidth = getIn(theme.border.width, baseInputBorderWidth[validationState]);
    zIndex = 1; // Prevent validation ring clipping by adjacent inputs in InputGroup
  } else if (validationState && validationState !== 'none') {
    backgroundColor = getIn(theme.colors, baseInputBorderlessBackgroundColor[validationState]);
  }
  return {
    backgroundColor,
    borderRadius: makeBorderSize(
      isTableInputCell ? theme.border.radius.none : theme.border.radius.medium,
    ),
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: isTextArea ? 'flex-start' : undefined,
    position: 'relative',
    height: isDropdownTrigger && !isTextArea ? 'auto' : undefined,
    border: 'none',
    zIndex,
    ...getBaseInputBorderStyles({ theme, borderColor, borderWidth, isFocused }),
  };
};

const getLeftPadding = ({
  theme,
  isDropdownTrigger,
  hasLeadingIcon,
  hasPrefix,
  size,
  hasLeadingDropdown,
  isInsideCounterInput,
}: {
  theme: Theme;
  hasLeadingIcon: boolean;
  hasPrefix: boolean;
  isDropdownTrigger: GetInputStyles['isDropdownTrigger'];
  size: GetInputStyles['size'];
  hasLeadingDropdown: boolean;
  isInsideCounterInput?: boolean;
}): number => {
  if (isDropdownTrigger) {
    return theme.spacing[0];
  }

  if (hasLeadingIcon || hasPrefix || hasLeadingDropdown) {
    return theme.spacing[3];
  }

  /**
   * CounterInput uses tighter padding (4px vs 8-12px) for compact design
   */
  if (isInsideCounterInput) {
    return theme.spacing[baseInputCounterInputPaddingTokens.left[size]];
  }

  return theme.spacing[baseInputPaddingTokens.left[size]];
};

const getRightPadding = ({
  theme,
  hasTrailingInteractionElement,
  hasSuffix,
  hasTrailingIcon,
  size,
  isInsideCounterInput,
}: {
  theme: Theme;
  hasTrailingInteractionElement: boolean;
  hasSuffix: boolean;
  hasTrailingIcon: boolean;
  size: GetInputStyles['size'];
  isInsideCounterInput?: boolean;
}): number => {
  if (hasTrailingInteractionElement || hasSuffix || hasTrailingIcon) {
    return theme.spacing[3];
  }

  // CounterInput uses compact padding
  if (isInsideCounterInput) {
    return theme.spacing[baseInputCounterInputPaddingTokens.right[size]];
  }
  return theme.spacing[baseInputPaddingTokens.right[size]];
};

const getTopPadding = ({
  theme,
  size,
  isInsideCounterInput,
}: {
  theme: Theme;
  size: GetInputStyles['size'];
  isInsideCounterInput?: boolean;
}): number => {
  // CounterInput uses compact padding
  if (isInsideCounterInput) {
    return theme.spacing[baseInputCounterInputPaddingTokens.top[size]];
  }
  return theme.spacing[baseInputPaddingTokens.top[size]];
};

const getBottomPadding = ({
  theme,
  size,
  isInsideCounterInput,
}: {
  theme: Theme;
  size: GetInputStyles['size'];
  isInsideCounterInput?: boolean;
}): number => {
  // CounterInput uses compact padding
  if (isInsideCounterInput) {
    return theme.spacing[baseInputCounterInputPaddingTokens.top[size]];
  }
  return theme.spacing[baseInputPaddingTokens.bottom[size]];
};

export const getBaseInputStyles = ({
  theme,
  isDisabled,
  leadingIcon,
  prefix,
  trailingInteractionElement,
  leadingInteractionElement,
  suffix,
  trailingIcon,
  textAlign,
  isTextArea,
  hasTags,
  isDropdownTrigger,
  size,
  valueComponentType,
  hasLeadingDropdown = false,
  color,
  disabledColor,
  isInsideCounterInput,
}: GetInputStyles): CSSObject => {
  const {
    hasLeadingIcon,
    hasPrefix,
    hasTrailingInteractionElement,
    hasSuffix,
    hasTrailingIcon,
  } = getInputVisualsToBeRendered({
    leadingIcon,
    prefix,
    trailingInteractionElement,
    leadingInteractionElement,
    suffix,
    trailingIcon,
    size,
  });

  const isDropdownWithTags = isDropdownTrigger && hasTags;
  const isReactNative = getPlatformType() === 'react-native';
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const shouldHaveFlexibleHeight = isTextArea || isDropdownWithTags;

  return {
    ...(valueComponentType === 'heading'
      ? getHeadingStyles({
          size: size === 'xsmall' ? 'small' : size,
          weight: 'regular',
          color: isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle',
          theme,
        })
      : getTextStyles({
          /**
           * CounterInput: uses 'small' size for xsmall and 'semibold' weight for prominence
           */
          size: isInsideCounterInput && size === 'xsmall' ? 'small' : size,
          variant: 'body',
          weight: isInsideCounterInput ? 'semibold' : 'regular',
          color: isDisabled
            ? disabledColor ?? 'surface.text.gray.disabled'
            : color ?? 'surface.text.gray.subtle',
          theme,
        })),

    // take the full available width of parent container for input field
    flex: 1,
    backgroundColor: theme.colors.transparent,

    paddingTop: makeSpace(getTopPadding({ theme, size, isInsideCounterInput })),
    paddingBottom: makeSpace(getBottomPadding({ theme, size, isInsideCounterInput })),
    paddingLeft: makeSpace(
      getLeftPadding({
        theme,
        isDropdownTrigger,
        hasLeadingIcon,
        hasPrefix,
        size,
        hasLeadingDropdown,
        isInsideCounterInput,
      }),
    ),
    paddingRight: getRightPadding({
      theme,
      hasTrailingInteractionElement,
      hasSuffix,
      hasTrailingIcon,
      size,
      isInsideCounterInput,
    }),

    textAlign,
    width: '100%',
    height: shouldHaveFlexibleHeight ? undefined : makeSpace(baseInputHeight[size]),
    minHeight: shouldHaveFlexibleHeight ? undefined : makeSpace(baseInputHeight[size]),
    ...(isReactNative ? {} : { resize: 'none' }),
  };
};

export const getAnimatedBaseInputWrapperMaxHeight = ({
  maxTagRows,
  showAllTags,
  size,
}: Pick<BaseInputWrapperProps, 'maxTagRows' | 'showAllTags' | 'size'>): number => {
  if (maxTagRows === 'single') {
    return baseInputHeight[size];
  }

  if (maxTagRows === 'multiple') {
    return baseInputWrapperMaxHeight[size];
  }

  // In expandable, max-height depends on the state
  return showAllTags ? baseInputWrapperMaxHeight[size] : baseInputHeight[size];
};
