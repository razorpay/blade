import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';

type CalendarFooterProps = {
  onApply: () => void;
  onCancel: () => void;
  isMobile?: boolean;
};
const CalendarFooter = ({
  onApply,
  onCancel,
  isMobile = false,
}: CalendarFooterProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.5">
      {isMobile ? null : <Divider />}
      <BaseBox width="auto" marginLeft="auto" display="flex" flexDirection="row" gap="spacing.4">
        <Button isFullWidth={isMobile} variant="tertiary" size="medium" onClick={onCancel}>
          Cancel
        </Button>
        <Button isFullWidth={isMobile} variant="primary" size="medium" onClick={onApply}>
          Apply
        </Button>
      </BaseBox>
    </BaseBox>
  );
};

export { CalendarFooter };
