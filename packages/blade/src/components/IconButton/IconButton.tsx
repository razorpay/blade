import type { ReactElement } from 'react';

import type { IconComponent } from '..';
import StyledIconButton from './StyledIconButton';

export type IconButtonProps = {
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
  size?: 'medium' | 'large'; // todo: discrepancy in size between code and figma

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
 * Internal component for making clickable icons
 */
const IconButton = ({
  icon,
  onClick,
  size = 'medium',
  contrast = 'low',
  accessibilityLabel,
}: IconButtonProps): ReactElement => {
  return (
    <StyledIconButton
      onClick={onClick}
      contrast={contrast}
      size={size}
      icon={icon}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default IconButton;
