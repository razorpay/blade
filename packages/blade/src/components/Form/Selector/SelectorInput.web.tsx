/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import getIn from 'lodash/get';
import type { CSSObject } from 'styled-components';
import React from 'react';
import styled from 'styled-components';
import type { HoverProps, SelectorInputProps } from './types';
import type { Theme } from '~components/BladeProvider';
import { castWebType } from '~utils';
import { screenReaderStyles } from '~components/VisuallyHidden';
import type { BladeElementRef } from '~utils/useBladeInnerRef';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeMotionTime } from '~utils/makeMotionTime';
import { makeAccessible } from '~utils/makeAccessible';

const getHoverStyles = ({
  theme,
  isDisabled,
  hasError,
  isChecked,
  hoverTokens,
}: { theme: Theme } & HoverProps): CSSObject => {
  if (isDisabled || hasError) return {};

  const checked = isChecked ? 'checked' : 'unchecked';
  const backgroundColor = hoverTokens.default.background[checked];
  const borderColor = hoverTokens.default.border?.[checked];

  return {
    borderColor: borderColor ? getIn(theme, borderColor) : undefined,
    backgroundColor: getIn(theme, backgroundColor),
    transitionTimingFunction: theme.motion.easing.standard.effective as string,
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
  };
};

const StyledInput = styled.input<HoverProps>(
  ({ theme, isChecked, isDisabled, hasError, hoverTokens }) => ({
    ...screenReaderStyles,
    '&:focus + div': {
      // TODO: Replace with focus outline token
      outline: `1px solid ${theme.colors.surface.background.level1.lowContrast}`,
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    },
    '&:hover + div, &:focus + div': {
      ...getHoverStyles({ theme, isChecked, isDisabled, hasError, hoverTokens }),
    },
  }),
);

const _SelectorInput: React.ForwardRefRenderFunction<BladeElementRef, SelectorInputProps> = (
  { id, inputProps, isChecked, isDisabled, hasError, hoverTokens, tabIndex, accessibilityLabel },
  ref,
) => {
  return (
    <StyledInput
      id={id}
      isChecked={isChecked}
      isDisabled={isDisabled}
      hasError={hasError}
      tabIndex={tabIndex}
      hoverTokens={hoverTokens}
      {...inputProps}
      {...makeAccessible({ label: accessibilityLabel })}
      // merging both refs because inputProps.ref needs to have access to indeterminate state
      // to be able to set the mixed value via setMixed() function
      // TODO: replace with a generic `mergeRefs()` util if we do this in other places
      ref={(value) => {
        inputProps.ref.current = value;
        (ref as React.MutableRefObject<any>).current = value;
      }}
    />
  );
};

const SelectorInput = assignWithoutSideEffects(React.forwardRef(_SelectorInput), {
  displayName: 'SelectorInput',
});

export { SelectorInput };
