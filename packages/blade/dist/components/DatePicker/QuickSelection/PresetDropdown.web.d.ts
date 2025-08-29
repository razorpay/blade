import { default as React } from 'react';
import { DatesRangeValue } from '../types';
type PresetDropdownProps = {
    onSelection: (preset: (date: Date) => DatesRangeValue) => void;
    onOpenCalendar?: () => void;
};
declare const PresetDropdown: ({ onSelection, onOpenCalendar, }: PresetDropdownProps) => React.ReactElement;
export { PresetDropdown };
