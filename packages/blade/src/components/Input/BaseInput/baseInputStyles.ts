import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import { getBaseInputBorderStyles } from './getBaseInputBorderStyles';
import {
  baseInputBackgroundColor,
  baseInputBorderColor,
  baseInputBorderWidth,
  baseInputBorderlessBackgroundColor,
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
    ...getBaseInputBorderStyles({ theme, borderColor, borderWidth, isFocused }),
  };
};

const getLeftPadding = ({
  theme,
  isDropdownTrigger,
  hasLeadingIcon,
  hasPrefix,
  size,
}: {
  theme: Theme;
  hasLeadingIcon: boolean;
  hasPrefix: boolean;
  isDropdownTrigger: GetInputStyles['isDropdownTrigger'];
  size: GetInputStyles['size'];
}): number => {
  if (isDropdownTrigger) {
    return theme.spacing[0];
  }

  if (hasLeadingIcon || hasPrefix) {
    return theme.spacing[3];
  }

  return theme.spacing[baseInputPaddingTokens.left[size]];
};

const getRightPadding = ({
  theme,
  hasTrailingInteractionElement,
  hasSuffix,
  hasTrailingIcon,
  size,
}: {
  theme: Theme;
  hasTrailingInteractionElement: boolean;
  hasSuffix: boolean;
  hasTrailingIcon: boolean;
  size: GetInputStyles['size'];
}): number => {
  if (hasTrailingInteractionElement || hasSuffix || hasTrailingIcon) {
    return theme.spacing[3];
  }
  return theme.spacing[baseInputPaddingTokens.right[size]];
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
          size,
          weight: 'regular',
          color: isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle',
          theme,
        })
      : getTextStyles({
          size,
          variant: 'body',
          weight: 'regular',
          color: isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle',
          theme,
        })),

    // take the full available width of parent container for input field
    flex: 1,
    backgroundColor: theme.colors.transparent,

    paddingTop: makeSpace(theme.spacing[baseInputPaddingTokens.top[size]]),
    paddingBottom: makeSpace(theme.spacing[baseInputPaddingTokens.bottom[size]]),
    paddingLeft: makeSpace(
      getLeftPadding({ theme, isDropdownTrigger, hasLeadingIcon, hasPrefix, size }),
    ),
    paddingRight: getRightPadding({
      theme,
      hasTrailingInteractionElement,
      hasSuffix,
      hasTrailingIcon,
      size,
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
