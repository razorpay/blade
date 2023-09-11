import styled from 'styled-components';
import React from 'react';
import { usePopoverContext } from './PopoverContext';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { useMemoizedStyles } from '~components/Box/BaseBox/useMemoizedStyles.web';

const StyledPopoverInteractiveWrapper = styled.button((props) => {
  const cssObject = useMemoizedStyles(props as never);

  return {
    all: 'unset',
    ...cssObject,
    appearance: 'none',
    cursor: 'pointer',
    lineHeight: 0,
    '&:focus': {
      // TODO: refactor to use focus ring token
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${props.theme.colors.brand.primary[400]}`,
    },
  };
});

type PopoverInteractiveWrapper = {
  /**
   * Note: it is recommended that PopoverInteractiveWrapper is used as a button,
   * If you change this to a div, you will need to handle keyboard events yourself.
   *
   * @default "button"
   */
  as?: 'div' | 'button';
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
} & Omit<BaseBoxProps, 'as'>;

const PopoverInteractiveWrapper = React.forwardRef<HTMLButtonElement, PopoverInteractiveWrapper>(
  ({ accessibilityLabel, as = 'button', ...props }, ref) => {
    usePopoverContext();

    return (
      <StyledPopoverInteractiveWrapper
        ref={ref}
        as={as}
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
