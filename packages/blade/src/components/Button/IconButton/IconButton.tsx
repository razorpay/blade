/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import StyledIconButton from './StyledIconButton';
import type { IconComponent } from '~components/Icons';
import type { BladeElementRef } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';

type IconButtonProps = {
  /**
   * Icon component to be rendered, eg. `CloseIcon`
   */
  icon: IconComponent;
  onClick: () => void;

  /**
   * Icon size
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Icon contrast
   *
   * @default 'low'
   */
  contrast?: 'low' | 'high';

  /**
   * Sets aria-label to help users know what the action does, eg 'Dismiss alert'
   */
  accessibilityLabel: string;

  /**
   * Disabled state for IconButton
   */
  isDisabled?: boolean;

  /**
   * Sets tabindex property on button element
   */
  _tabIndex?: number;
} & BladeCommonEvents;

/**
 * Component for making clickable icons with transparent background.
 * For other cases please use `Button` component with `icon` prop.
 */
const _IconButton: React.ForwardRefRenderFunction<BladeElementRef, IconButtonProps> = (
  {
    icon,
    onClick,
    size = 'medium',
    contrast = 'low',
    accessibilityLabel,
    isDisabled,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchEnd,
    onTouchStart,
    _tabIndex,
  },
  ref,
) => {
  return (
    <StyledIconButton
      ref={ref as any}
      onClick={onClick}
      contrast={contrast}
      size={size}
      icon={icon}
      tabIndex={_tabIndex}
      accessibilityLabel={accessibilityLabel}
      isDisabled={isDisabled}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    />
  );
};

const IconButton = React.forwardRef(_IconButton);

export { IconButtonProps, IconButton };
