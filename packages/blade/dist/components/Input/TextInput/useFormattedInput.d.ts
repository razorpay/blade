import { default as React } from 'react';
import { FormInputOnEvent } from '../../Form/FormTypes';
type UseFormattedInputProps = {
    format?: string;
    onChange?: (params: {
        name?: string;
        value?: string;
        rawValue?: string;
    }) => void;
    value?: string;
    defaultValue?: string;
};
type UseFormattedInputReturn = {
    formattedValue: string;
    handleChange: FormInputOnEvent;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    maxLength?: number;
};
/**
 * Hook for pattern-based input formatting with smart cursor positioning.
 * useFormattedInput({ format: "##/##" }) transforms "1234" → "12/34"
 */
export declare const useFormattedInput: ({ format: pattern, onChange, value: userValue, defaultValue, }: UseFormattedInputProps) => UseFormattedInputReturn;
export {};
