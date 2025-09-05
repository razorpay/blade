import React from 'react';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import { useIsMobile } from '~utils/useIsMobile';

type TimePickerFooterProps = {
  onApply: () => void;
  onCancel: () => void;
  isApplyDisabled?: boolean;
};

/**
 * Footer component for TimePicker with Apply/Cancel buttons
 * Similar to DatePicker footer but for time selection
 */
const TimePickerFooter = ({
  onApply,
  onCancel,
  isApplyDisabled = false,
}: TimePickerFooterProps): React.ReactElement => {
  const isMobile = useIsMobile();

  return (
    <Box display="flex" flexDirection="column">
      <Divider />
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        gap={isMobile ? 'spacing.5' : 'spacing.3'}
        padding={isMobile ? 'spacing.5' : 'spacing.4'}
      >
        <Button isFullWidth={true} variant="tertiary" size="xsmall" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          isDisabled={isApplyDisabled}
          isFullWidth={true}
          variant="primary"
          size="xsmall"
          onClick={onApply}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export { TimePickerFooter };
export type { TimePickerFooterProps };
