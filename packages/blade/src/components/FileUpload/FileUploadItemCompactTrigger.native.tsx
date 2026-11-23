import React from 'react';
import type { PressableProps, View } from 'react-native';
import { TooltipInteractiveWrapper } from '~components/Tooltip';

type FileUploadItemCompactTriggerProps = PressableProps & {
  /**
   * The file name and why it failed, so screen readers announce the reason without a tap
   */
  accessibilityLabel: string;
};

/**
 * Tooltip trigger around a failed chip's icon and name. Tapping it shows why the upload failed;
 * the next tap anywhere closes it. Tooltip passes its ref and touch handlers to this component,
 * so both are forwarded to the wrapper.
 */
const FileUploadItemCompactTrigger = React.forwardRef<View, FileUploadItemCompactTriggerProps>(
  ({ children, accessibilityLabel, ...tooltipProps }, ref) => (
    <TooltipInteractiveWrapper ref={ref} {...tooltipProps} accessibilityLabel={accessibilityLabel}>
      {children}
    </TooltipInteractiveWrapper>
  ),
);

export { FileUploadItemCompactTrigger };
