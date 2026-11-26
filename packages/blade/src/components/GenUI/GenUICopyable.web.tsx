/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react';
import { IconButton } from '~components/Button/IconButton';
import { CopyIcon } from '~components/Icons';
import { iconSizeMap } from '~components/Icons/useIconProps/iconSizeMap';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

type CopyableSize = 'small' | 'medium';

/** The width of the copy button, in px: the icon only, with no padding. */
const getCopyableWidth = (size: CopyableSize): number => iconSizeMap[size];

/**
 * GenUI's copy button: a Blade IconButton with a tooltip, and no text label. Compose it inside
 * any cell or value that needs copy. Its focus ring is IconButton's.
 */
const Copyable = ({ value, size = 'medium' }: { value?: string; size?: CopyableSize }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(value ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy'} placement="top">
      <TooltipInteractiveWrapper>
        <IconButton
          icon={CopyIcon}
          size={size}
          emphasis="intense"
          accessibilityLabel={`Copy ${value}`}
          onClick={handleCopy}
        />
      </TooltipInteractiveWrapper>
    </Tooltip>
  );
};

export { Copyable, getCopyableWidth };
export type { CopyableSize };
