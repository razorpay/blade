import React from 'react';
import { TooltipInteractiveWrapper } from '~components/Tooltip';
import { fileUploadItemCompactTriggerAttribute } from './fileUploadTokens';
import { makeAccessible } from '~utils/makeAccessible';

type FileUploadItemCompactTriggerProps = {
  children: React.ReactNode;
  // set after Tooltip's props, which would otherwise label the trigger with the tooltip text only
  accessibilityLabel: string;
};

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
    {...{ [fileUploadItemCompactTriggerAttribute]: true }}
  >
    {children}
  </TooltipInteractiveWrapper>
));

export { FileUploadItemCompactTrigger };
