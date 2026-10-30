import React from 'react';
import BaseButton from '~components/Button/BaseButton';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
import type { IconComponent } from '~components/Icons';
import type { BladeElementRef } from '~utils/types';

type ChatInputButtonProps = {
  icon: IconComponent;
  accessibilityLabel: string;
  /**
   * `small` (32 px) sits in the toolbar; `xsmall` (28 px) sits inline in the compact size.
   */
  size?: 'small' | 'xsmall';
  isDisabled?: boolean;
  onClick?: BaseButtonProps['onClick'];
  testID?: string;
  // set by Menu when this is its trigger
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'dialog';
  'aria-controls'?: string;
};

/**
 * Internal ghost button for ChatInput's own controls, such as the "+". It is transparent at rest
 * and grey on hover or while its menu is open. It is not exported: once Blade's `Button` has a
 * tertiary `color="primary"` look, this is replaced by it.
 */
const _ChatInputButton: React.ForwardRefRenderFunction<BladeElementRef, ChatInputButtonProps> = (
  {
    icon,
    accessibilityLabel,
    size = 'small',
    isDisabled,
    onClick,
    testID,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHasPopup,
    'aria-controls': ariaControls,
    ...rest
  },
  ref,
) => {
  return (
    <BaseButton
      ref={ref}
      variant="tertiary"
      color="transparent"
      size={size}
      icon={icon}
      accessibilityProps={{
        label: accessibilityLabel,
        expanded: ariaExpanded,
        hasPopup: ariaHasPopup,
        controls: ariaControls,
      }}
      isDisabled={isDisabled}
      onClick={onClick}
      testID={testID}
      // Menu passes its trigger props (ref, aria-expanded, onClick, ...) through here
      {...rest}
    />
  );
};

const ChatInputButton = React.forwardRef(_ChatInputButton);

export { ChatInputButton };
export type { ChatInputButtonProps };
