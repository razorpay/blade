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
    <Box display="flex" flexDirection="column" gap="spacing.3">
      {!isMobile && <Divider />}
      <Box
        width={isMobile ? '100%' : 'auto'}
        marginLeft="auto"
        display="flex"
        flexDirection="row"
        gap={isMobile ? 'spacing.3' : 'spacing.2'}
      >
        <Button isFullWidth={isMobile} variant="tertiary" size="medium" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          isDisabled={isApplyDisabled}
          isFullWidth={isMobile}
          variant="primary"
          size="medium"
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
