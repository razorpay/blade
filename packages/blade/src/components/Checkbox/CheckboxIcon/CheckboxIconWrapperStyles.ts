import type { CSSObject } from 'styled-components';
import { checkboxIconColors, checkboxSizes } from '../checkboxTokens';
import type { CheckboxIconProps } from './CheckboxIcon';
import getIn from '~utils/lodashButBetter/get';
import type { Theme } from '~components/BladeProvider';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';

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
  const backgroundColor = getIn(theme, background);
  const borderColor = getIn(theme, border);

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: makeSpace(checkboxSizes.icon[size].width),
    height: makeSpace(checkboxSizes.icon[size].height),
    borderWidth: makeBorderSize(theme.border.width.thick),
    borderStyle: 'solid',
    margin: makeSpace(theme.spacing[1]),
    borderRadius: makeSize(theme.border.radius.small),
    backgroundColor,
    borderColor,
  };
};

export { getCheckboxIconWrapperStyles };
