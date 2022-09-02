import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import { getInputVisualsToBeRendered } from './BaseInputVisuals';
import type { Theme } from '~components/BladeProvider';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeSpace } from '~utils';

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
> & {
  isHovered?: boolean;
  isFocused?: boolean;
  theme: Theme;
};

export const getInputBackgroundAndBorderStyles = ({
  theme,
  isHovered,
  isFocused,
  isDisabled,
  validationState,
}: Pick<
  GetInputStyles,
  'theme' | 'isFocused' | 'isDisabled' | 'validationState' | 'isHovered'
>): CSSObject => {
  // normal state
  let backgroundColor = theme.colors.brand.gray[200];
  let borderBottomColor = theme.colors.brand.gray[400];

  //hoverState
  if (isHovered) {
    backgroundColor = theme.colors.brand.gray[300];
  }

  // focused state
  if (isFocused) {
    backgroundColor = theme.colors.brand.primary[300];
  }

  // disabled state
  if (isDisabled) {
    backgroundColor = theme.colors.brand.gray[200];
    borderBottomColor = theme.colors.brand.gray[300];
  }

  // validation state
  if (validationState === 'error') {
    backgroundColor = theme.colors.feedback.background.negative.lowContrast;
  } else if (validationState === 'success') {
    backgroundColor = theme.colors.feedback.background.positive.lowContrast;
  }

  return {
    backgroundColor,
    borderBottomColor,
    borderTopLeftRadius: makeBorderSize(theme.border.radius.small),
    borderTopRightRadius: makeBorderSize(theme.border.radius.small),
    borderBottomWidth: makeBorderSize(theme.border.width.thin),
    borderBottomStyle: 'solid',
  };
};

export const getInputBorderBottomColor = ({
  theme,
  validationState,
}: {
  theme: Theme;
  validationState: BaseInputProps['validationState'];
}): string => {
  let borderBottomColor = theme.colors.brand.primary[500];

  if (validationState === 'error') {
    borderBottomColor = theme.colors.feedback.border.negative.highContrast;
  } else if (validationState === 'success') {
    borderBottomColor = theme.colors.feedback.border.positive.highContrast;
  }

  return borderBottomColor;
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
  };
};
