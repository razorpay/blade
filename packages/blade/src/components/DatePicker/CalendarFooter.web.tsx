import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import { useIsMobile } from '~utils/useIsMobile';

type CalendarFooterProps = {
  onApply: () => void;
  onCancel: () => void;
  isButtonDisabled?: boolean;
};
const CalendarFooter = ({
  onApply,
  onCancel,
  isButtonDisabled,
}: CalendarFooterProps): React.ReactElement => {
  const isMobile = useIsMobile();

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.5">
      {isMobile ? null : <Divider />}
      <BaseBox
        width={{ base: '100%', m: 'auto' }}
        marginLeft="auto"
        display="flex"
        flexDirection="row"
        gap="spacing.4"
      >
        <Button isFullWidth={isMobile} variant="tertiary" size="medium" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          isDisabled={isButtonDisabled}
          isFullWidth={isMobile}
          variant="primary"
          size="medium"
          onClick={onApply}
        >
          Apply
        </Button>
      </BaseBox>
    </BaseBox>
  );
};

export { CalendarFooter };
