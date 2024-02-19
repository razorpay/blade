import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import { getInputVisualsToBeRendered } from './BaseInputVisuals';
import { baseInputHeight } from './baseInputConfig';
import type { Theme } from '~components/BladeProvider';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeSpace } from '~utils/makeSpace';
import { makeBorderSize } from '~utils/makeBorderSize';
import { getPlatformType } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

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
  size: NonNullable<BaseInputProps['size']>;
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
  let backgroundColor = theme.colors.surface.background.gray.intense;
  let borderColor = theme.colors.interactive.border.gray.default;
  let borderWidth: Theme['border']['width'][keyof Theme['border']['width']] =
    theme.border.width.thin;

  // hoverState
  if (isHovered) {
    backgroundColor = theme.colors.surface.background.gray.moderate;
    borderColor = theme.colors.interactive.border.gray.highlighted;
  }

  // focused state
  if (isFocused) {
    backgroundColor = theme.colors.surface.background.gray.moderate;
    borderColor = theme.colors.interactive.border.primary.default;
    borderWidth = theme.border.width.thin; // TODO: Check with design on why this is thick
  }

  // disabled state
  if (isDisabled) {
    backgroundColor = theme.colors.surface.background.gray.intense;
    borderColor = theme.colors.interactive.border.gray.disabled;
  }

  // validation state
  if (validationState === 'error') {
    backgroundColor = theme.colors.surface.background.gray.intense;
    borderColor = theme.colors.interactive.border.negative.default;
    borderWidth = theme.border.width.thin; // TODO: Check with design on why this is thick
  } else if (validationState === 'success') {
    backgroundColor = theme.colors.surface.background.gray.intense;
    borderColor = theme.colors.interactive.border.positive.default;
    borderWidth = theme.border.width.thin; // TODO: Check with design on why this is thick
  }

  return {
    backgroundColor,
    borderRadius: makeBorderSize(theme.border.radius.medium),
    borderWidth: makeBorderSize(borderWidth),
    borderColor,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: isTextArea ? 'flex-start' : undefined,
    position: 'relative',
    height: isDropdownTrigger ? 'auto' : undefined,
    '&:has(input:focus-visible)': {
      ...getFocusRingStyles({ theme, hasNoOffset: true }),
    },
  };
};

const inputPadding = {
  top: {
    medium: 3,
    large: 4,
  },
  bottom: {
    medium: 3,
    large: 4,
  },
  left: {
    medium: 4,
    large: 4,
  },
  right: {
    medium: 4,
    large: 4,
  },
} as const;

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

  return theme.spacing[inputPadding.left[size]];
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
  return theme.spacing[inputPadding.right[size]];
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
    ...getTextStyles({
      size,
      variant: 'body',
      weight: 'regular',
      color: isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle',
      theme,
    }),
    // take the full available width of parent container for input field
    flex: 1,
    backgroundColor: 'transparent',

    paddingTop: makeSpace(theme.spacing[inputPadding.top[size]]),
    paddingBottom: makeSpace(theme.spacing[inputPadding.bottom[size]]),
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
