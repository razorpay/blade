/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { castWebType, getIn, makeMotionTime } from '~utils';
import { screenReaderStyles } from '~components/VisuallyHidden';

type HoverProps = {
  isChecked?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
};

const variants = {
  default: {
    background: {
      checked: 'colors.brand.primary.600',
      unchecked: 'colors.brand.gray.a50.lowContrast',
    },
    border: {
      checked: 'colors.brand.primary.600',
      unchecked: 'colors.brand.gray.500.lowContrast',
    },
  },
};

const getHoverStyles = ({
  theme,
  isDisabled,
  hasError,
  isChecked,
}: { theme: Theme } & HoverProps): CSSObject => {
  if (isDisabled || hasError) return {};

  const checked = isChecked ? 'checked' : 'unchecked';
  const backgroundColor = variants.default.background[checked];
  const borderColor = variants.default.border[checked];

  return {
    borderColor: getIn(theme, borderColor),
    backgroundColor: getIn(theme, backgroundColor),
    transitionTimingFunction: theme.motion.easing.standard.effective as string,
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
  };
};

const StyledInput = styled.input<HoverProps>(({ theme, isChecked, isDisabled, hasError }) => ({
  ...screenReaderStyles,
  '&:focus + div': {
    // TODO: Replace with focus outline token
    outline: '1px solid white',
    boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
  },
  '&:hover + div, &:focus + div': {
    ...getHoverStyles({ theme, isChecked, isDisabled, hasError }),
  },
}));

const SelectorInput = ({
  inputProps,
  isChecked,
  isDisabled,
  hasError,
  tabIndex,
}: HoverProps & { inputProps: any; tabIndex?: number }): React.ReactElement => {
  return (
    <StyledInput
      isChecked={isChecked}
      isDisabled={isDisabled}
      hasError={hasError}
      tabIndex={tabIndex}
      {...inputProps}
    />
  );
};

export { SelectorInput };
