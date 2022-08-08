import type { CSSObject } from 'styled-components';
import type { BaseInputProps } from './baseInputHelpers';
import type { Theme } from '~components/BladeProvider';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeSpace } from '~utils';

export const getInputBackgroundAndBorderStyles = ({
  theme,
  isFocused,
  isDisabled,
  validationState,
}: Pick<BaseInputProps, 'isDisabled' | 'validationState'> & {
  isFocused?: boolean;
  theme: Theme;
}): CSSObject => {
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

const getBaseInputStyles = ({
  theme,
  isFocused,
  isDisabled,
  validationState,
}: Pick<BaseInputProps, 'isDisabled' | 'validationState'> & {
  isFocused?: boolean;
  theme: Theme;
}): CSSObject => ({
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
  paddingLeft: makeSpace(theme.spacing[3]),
  paddingRight: makeSpace(theme.spacing[3]),
  width: '100%',
});

export default getBaseInputStyles;
