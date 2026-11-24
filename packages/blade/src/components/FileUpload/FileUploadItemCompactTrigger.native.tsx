import React from 'react';
import type { PressableProps, View } from 'react-native';
import { TooltipInteractiveWrapper } from '~components/Tooltip';

type FileUploadItemCompactTriggerProps = PressableProps & {
  accessibilityLabel: string;
};

const FileUploadItemCompactTrigger = React.forwardRef<View, FileUploadItemCompactTriggerProps>(
  ({ children, accessibilityLabel, ...tooltipProps }, ref) => (
    <TooltipInteractiveWrapper
      ref={ref}
      {...tooltipProps}
      accessibilityLabel={accessibilityLabel}
      // React Native doesn't shrink flex items by default
      style={{ flexShrink: 1, minWidth: 0 }}
    >
      {children}
    </TooltipInteractiveWrapper>
  ),
);

export { FileUploadItemCompactTrigger };
