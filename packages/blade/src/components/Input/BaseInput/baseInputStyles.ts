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
  let backgroundColor = theme.colors.interactive.background.gray.default;
  let borderBottomColor = theme.colors.interactive.background.gray.highlighted;

  // hoverState
  if (isHovered) {
    backgroundColor = theme.colors.interactive.background.gray.highlighted;
  }

  // focused state
  if (isFocused) {
    backgroundColor = theme.colors.interactive.background.primary.faded;
  }

  // disabled state
  if (isDisabled) {
    backgroundColor = theme.colors.interactive.background.gray.disabled;
    borderBottomColor = 'transparent';
  }

  // validation state
  if (validationState === 'error') {
    backgroundColor = theme.colors.interactive.background.negative.faded;
    borderBottomColor = theme.colors.interactive.background.negative.default;
  } else if (validationState === 'success') {
    backgroundColor = theme.colors.interactive.background.positive.faded;
    borderBottomColor = theme.colors.interactive.background.positive.default;
  }

  return {
    backgroundColor,
    borderBottomColor,
    borderTopLeftRadius: makeBorderSize(theme.border.radius.small),
    borderTopRightRadius: makeBorderSize(theme.border.radius.small),
    borderBottomWidth: makeBorderSize(theme.border.width.thin),
    borderBottomStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: isTextArea ? 'flex-start' : undefined,
    position: 'relative',
    height: isDropdownTrigger ? 'auto' : undefined,
  };
};

const getLeftPadding = ({
  theme,
  isDropdownTrigger,
  hasLeadingIcon,
  hasPrefix,
}: {
  theme: Theme;
  hasLeadingIcon: boolean;
  hasPrefix: boolean;
  isDropdownTrigger: GetInputStyles['isDropdownTrigger'];
}): number => {
  if (isDropdownTrigger) {
    return theme.spacing[0];
  }

  if (hasLeadingIcon || hasPrefix) {
    return theme.spacing[3];
  }

  return theme.spacing[4];
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
      weight: 'regular',
      color: isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle',
      theme,
    }),
    // take the full available width of parent container for input field
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: makeSpace(theme.spacing[3]),
    paddingBottom: makeSpace(theme.spacing[3]),
    paddingLeft: makeSpace(getLeftPadding({ theme, isDropdownTrigger, hasLeadingIcon, hasPrefix })),
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
