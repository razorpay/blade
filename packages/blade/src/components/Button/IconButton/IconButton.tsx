/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import StyledIconButton from './StyledIconButton';
import type { IconComponent } from '~components/Icons';
import type { BladeElementRef, DataAnalyticsAttribute } from '~utils/types';
import type { BladeCommonEvents } from '~components/types';
import type { Platform } from '~utils';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type IconButtonProps = {
  /**
   * Icon component to be rendered, eg. `CloseIcon`
   */
  icon: IconComponent;

  /**
   * Icon size
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Icon contrast
   *
   * @default 'intense'
   */
  emphasis?: SubtleOrIntense;

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
} & DataAnalyticsAttribute &
  BladeCommonEvents &
  StyledPropsBlade &
  Platform.Select<{
    web: {
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
      /**
       * This changes the hover interaction to highlight icon more
       *
       * **Only available on web currently**
       */
      isHighlighted?: boolean;
    };
    native: {
      onClick: (event: GestureResponderEvent) => void;
      isHighlighted?: undefined;
    };
  }>;

/**
 * Component for making clickable icons with transparent background.
 * For other cases please use `Button` component with `icon` prop.
 */
const _IconButton: React.ForwardRefRenderFunction<BladeElementRef, IconButtonProps> = (
  {
    icon,
    onClick,
    size = 'medium',
    emphasis = 'intense',
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
    isHighlighted,
    _tabIndex,
    ...rest
  },
  ref,
) => {
  return (
    <StyledIconButton
      ref={ref as any}
      onClick={onClick}
      emphasis={emphasis}
      size={size}
      icon={icon}
      tabIndex={_tabIndex}
      accessibilityLabel={accessibilityLabel}
      isDisabled={isDisabled}
      isHighlighted={isHighlighted}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      {...makeAnalyticsAttribute(rest)}
      {...rest}
    />
  );
};

const IconButton = React.forwardRef(_IconButton);

export type { IconButtonProps };
export { IconButton };
