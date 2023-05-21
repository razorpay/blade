/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { CSSObject } from 'styled-components';
import React from 'react';
import styled from 'styled-components';
import type { HoverProps } from './types';
import type { Theme } from '~components/BladeProvider';
import { castWebType, getIn, makeAccessible, makeMotionTime } from '~utils';
import { screenReaderStyles } from '~components/VisuallyHidden';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { useBladeInnerRef } from '~src/hooks/useBladeInnerRef';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

const getHoverStyles = ({
  theme,
  isDisabled,
  hasError,
  isChecked,
  hoverStyles,
}: { theme: Theme } & HoverProps): CSSObject => {
  if (isDisabled || hasError) return {};

  const checked = isChecked ? 'checked' : 'unchecked';
  const backgroundColor = hoverStyles.default.background[checked];
  const borderColor = hoverStyles.default.border?.[checked];

  return {
    borderColor: borderColor ? getIn(theme, borderColor) : undefined,
    backgroundColor: getIn(theme, backgroundColor),
    transitionTimingFunction: theme.motion.easing.standard.effective as string,
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
  };
};

const StyledInput = styled.input<HoverProps>(
  ({ theme, isChecked, isDisabled, hasError, hoverStyles }) => ({
    ...screenReaderStyles,
    '&:focus + div': {
      // TODO: Replace with focus outline token
      outline: '1px solid white',
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    },
    '&:hover + div, &:focus + div': {
      ...getHoverStyles({ theme, isChecked, isDisabled, hasError, hoverStyles }),
    },
  }),
);

const _SelectorInput: React.ForwardRefRenderFunction<
  BladeElementRef,
  HoverProps & { id?: string; inputProps: any; tabIndex?: number; accessibilityLabel?: string }
> = (
  { id, inputProps, isChecked, isDisabled, hasError, hoverStyles, tabIndex, accessibilityLabel },
  ref,
) => {
  const inputRef = useBladeInnerRef(ref);

  return (
    <StyledInput
      id={id}
      isChecked={isChecked}
      isDisabled={isDisabled}
      hasError={hasError}
      tabIndex={tabIndex}
      hoverStyles={hoverStyles}
      {...inputProps}
      {...makeAccessible({ label: accessibilityLabel })}
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

const SelectorInput = assignWithoutSideEffects(React.forwardRef(_SelectorInput), {
  displayName: 'SelectorInput',
});

export { SelectorInput };
