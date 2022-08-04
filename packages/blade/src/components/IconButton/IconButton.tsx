import type { ReactElement } from 'react';
import type { IconComponent } from '..';

import StyledIconButton from './StyledIconButton.web';
import { makeAccessible } from '~src/utils/makeAccessible';

export type IconButtonProps = {
  /** Icon component to be rendered, eg. `CloseIcon` */
  icon: IconComponent;
  onClick: () => void;
  size?: 'medium' | 'large'; // todo: discrepancy in size between code and figma
  contrast?: 'low' | 'high';
  /** **a11y**: Sets aria-label to help users know what the action does, eg 'Dismiss alert' */
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
      {/* todo: color tokens for surfaceAction do not exist, need to set currentColor for fill property on svg, path */}
      <Icon size={size} color="feedback.neutral.action.icon.link.default.lowContrast" />
    </StyledIconButton>
  );
};

export default IconButton;
