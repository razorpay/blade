import React from 'react';
import type { DateSelectionType } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute';
import { useIsMobile } from '~utils/useIsMobile';

type CalendarFooterProps = {
  onApply: () => void;
  onCancel: () => void;
  isButtonDisabled?: boolean;
  footer?: React.ReactElement;
  selectionType?: DateSelectionType;
};
const CalendarFooter = ({
  onApply,
  onCancel,
  isButtonDisabled,
  footer,
  selectionType,
}: CalendarFooterProps): React.ReactElement => {
  const isMobile = useIsMobile();

  const isSingleSelectionOrMobile = isMobile || selectionType === 'single';
  const footerMaxWidth = React.useMemo(() => {
    if (isMobile) return '100%';
    return selectionType === 'single' ? '280px' : '400px';
  }, [isMobile, selectionType]);

  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.5">
      {isMobile ? null : <Divider />}

      <BaseBox
        display="flex"
        flexDirection={isSingleSelectionOrMobile ? 'column' : 'row'}
        gap={isSingleSelectionOrMobile ? 'spacing.5' : 'spacing.6'}
        justifyContent="space-between"
      >
        {footer ? <BaseBox maxWidth={footerMaxWidth}>{footer}</BaseBox> : null}
        <BaseBox width={{ base: '100%', m: 'auto' }} marginLeft="auto">
          <BaseBox display="flex" flexDirection="row" gap={isMobile ? 'spacing.5' : 'spacing.3'}>
            <Button
              isFullWidth={isMobile}
              variant="tertiary"
              size="medium"
              onClick={onCancel}
              data-analytics-name={MAKE_ANALYTICS_CONSTANTS.DATE_PICKER.CANCEL_BUTTON}
            >
              Cancel
            </Button>
            <Button
              isDisabled={isButtonDisabled}
              isFullWidth={isMobile}
              variant="primary"
              size="medium"
              onClick={onApply}
              data-analytics-name={MAKE_ANALYTICS_CONSTANTS.DATE_PICKER.APPLY_BUTTON}
            >
              Apply
            </Button>
          </BaseBox>
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { CalendarFooter };
