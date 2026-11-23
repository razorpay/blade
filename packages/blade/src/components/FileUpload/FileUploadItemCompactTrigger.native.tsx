import React from 'react';
import type { PressableProps, View } from 'react-native';
import { TooltipInteractiveWrapper } from '~components/Tooltip';

/**
 * Tooltip trigger around a failed chip's icon and name. Tapping it shows why the upload failed;
 * the next tap anywhere closes it. Tooltip passes its ref and touch handlers to this component,
 * so both are forwarded to the wrapper.
 */
const FileUploadItemCompactTrigger = React.forwardRef<View, PressableProps>(
  ({ children, ...tooltipProps }, ref) => (
    <TooltipInteractiveWrapper ref={ref} {...tooltipProps}>
      {children}
    </TooltipInteractiveWrapper>
  ),
);

export { FileUploadItemCompactTrigger };
