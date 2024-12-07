import styled from 'styled-components';
import React from 'react';
import { usePopoverContext } from './PopoverContext';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import type { DataAnalyticsAttribute } from '~utils/types';

const StyledPopoverInteractiveWrapper = styled.button((props) => {
  const cssObject = useMemoizedStyles(props as never);

  return {
    all: 'unset',
    ...cssObject,
    appearance: 'none',
    cursor: 'pointer',
    lineHeight: 0,
    '&:focus-visible': {
      ...getFocusRingStyles({ theme: props.theme }),
    },
  };
});

type PopoverInteractiveWrapper = {
  /**
   * A label for screen readers to announce when the popover is opened.
   */
  accessibilityLabel?: string;
  /**
   * The content of the PopoverInteractiveWrapper.
   */
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
} & Omit<BaseBoxProps, 'as'> &
  DataAnalyticsAttribute;

const PopoverInteractiveWrapper = React.forwardRef<HTMLButtonElement, PopoverInteractiveWrapper>(
  ({ accessibilityLabel, ...props }, ref) => {
    usePopoverContext();

    return (
      <StyledPopoverInteractiveWrapper
        ref={ref}
        display={props.display || 'inline-block'}
        {...props}
        {...metaAttribute({
          testID: 'popover-interactive-wrapper',
          name: MetaConstants.PopoverInteractiveWrapper,
        })}
        {...makeAccessible({
          label: accessibilityLabel,
        })}
      />
    );
  },
);

export { PopoverInteractiveWrapper };
