import React from 'react';
import type { TimePickerFooterProps } from './types';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';

/**
 * Footer component for TimePicker with Apply/Cancel buttons
 */
const TimePickerFooter = ({
  onApply,
  onCancel,
  isApplyDisabled = false,
}: TimePickerFooterProps): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="column">
      <Divider />
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        gap={{ base: 'spacing.5', m: 'spacing.3' }}
        padding={{ base: 'spacing.5', m: 'spacing.4' }}
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
