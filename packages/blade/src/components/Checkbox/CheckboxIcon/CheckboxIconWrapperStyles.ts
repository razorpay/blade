import type { CSSObject } from 'styled-components';
import { checkboxIconColors, checkboxSizes } from '../checkboxTokens';
import type { CheckboxIconProps } from './CheckboxIcon';
import type { Theme } from '~components/BladeProvider';
import { getIn, makeBorderSize, makeSize, makeSpace } from '~utils';

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
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
