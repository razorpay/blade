import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import { getInputVisualsToBeRendered } from './BaseInputVisuals';
import { BASEINPUT_DEFAULT_HEIGHT } from './baseInputConfig';
import type { Theme } from '~components/BladeProvider';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeSpace } from '~utils/makeSpace';
import { makeBorderSize } from '~utils/makeBorderSize';
import { getPlatformType } from '~utils';

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
> & {
  isHovered?: boolean;
  isFocused?: boolean;
  isTextArea?: boolean;
  hasTags?: boolean;
  theme: Theme;
};

export const getInputBackgroundAndBorderStyles = ({
  theme,
  isHovered,
  isFocused,
  isDisabled,
  validationState,
  isTextArea,
  isDropdownTrigger,
}: Pick<
  GetInputStyles,
  | 'theme'
  | 'isFocused'
  | 'isDisabled'
  | 'validationState'
  | 'isHovered'
  | 'isTextArea'
  | 'isDropdownTrigger'
>): CSSObject => {
  // normal state
  let backgroundColor = theme.colors.brand.gray.a50.lowContrast;
  let borderBottomColor = theme.colors.brand.gray.a100.lowContrast;

  // hoverState
  if (isHovered) {
    backgroundColor = theme.colors.brand.gray.a100.lowContrast;
  }

  // focused state
  if (isFocused) {
    backgroundColor = theme.colors.brand.primary[300];
  }

  // disabled state
  if (isDisabled) {
    backgroundColor = theme.colors.brand.gray.a50.lowContrast;
    borderBottomColor = theme.colors.brand.gray[300].lowContrast;
  }

  // validation state
  if (validationState === 'error') {
    backgroundColor = theme.colors.feedback.background.negative.lowContrast;
    borderBottomColor = theme.colors.feedback.border.negative.highContrast;
  } else if (validationState === 'success') {
    backgroundColor = theme.colors.feedback.background.positive.lowContrast;
    borderBottomColor = theme.colors.feedback.border.positive.highContrast;
  }

  const dropdownTriggerStyles: CSSObject = isDropdownTrigger
    ? {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: isTextArea ? 'flex-start' : undefined,
        position: 'relative',
        height: 'auto',
      }
    : {};

  return {
    backgroundColor,
    borderBottomColor,
    borderTopLeftRadius: makeBorderSize(theme.border.radius.small),
    borderTopRightRadius: makeBorderSize(theme.border.radius.small),
    borderBottomWidth: makeBorderSize(theme.border.width.thin),
    borderBottomStyle: 'solid',
    ...dropdownTriggerStyles,
  };
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
  });

  const isDropdownWithTags = isDropdownTrigger && hasTags;
  const isReactNative = getPlatformType() === 'react-native';

  return {
    ...getTextStyles({
      size: 'medium',
      variant: 'body',
      type: isDisabled ? 'placeholder' : 'subtle',
      weight: 'regular',
      contrast: 'low',
      theme,
    }),
    // take the full available width of parent container for input field
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: makeSpace(theme.spacing[3]),
    paddingBottom: makeSpace(theme.spacing[3]),
    paddingLeft:
      hasLeadingIcon || hasPrefix ? makeSpace(theme.spacing[3]) : makeSpace(theme.spacing[4]),
    paddingRight:
      hasInteractionElement || hasSuffix || hasTrailingIcon
        ? makeSpace(theme.spacing[3])
        : makeSpace(theme.spacing[4]),
    textAlign,
    width: '100%',
    height: isTextArea || isDropdownWithTags ? undefined : makeSpace(BASEINPUT_DEFAULT_HEIGHT),
    minHeight: isDropdownWithTags ? undefined : makeSpace(BASEINPUT_DEFAULT_HEIGHT),
    ...(isReactNative ? {} : { resize: 'none' }),
  };
};
