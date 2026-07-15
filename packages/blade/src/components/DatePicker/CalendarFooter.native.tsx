import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute';

type CalendarFooterProps = {
  onApply: () => void;
  onCancel: () => void;
  isButtonDisabled?: boolean;
  footer?: React.ReactElement;
  applyLabel?: string;
  cancelLabel?: string;
};

/**
 * Native calendar footer. Always renders the "mobile" full-width Cancel/Apply
 * layout. The top `Divider` is dropped because the `BottomSheetFooter` already
 * provides its own separator on native.
 */
const CalendarFooter = ({
  onApply,
  onCancel,
  isButtonDisabled,
  footer,
  applyLabel = 'Apply',
  cancelLabel = 'Cancel',
}: CalendarFooterProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.5">
      {footer ? <BaseBox>{footer}</BaseBox> : null}
      <BaseBox display="flex" flexDirection="row" gap="spacing.5">
        <BaseBox flex={1}>
          <Button
            isFullWidth
            variant="tertiary"
            size="medium"
            onClick={onCancel}
            data-analytics-name={MAKE_ANALYTICS_CONSTANTS.DATE_PICKER.CANCEL_BUTTON}
          >
            {cancelLabel}
          </Button>
        </BaseBox>
        <BaseBox flex={1}>
          <Button
            isDisabled={isButtonDisabled}
            isFullWidth
            variant="primary"
            size="medium"
            onClick={onApply}
            data-analytics-name={MAKE_ANALYTICS_CONSTANTS.DATE_PICKER.APPLY_BUTTON}
          >
            {applyLabel}
          </Button>
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { CalendarFooter };
export type { CalendarFooterProps };
