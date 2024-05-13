import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';

type CalendarFooterProps = {
  onApply: () => void;
  onCancel: () => void;
};
const CalendarFooter = ({ onApply, onCancel }: CalendarFooterProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.5">
      <Divider />
      <BaseBox marginLeft="auto" display="flex" flexDirection="row" gap="spacing.4">
        <Button variant="tertiary" size="medium" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" onClick={onApply}>
          Apply
        </Button>
      </BaseBox>
    </BaseBox>
  );
};

export { CalendarFooter };
