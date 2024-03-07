import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import { getInputVisualsToBeRendered } from './BaseInputVisuals';
import { getBaseInputBorderStyles } from './getBaseInputBorderStyles';
import {
  baseInputBackgroundColor,
  baseInputBorderColor,
  baseInputBorderWidth,
  baseInputHeight,
  baseInputPaddingTokens,
} from './baseInputTokens';
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
  | 'interactionElement'
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
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
}: Pick<
  GetInputStyles,
  | 'theme'
  | 'isFocused'
  | 'isDisabled'
  | 'validationState'
  | 'isHovered'
  | 'isTextArea'
  | 'isDropdownTrigger'
> & {
  borderBottomLeftRadius: NonNullable<BaseInputProps['borderBottomLeftRadius']>;
  borderBottomRightRadius: NonNullable<BaseInputProps['borderBottomRightRadius']>;
  borderTopLeftRadius: NonNullable<BaseInputProps['borderTopLeftRadius']>;
  borderTopRightRadius: NonNullable<BaseInputProps['borderTopRightRadius']>;
}): CSSObject => {
  // normal state
  let backgroundColor = getIn(theme.colors, baseInputBackgroundColor.default);
  let borderColor = getIn(theme.colors, baseInputBorderColor.default);
  let borderWidth = getIn(theme.border.width, baseInputBorderWidth.default);

  const baseInputState = getBaseInputState({ isFocused, isHovered, isDisabled });

  backgroundColor = getIn(theme.colors, baseInputBackgroundColor[baseInputState]);
  borderColor = getIn(theme.colors, baseInputBorderColor[baseInputState]);
  borderWidth = getIn(theme.border.width, baseInputBorderWidth[baseInputState]);

  if (validationState === 'error') {
    borderColor = getIn(theme.colors, baseInputBorderColor.error);
    borderWidth = getIn(theme.border.width, baseInputBorderWidth.error);
  } else if (validationState === 'success') {
    borderColor = getIn(theme.colors, baseInputBorderColor.success);
    borderWidth = getIn(theme.border.width, baseInputBorderWidth.success);
  }

  return {
    backgroundColor,
    borderBottomLeftRadius: makeBorderSize(getIn(theme.border.radius, borderBottomLeftRadius)),
    borderBottomRightRadius: makeBorderSize(getIn(theme.border.radius, borderBottomRightRadius)),
    borderTopLeftRadius: makeBorderSize(getIn(theme.border.radius, borderTopLeftRadius)),
    borderTopRightRadius: makeBorderSize(getIn(theme.border.radius, borderTopRightRadius)),
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: isTextArea ? 'flex-start' : undefined,
    position: 'relative',
    height: isDropdownTrigger ? 'auto' : undefined,
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
  hasInteractionElement,
  hasSuffix,
  hasTrailingIcon,
  size,
}: {
  theme: Theme;
  hasInteractionElement: boolean;
  hasSuffix: boolean;
  hasTrailingIcon: boolean;
  size: GetInputStyles['size'];
}): number => {
  if (hasInteractionElement || hasSuffix || hasTrailingIcon) {
    return theme.spacing[3];
  }
  return theme.spacing[baseInputPaddingTokens.right[size]];
};

export const getBaseInputStyles = ({
  theme,
  isDisabled,
  leadingIcon,
  prefix,
  interactionElement,
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
    hasInteractionElement,
    hasSuffix,
    hasTrailingIcon,
  } = getInputVisualsToBeRendered({
    leadingIcon,
    prefix,
    interactionElement,
    suffix,
    trailingIcon,
    size,
  });

  const isDropdownWithTags = isDropdownTrigger && hasTags;
  const isReactNative = getPlatformType() === 'react-native';

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
    backgroundColor: 'transparent',

    paddingTop: makeSpace(theme.spacing[baseInputPaddingTokens.top[size]]),
    paddingBottom: makeSpace(theme.spacing[baseInputPaddingTokens.bottom[size]]),
    paddingLeft: makeSpace(
      getLeftPadding({ theme, isDropdownTrigger, hasLeadingIcon, hasPrefix, size }),
    ),
    paddingRight: getRightPadding({
      theme,
      hasInteractionElement,
      hasSuffix,
      hasTrailingIcon,
      size,
    }),

    textAlign,
    width: '100%',
    height: isTextArea || isDropdownWithTags ? undefined : makeSpace(baseInputHeight[size]),
    minHeight: isDropdownWithTags ? undefined : makeSpace(baseInputHeight[size]),
    ...(isReactNative ? {} : { resize: 'none' }),
  };
};
