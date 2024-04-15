import React from 'react';
import type { BaseInputProps } from './BaseInput';
import type { BladeElementRefWithValue } from '~utils/types';
import type { FormInputOnEvent, FormInputOnKeyDownEvent } from '~components/Form/FormTypes';
// import { isReactNative } from '~utils';
import { getTagsGroup } from '~components/Tag/getTagsGroup';
import { isReactNative } from '~utils';
import { useControllableState } from '~utils/useControllable';

type TaggedInputProps = {
  isTaggedInput?: boolean;
  tags?: string[];
  onTagChange?: ({ tags }: { tags: string[] }) => void;
};

type UseTaggedInputProps = TaggedInputProps &
  Pick<BaseInputProps, 'isDisabled' | 'onChange' | 'name' | 'value' | 'defaultValue'> & {
    inputRef: React.RefObject<BladeElementRefWithValue | null>;
  };

type UseTaggedInputReturn = {
  activeTagIndex: number;
  setActiveTagIndex: (activeTagIndex: number) => void;
  getTags: ({ size }: { size: NonNullable<BaseInputProps['size']> }) => React.ReactElement[];
  handleTaggedInputKeydown: (e: FormInputOnKeyDownEvent) => void;
  handleTaggedInputChange: FormInputOnEvent;
  handleTagsClear: () => void;
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
}: UseTaggedInputProps): UseTaggedInputReturn => {
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
  const [inputValueUncontrolled, setInputValueUncontrolled] = React.useState(defaultValue ?? '');
  const [tagsValue, setTagsValue] = useControllableState({
    value: tags,
    defaultValue: [],
    onChange: (tags) => {
      onTagChange?.({ tags });
    },
  });

  const isTagsControlled = Boolean(tags);

  const getNewTagsArray = (indexToRemove: number): string[] => {
    const currentTags = tagsValue;

    if (!currentTags) {
      return [];
    }

    // Check if the index is valid
    if (indexToRemove < 0 || indexToRemove >= currentTags.length) {
      return currentTags; // Return the original array
    }

    // Create a new array without the element at the specified index
    const newArray = currentTags
      .slice(0, indexToRemove)
      .concat(currentTags.slice(indexToRemove + 1));

    return newArray;
  };

  const getTags = React.useMemo(
    () => ({ size }: { size: NonNullable<BaseInputProps['size']> }): React.ReactElement[] => {
      return getTagsGroup({
        size,
        tags: tagsValue,
        activeTagIndex,
        isDisabled,
        onDismiss: ({ tagIndex }) => {
          console.log('dismiss', { tagIndex });
          if (!isTagsControlled) {
            setTagsValue(() => getNewTagsArray(tagIndex));
          }
          onTagChange?.({ tags: getNewTagsArray(tagIndex) });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTagIndex, tags, tagsValue, isDisabled],
  );

  const handleTaggedInputChange: FormInputOnEvent = ({ value }) => {
    if (!isTaggedInput) {
      return;
    }
    setInputValueUncontrolled(value ?? '');
  };

  const handleTagsClear = (): void => {
    if (!isTaggedInput) {
      return;
    }

    if (!isTagsControlled) {
      setTagsValue(() => []);
    }

    onTagChange?.({ tags: [] });
  };

  const clearInput = (): void => {
    const isControlledValue = value !== undefined;

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
        inputRef.current?.clear();
      }, 10);
      return;
    }

    inputRef.current.value = '';
  };

  const handleTaggedInputKeydown = (e: FormInputOnKeyDownEvent): void => {
    if (!isTaggedInput) {
      return;
    }

    const currentTags = tagsValue;
    const isControlledValue = value !== undefined;
    const inputValue = isControlledValue ? value?.trim() : inputValueUncontrolled.trim();
    if (e.key === 'Enter' || e.key === ',') {
      e.event.preventDefault?.(); // we don't want textarea to treat enter as line break in tagged inputs
      if (inputValue) {
        if (!isTagsControlled) {
          setTagsValue(() => [...currentTags, inputValue]);
        }
        onTagChange?.({ tags: [...currentTags, inputValue] });
        clearInput();
        setActiveTagIndex(-1);
      }
    }
    if (e.key === 'Backspace' && !inputValue && activeTagIndex < 0 && currentTags.length > 0) {
      if (!isTagsControlled) {
        setTagsValue(() => currentTags.slice(0, -1));
      }
      onTagChange?.({ tags: currentTags.slice(0, -1) });
    }
  };

  return {
    activeTagIndex,
    setActiveTagIndex,
    getTags,
    handleTaggedInputKeydown,
    handleTaggedInputChange,
    handleTagsClear,
  };
};

export type { TaggedInputProps };
export { useTaggedInput };
