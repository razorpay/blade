import { default as React } from 'react';
type CalendarFooterProps = {
    onApply: () => void;
    onCancel: () => void;
    isButtonDisabled?: boolean;
};
declare const CalendarFooter: ({ onApply, onCancel, isButtonDisabled, }: CalendarFooterProps) => React.ReactElement;
export { CalendarFooter };
