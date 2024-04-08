import React from 'react';
import type { BaseInputProps } from './BaseInput';
import type { BladeElementRefWithValue } from '~utils/types';
import type { FormInputOnKeyDownEvent } from '~components/Form/FormTypes';
import { isReactNative } from '~utils';
import { getTagsGroup } from '~components/Tag/getTagsGroup';

type TaggedInputProps = {
  isTaggedInput?: boolean;
  tags?: string[];
  onTagChange?: ({ tags }: { tags: string[] }) => void;
};

type UseTaggedInputProps = TaggedInputProps &
  Pick<BaseInputProps, 'isDisabled' | 'onChange' | 'name' | 'value'> & {
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
}: UseTaggedInputProps): {
  activeTagIndex: number;
  setActiveTagIndex: (activeTagIndex: number) => void;
  getTags: ({ size }: { size: NonNullable<BaseInputProps['size']> }) => React.ReactElement[];
  handleTaggedInputKeydown: (e: FormInputOnKeyDownEvent) => void;
} => {
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);

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
          if (!isReactNative()) {
            inputRef.current?.focus();
          }
          onTagChange?.({ tags: getNewTagsArray(tagIndex) });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTagIndex, tags, isDisabled],
  );

  const handleTaggedInputKeydown = (e: FormInputOnKeyDownEvent): void => {
    if (!isTaggedInput || !inputRef.current) {
      return;
    }

    const inputElement = inputRef.current;

    const currentTags = tags ?? [];
    const isControlledValue = Boolean(value);
    const inputValue = isControlledValue ? value?.trim() : inputElement.value.trim();
    if (e.key === 'Enter') {
      e.event.preventDefault(); // we don't want textarea to treat enter as line break in tagged inputs
      if (inputValue) {
        onTagChange?.({ tags: [...currentTags, inputValue] });
        if (isControlledValue) {
          onChange?.({ name, value: '' });
        } else {
          inputElement.value = '';
        }

        setActiveTagIndex(-1);
      }
    }

    console.log({ activeTagIndex });

    if (e.key === 'Backspace' && !inputValue && activeTagIndex < 0) {
      onTagChange?.({ tags: currentTags.slice(0, -1) });
    }
  };

  return {
    activeTagIndex,
    setActiveTagIndex,
    getTags,
    handleTaggedInputKeydown,
  };
};

export type { TaggedInputProps };
export { useTaggedInput };
