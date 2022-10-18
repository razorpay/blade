import type { CSSObject } from 'styled-components';
import { checkboxIconColors, checkboxSizes } from '../checkboxTokens';
import type { CheckboxIconProps } from './CheckboxIcon';
import type { Theme } from '~components/BladeProvider';
import { getIn, makeBorderSize, makeSize, makeSpace } from '~utils';

// const variants = {
//   default: {
//     border: {
//       checked: 'colors.brand.primary.500',
//       unchecked: 'colors.brand.gray.400',
//     },
//     background: {
//       checked: 'colors.brand.primary.500',
//       unchecked: 'colors.brand.gray.200',
//     },
//   },
//   disabled: {
//     border: {
//       checked: 'colors.brand.gray.300',
//       unchecked: 'colors.brand.gray.300',
//     },
//     background: {
//       checked: 'colors.brand.gray.300',
//       unchecked: 'colors.brand.gray.300',
//     },
//   },
//   negative: {
//     border: {
//       checked: 'colors.feedback.border.negative.highContrast',
//       unchecked: 'colors.feedback.border.negative.highContrast',
//     },
//     background: {
//       checked: 'colors.feedback.background.negative.highContrast',
//       unchecked: 'colors.feedback.background.negative.lowContrast',
//     },
//   },
// };

export type CheckboxRectProps = Omit<CheckboxIconProps, 'state'> & {
  isChecked: boolean;
};

const getCheckboxIconWrapperStyles = ({
  theme,
  isChecked,
  isDisabled,
  isNegative,
  size,
}: CheckboxRectProps & { theme: Theme }): CSSObject => {
  let variant: 'default' | 'disabled' | 'negative' = 'default';
  if (isDisabled) variant = 'disabled';
  if (isNegative) variant = 'negative';
  const checked = isChecked ? 'checked' : 'unchecked';
  const background = checkboxIconColors.variants[variant].background[checked];
  const border = checkboxIconColors.variants[variant].border[checked];
  const backgroundColor = background === 'transparent' ? background : getIn(theme, background);
  const borderColor = border === 'transparent' ? border : getIn(theme, border);

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: makeSpace(checkboxSizes.icon[size].width),
    height: makeSpace(checkboxSizes.icon[size].height),
    borderWidth: makeBorderSize(theme.border.width.thick),
    borderStyle: 'solid',
    margin: makeSpace(theme.spacing[1]),
    borderRadius: makeSize(theme.border.radius.small),
    // marginRight: makeSpace(theme.spacing[3]),
    backgroundColor,
    borderColor,
  };
};

export { getCheckboxIconWrapperStyles };
