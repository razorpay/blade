import { DatesRangeValue } from '../types';
type PresetSideBarProps = {
    isMobile?: boolean;
    onSelection: (value: (date: Date) => DatesRangeValue) => void;
};
declare const PresetSideBar: ({ onSelection, isMobile }: PresetSideBarProps) => React.ReactElement;
export { PresetSideBar };
