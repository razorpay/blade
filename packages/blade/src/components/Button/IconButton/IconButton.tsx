import type { ReactElement } from 'react';

import StyledIconButton from './StyledIconButton';
import type { IconComponent } from '~components/Icons';

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

export { IconButtonProps, IconButton };
