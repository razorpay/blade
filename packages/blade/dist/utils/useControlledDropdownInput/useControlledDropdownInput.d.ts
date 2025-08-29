import { default as React } from 'react';
import { BaseDropdownInputTriggerProps } from '../../components/Input/DropdownInputTriggers/types';
export type useControlledDropdownInputProps = Pick<BaseDropdownInputTriggerProps, 'onChange' | 'name' | 'value' | 'defaultValue' | 'onInputValueChange' | 'syncInputValueWithSelection' | 'isSelectInput'> & {
    triggererRef: React.RefObject<HTMLElement>;
};
declare const useControlledDropdownInput: (props: useControlledDropdownInputProps) => void;
export { useControlledDropdownInput };
