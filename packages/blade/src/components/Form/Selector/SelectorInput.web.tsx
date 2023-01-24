/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { CSSObject } from 'styled-components';
import React from 'react';
import styled from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { castWebType, getIn, makeMotionTime } from '~utils';
import { screenReaderStyles } from '~components/VisuallyHidden';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { useBladeInnerRef } from '~src/hooks/useBladeInnerRef';

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

const _SelectorInput: React.ForwardRefRenderFunction<
  BladeElementRef,
  HoverProps & { inputProps: any }
> = ({ inputProps, isChecked, isDisabled, hasError }, ref) => {
  const inputRef = useBladeInnerRef(ref);

  return (
    <StyledInput
      isChecked={isChecked}
      isDisabled={isDisabled}
      hasError={hasError}
      {...inputProps}
      // merging both refs because inputProps.ref needs to have access to indeterminate state
      // to be able to set the mixed value via setMixed() function
      // TODO: replace with a generic `mergeRefs()` util if we do this in other places
      ref={(value) => {
        inputProps.ref.current = value;
        (inputRef as React.MutableRefObject<any>).current = value;
      }}
    />
  );
};

const SelectorInput = React.forwardRef(_SelectorInput);
SelectorInput.displayName = 'SelectorInput';

export { SelectorInput };
