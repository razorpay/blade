import type { CSSObject } from 'styled-components';
import type { CheckboxIconProps } from './CheckboxIcon';
import type { Theme } from '~components/BladeProvider';
import { getIn, makeSize, makeSpace } from '~utils';

const variants = {
  default: {
    border: {
      checked: 'colors.brand.primary.500',
      unchecked: 'colors.brand.gray.400',
    },
    background: {
      checked: 'colors.brand.primary.500',
      unchecked: 'colors.brand.gray.200',
    },
  },
  disabled: {
    border: {
      checked: 'colors.brand.gray.300',
      unchecked: 'colors.brand.gray.300',
    },
    background: {
      checked: 'colors.brand.gray.300',
      unchecked: 'colors.brand.gray.300',
    },
  },
  negative: {
    border: {
      checked: 'colors.feedback.border.negative.highContrast',
      unchecked: 'colors.feedback.border.negative.highContrast',
    },
    background: {
      checked: 'colors.feedback.background.negative.highContrast',
      unchecked: 'colors.feedback.background.negative.lowContrast',
    },
  },
};

export type CheckboxRectProps = Omit<CheckboxIconProps, 'state'> & {
  isChecked: boolean;
};

const getCheckboxIconWrapperStyles = ({
  theme,
  isChecked,
  isDisabled,
  isNegative,
}: CheckboxRectProps & { theme: Theme }): CSSObject => {
  let variant: 'default' | 'disabled' | 'negative' = 'default';
  if (isDisabled) variant = 'disabled';
  if (isNegative) variant = 'negative';
  const checked = isChecked ? 'checked' : 'unchecked';
  const backgroundColor = variants[variant].background[checked];
  const borderColor = variants[variant].border[checked];

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    margin: '0px',
    marginTop: '3px',
    borderRadius: makeSize(theme.border.radius.small),
    marginRight: makeSpace(theme.spacing[2]),
    backgroundColor: getIn(theme, backgroundColor),
    borderColor: getIn(theme, borderColor),
  };
};

export { getCheckboxIconWrapperStyles };
