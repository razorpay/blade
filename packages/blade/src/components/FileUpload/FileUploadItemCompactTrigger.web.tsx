import React from 'react';
import { TooltipInteractiveWrapper } from '~components/Tooltip';
import { fileUploadItemCompactTriggerAttribute } from './fileUploadTokens';
import { makeAccessible } from '~utils/makeAccessible';

type FileUploadItemCompactTriggerProps = {
  children: React.ReactNode;
  /**
   * The file name and why it failed. Set after Tooltip's own props, because Tooltip labels its
   * trigger with the tooltip text alone, which would hide the file name from screen readers.
   */
  accessibilityLabel: string;
};

/**
 * Tooltip trigger around a failed chip's icon and name. Focusable, so keyboard users can read why
 * the upload failed, not only people using a pointer. Tooltip passes its ref and event handlers to
 * this component, so both are forwarded to the wrapper.
 */
const FileUploadItemCompactTrigger = React.forwardRef<
  HTMLDivElement,
  FileUploadItemCompactTriggerProps
>(({ children, accessibilityLabel, ...tooltipProps }, ref) => (
  <TooltipInteractiveWrapper
    ref={ref}
    tabIndex={0}
    display="flex"
    minWidth="0px"
    {...tooltipProps}
    {...makeAccessible({ label: accessibilityLabel })}
    // the chip uses this to draw Blade's focus ring around itself
    {...{ [fileUploadItemCompactTriggerAttribute]: true }}
  >
    {children}
  </TooltipInteractiveWrapper>
));

export { FileUploadItemCompactTrigger };
