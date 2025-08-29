import { default as React } from 'react';
import { BaseInputProps } from './BaseInput';
import { BladeElementRefWithValue } from '../../../utils/types';
import { FormInputOnEvent, FormInputOnKeyDownEvent } from '../../Form/FormTypes';
type TaggedInputProps = {
    isTaggedInput?: boolean;
    tags?: string[];
    onTagChange?: ({ tags }: {
        tags: string[];
    }) => void;
};
type UseTaggedInputProps = TaggedInputProps & Pick<BaseInputProps, 'isDisabled' | 'onChange' | 'name' | 'value' | 'defaultValue'> & {
    inputRef: React.RefObject<BladeElementRefWithValue | null>;
};
type UseTaggedInputReturn = {
    activeTagIndex: number;
    setActiveTagIndex: (activeTagIndex: number) => void;
    getTags: ({ size }: {
        size: NonNullable<BaseInputProps['size']>;
    }) => React.ReactElement[];
    handleTaggedInputKeydown: (e: FormInputOnKeyDownEvent) => void;
    handleTaggedInputChange: FormInputOnEvent;
    handleTagsClear: () => void;
};
declare const useTaggedInput: ({ tags, isDisabled, onTagChange, isTaggedInput, inputRef, onChange, name, value, defaultValue, }: UseTaggedInputProps) => UseTaggedInputReturn;
export type { TaggedInputProps };
export { useTaggedInput };
