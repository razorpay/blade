import type { ReactElement } from 'react';

import type { IconComponent } from '..';
import StyledIconButton from './StyledIconButton.web';
import { makeAccessible } from '~utils';

export type IconButtonProps = {
  /**
   * Icon component to be rendered, eg. `CloseIcon`
   */
  icon: IconComponent;
  onClick: () => void;
  size?: 'medium' | 'large'; // todo: discrepancy in size between code and figma
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
  icon: Icon,
  onClick,
  size = 'medium',
  contrast = 'low',
  accessibilityLabel,
}: IconButtonProps): ReactElement => {
  return (
    <StyledIconButton
      onClick={onClick}
      contrast={contrast}
      {...makeAccessible({ label: accessibilityLabel })}
    >
      <Icon size={size} color="currentColor" />
    </StyledIconButton>
  );
};

export default IconButton;
