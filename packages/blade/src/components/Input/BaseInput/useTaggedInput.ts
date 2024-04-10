import React from 'react';
import type { BaseInputProps } from './BaseInput';
import type { BladeElementRefWithValue } from '~utils/types';
import type { FormInputOnEvent, FormInputOnKeyDownEvent } from '~components/Form/FormTypes';
// import { isReactNative } from '~utils';
import { getTagsGroup } from '~components/Tag/getTagsGroup';
import { isReactNative } from '~utils';

type TaggedInputProps = {
  isTaggedInput?: boolean;
  tags?: string[];
  onTagChange?: ({ tags }: { tags: string[] }) => void;
};

type UseTaggedInputProps = TaggedInputProps &
  Pick<BaseInputProps, 'isDisabled' | 'onChange' | 'name' | 'value' | 'defaultValue'> & {
    inputRef: React.RefObject<BladeElementRefWithValue | null>;
  };

const useTaggedInput = ({
  tags,
  isDisabled,
  onTagChange,
  isTaggedInput,
  inputRef,
  onChange,
  name,
  value,
  defaultValue,
}: UseTaggedInputProps): {
  activeTagIndex: number;
  setActiveTagIndex: (activeTagIndex: number) => void;
  getTags: ({ size }: { size: NonNullable<BaseInputProps['size']> }) => React.ReactElement[];
  handleTaggedInputKeydown: (e: FormInputOnKeyDownEvent) => void;
  handleTaggedInputChange: FormInputOnEvent;
} => {
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
  const [inputValueUncontrolled, setInputValueUncontrolled] = React.useState(defaultValue ?? '');

  const getNewTagsArray = (indexToRemove: number): string[] => {
    if (!tags) {
      return [];
    }

    // Check if the index is valid
    if (indexToRemove < 0 || indexToRemove >= tags.length) {
      return tags; // Return the original array
    }

    // Create a new array without the element at the specified index
    const newArray = tags.slice(0, indexToRemove).concat(tags.slice(indexToRemove + 1));

    return newArray;
  };

  const getTags = React.useMemo(
    () => ({ size }: { size: NonNullable<BaseInputProps['size']> }): React.ReactElement[] => {
      return getTagsGroup({
        size,
        tags: tags ?? [],
        activeTagIndex,
        isDisabled,
        onDismiss: ({ tagIndex }) => {
          onTagChange?.({ tags: getNewTagsArray(tagIndex) });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTagIndex, tags, isDisabled],
  );

  const handleTaggedInputChange: FormInputOnEvent = ({ value }) => {
    setInputValueUncontrolled(value ?? '');
  };

  const clearInput = (): void => {
    const isControlledValue = Boolean(value);

    if (isControlledValue) {
      // In Controlled component, we don't clear input ourselves. We just call onChange with empty value
      onChange?.({ name, value: '' });
      return;
    }

    if (!inputRef.current) {
      return;
    }

    setInputValueUncontrolled('');

    if (isReactNative()) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore: clear does exist in react native
        inputRef.current.clear();
      }, 10);
      return;
    }

    inputRef.current.value = '';
  };

  const handleTaggedInputKeydown = (e: FormInputOnKeyDownEvent): void => {
    if (!isTaggedInput || !inputValueUncontrolled) {
      return;
    }

    const currentTags = tags ?? [];
    const isControlledValue = Boolean(value);
    const inputValue = isControlledValue ? value?.trim() : inputValueUncontrolled.trim();
    if (e.key === 'Enter' || e.key === ',') {
      e.event.preventDefault(); // we don't want textarea to treat enter as line break in tagged inputs
      if (inputValue) {
        onTagChange?.({ tags: [...currentTags, inputValue] });
        clearInput();
        setActiveTagIndex(-1);
      }
    }

    if (e.key === 'Backspace' && !inputValue && activeTagIndex < 0) {
      onTagChange?.({ tags: currentTags.slice(0, -1) });
    }
  };

  return {
    activeTagIndex,
    setActiveTagIndex,
    getTags,
    handleTaggedInputKeydown,
    handleTaggedInputChange,
  };
};

export type { TaggedInputProps };
export { useTaggedInput };
