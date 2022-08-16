import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import { getInputVisualsToBeRendered } from './BaseInputVisuals';
import type { Theme } from '~components/BladeProvider';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { getPlatformType, makeBorderSize, makeSpace } from '~utils';

type GetInputStyles = Pick<
  BaseInputProps,
  | 'isDisabled'
  | 'validationState'
  | 'leadingIcon'
  | 'prefix'
  | 'interactionElement'
  | 'suffix'
  | 'trailingIcon'
> & {
  isFocused?: boolean;
  theme: Theme;
};

export const getInputBackgroundAndBorderStyles = ({
  theme,
  isFocused,
  isDisabled,
  validationState,
}: GetInputStyles): CSSObject => {
  // normal state
  let backgroundColor = theme.colors.brand.gray[200];
  let borderBottomColor = theme.colors.brand.gray[400];

  // focused state
  if (isFocused) {
    backgroundColor = theme.colors.brand.primary[300];
    borderBottomColor = theme.colors.brand.primary[500];
  }

  // disabled state
  if (isDisabled) {
    backgroundColor = theme.colors.brand.gray[200];
    borderBottomColor = theme.colors.brand.gray[300];
  }

  // validation state
  if (validationState === 'error') {
    backgroundColor = theme.colors.feedback.background.negative.lowContrast;
    borderBottomColor = theme.colors.feedback.border.negative.highContrast;
  } else if (validationState === 'success') {
    backgroundColor = theme.colors.feedback.background.positive.lowContrast;
    borderBottomColor = theme.colors.feedback.border.positive.highContrast;
  }

  return {
    backgroundColor,
    borderBottomColor,
    borderTopLeftRadius: makeBorderSize(theme.border.radius.small),
    borderTopRightRadius: makeBorderSize(theme.border.radius.small),
    borderBottomWidth: makeBorderSize(theme.border.width.thin),
  };
};

const makePaddingLeft = ({
  hasLeadingIcon,
  hasPrefix,
  spacing,
}: {
  hasLeadingIcon: boolean;
  hasPrefix: boolean;
  spacing: Theme['spacing'];
}): string => {
  let padding = spacing[3];

  if (hasLeadingIcon) {
    padding += spacing[4];
  }

  if (hasPrefix) {
    padding += spacing[2];
  }

  const leadingVisualsCount = [hasLeadingIcon, hasPrefix].filter(Boolean).length;

  // add the padding for the cursor on the right end if any of the visuals is present
  if (leadingVisualsCount) {
    padding += spacing[2];
  }
  // add the amount of spacing between leading visuals to the padding
  if (leadingVisualsCount === 2) {
    padding += spacing[1];
  }

  return makeSpace(padding);
};

const makePaddingRight = ({
  hasSuffix,
  hasInteractionElement,
  hasTrailingIcon,
  spacing,
}: {
  hasSuffix: boolean;
  hasInteractionElement: boolean;
  hasTrailingIcon: boolean;
  spacing: Theme['spacing'];
}): string => {
  let padding = spacing[3];

  if (hasInteractionElement) {
    padding += spacing[4];
  }

  if (hasSuffix) {
    padding += spacing[2];
  }

  if (hasTrailingIcon) {
    padding += spacing[4];
  }

  const trailingVisualsCount = [hasInteractionElement, hasSuffix, hasTrailingIcon].filter(Boolean)
    .length;

  // add the padding for the cursor on the right end if any of the visuals is present
  if (trailingVisualsCount) {
    padding += spacing[2];
  }
  // add the amount of spacing between trailing visuals to the padding
  if (trailingVisualsCount == 2) {
    padding += spacing[1];
  } else if (trailingVisualsCount == 3) {
    padding += spacing[2];
  }

  return makeSpace(padding);
};

const getBaseInputStyles = ({
  theme,
  isFocused,
  isDisabled,
  validationState,
  leadingIcon,
  prefix,
  interactionElement,
  suffix,
  trailingIcon,
}: GetInputStyles): CSSObject => {
  const isReactNative = getPlatformType() === 'react-native';

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

  return {
    ...getTextStyles({
      size: 'medium',
      variant: 'body',
      type: isDisabled ? 'placeholder' : 'subtle',
      weight: 'regular',
      contrast: 'low',
      theme,
    }),
    ...getInputBackgroundAndBorderStyles({ theme, isFocused, isDisabled, validationState }),
    paddingTop: makeSpace(theme.spacing[2]),
    paddingBottom: makeSpace(theme.spacing[2]),
    paddingLeft: makePaddingLeft({ hasLeadingIcon, hasPrefix, spacing: theme.spacing }),
    paddingRight: makePaddingRight({
      hasInteractionElement,
      hasSuffix,
      hasTrailingIcon,
      spacing: theme.spacing,
    }),
    width: '100%',
    ...(isReactNative ? { lineHeight: undefined } : {}),
    ...(isReactNative ? { height: '36px' } : {}),
  };
};

export default getBaseInputStyles;
