/* eslint-disable @typescript-eslint/ban-types */
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import type { Theme } from '../BladeProvider';
import type { CheckboxIconProps } from './CheckboxIcon';
import type { InputProps } from './useCheckbox';
import { getIn, makeMotionTime } from '~utils';
import { screenReaderStyles } from '~components/VisuallyHidden';

type HoverProps = Pick<CheckboxIconProps, 'isNegative' | 'isDisabled'> & {
  isChecked: boolean;
};

const variants = {
  default: {
    background: {
      checked: 'colors.brand.primary.600',
      unchecked: 'colors.brand.gray.400',
    },
  },
};

const getHoverStyles = ({
  theme,
  isDisabled,
  isNegative,
  isChecked,
}: { theme: Theme } & HoverProps): CSSObject => {
  if (isDisabled || isNegative) return {};

  const checked = isChecked ? 'checked' : 'unchecked';
  const backgroundColor = variants.default.background[checked];

  return {
    backgroundColor: getIn(theme, backgroundColor),
    transitionTimingFunction: theme.motion.easing.standard.effective as string,
    transitionDuration: makeMotionTime(theme.motion.duration['2xquick']),
  };
};

const StyledInput = styled.input<HoverProps>(({ theme, isChecked, isDisabled, isNegative }) => ({
  ...screenReaderStyles,
  '&:focus + div': {
    // TODO: Replace with focus outline token
    outline: '1px solid white',
    boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
  },
  '&:hover + div, &:focus + div': {
    ...getHoverStyles({ theme, isChecked, isDisabled, isNegative }),
  },
}));

const CheckboxInput = ({
  inputProps,
  isChecked,
  isDisabled,
  isNegative,
}: HoverProps & { inputProps: InputProps }): React.ReactElement => {
  return (
    <StyledInput
      isChecked={isChecked}
      isDisabled={isDisabled}
      isNegative={isNegative}
      {...inputProps}
    />
  );
};

export { CheckboxInput };
