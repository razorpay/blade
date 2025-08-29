import { ChipGroupProps, ChipGroupContextType, State } from './types';
type UseChipGroupProps = Pick<ChipGroupProps, 'isDisabled' | 'isRequired' | 'necessityIndicator' | 'validationState' | 'name' | 'value' | 'defaultValue' | 'onChange' | 'size' | 'color' | 'selectionType'>;
type UseChipGroupReturn = {
    state: State;
    contextValue: ChipGroupContextType;
    ids: {
        labelId: string;
    };
};
declare const useChipGroup: ({ value, defaultValue, isDisabled, isRequired, onChange, name, size, color, selectionType, necessityIndicator, validationState, }: UseChipGroupProps) => UseChipGroupReturn;
export { useChipGroup };
