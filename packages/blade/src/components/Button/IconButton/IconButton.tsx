/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import StyledIconButton from './StyledIconButton';
import type { IconComponent } from '~components/Icons';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { useBladeInnerRef } from '~src/hooks/useBladeInnerRef';

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
  size?: 'medium' | 'large';

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
};

/**
 * Component for making clickable icons with transparent background.
 * For other cases please use `Button` component with `icon` prop.
 */
const _IconButton: React.ForwardRefRenderFunction<BladeElementRef, IconButtonProps> = (
  { icon, onClick, size = 'medium', contrast = 'low', accessibilityLabel },
  ref,
) => {
  const innerRef = useBladeInnerRef(ref);
  return (
    <StyledIconButton
      ref={innerRef as any}
      onClick={onClick}
      contrast={contrast}
      size={size}
      icon={icon}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

const IconButton = React.forwardRef(_IconButton);

export { IconButtonProps, IconButton };
