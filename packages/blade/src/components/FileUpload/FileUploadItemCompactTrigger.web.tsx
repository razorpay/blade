import React from 'react';
import { TooltipInteractiveWrapper } from '~components/Tooltip';

/**
 * Tooltip trigger around a failed chip's icon and name. Focusable, so keyboard users can read why
 * the upload failed, not only people using a pointer. Tooltip passes its ref and event handlers to
 * this component, so both are forwarded to the wrapper.
 */
const FileUploadItemCompactTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children, ...tooltipProps }, ref) => (
  <TooltipInteractiveWrapper ref={ref} tabIndex={0} display="flex" minWidth="0px" {...tooltipProps}>
    {children}
  </TooltipInteractiveWrapper>
));

export { FileUploadItemCompactTrigger };
