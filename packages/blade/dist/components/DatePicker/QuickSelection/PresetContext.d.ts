import { default as React } from 'react';
import { DatesRangeValue, CalendarProps } from '../types';
type PresetState = {
    preset: NonNullable<CalendarProps<'range'>['presets']>[0];
    value: DatesRangeValue | null;
    isSelected: boolean;
    isCustomType: boolean;
};
type PresetContextValue = {
    presetStates: PresetState[];
    selectedPresetIndex: number | null;
    selectedPresetLabel: string | null;
    isCustomSelected: boolean;
    effectiveSelectionType: 'single' | 'range' | null;
};
type PresetProviderProps = {
    children: React.ReactNode;
    presets: CalendarProps<'range'>['presets'];
    selectedPreset: DatesRangeValue | null;
    currentDate: Date;
};
export declare const PresetProvider: ({ children, presets, selectedPreset, currentDate, }: PresetProviderProps) => React.ReactElement;
export declare const usePresetContext: () => PresetContextValue;
export {};
