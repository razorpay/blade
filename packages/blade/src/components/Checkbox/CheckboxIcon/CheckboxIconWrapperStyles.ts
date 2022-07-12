import type { CSSObject } from 'styled-components';
import getIn from '../../../utils/getIn';
import makeSize from '../../../utils/makeSize';
import makeSpace from '../../../utils/makeSpace';
import type { Theme } from '../../BladeProvider';
import type { CheckboxIconProps } from './CheckboxIcon';

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
      checked: 'colors.feedback.background.negative.highContrast',
      unchecked: 'colors.feedback.background.negative.highContrast',
    },
    background: {
      checked: 'colors.feedback.background.negative.highContrast',
      unchecked: 'colors.feedback.background.negative.lowContrast',
    },
  },
};

type WithChecked = {
  isChecked: boolean;
};

export type CheckboxRectProps = Omit<CheckboxIconProps, 'state'> & WithChecked;

const getBackgroundAndBorder = ({
  theme,
  isDisabled,
  isNegative,
  isChecked,
}: { theme: Theme } & CheckboxRectProps): CSSObject => {
  const variant = isDisabled ? 'disabled' : isNegative ? 'negative' : 'default';
  const checked = isChecked ? 'checked' : 'unchecked';
  const backgroundColor = variants[variant].background[checked];
  const borderColor = variants[variant].border[checked];
  return {
    backgroundColor: getIn(theme, backgroundColor),
    borderColor: getIn(theme, borderColor),
  };
};

const getCheckboxIconWrapperStyles = ({
  theme,
  isChecked,
  isDisabled,
  isNegative,
  isFocused,
}: CheckboxRectProps & { theme: Theme }): CSSObject => {
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
    ...(isFocused && { boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]!}` }),
    ...getBackgroundAndBorder({ theme, isChecked, isDisabled, isNegative }),
  };
};

export { getCheckboxIconWrapperStyles };
