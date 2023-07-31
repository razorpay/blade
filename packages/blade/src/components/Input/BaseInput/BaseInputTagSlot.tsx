import React from 'react';
import type { BaseInputProps } from './BaseInput';
import type { StyledBaseInputProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { isReactNative } from '~utils';
import { Text } from '~components/Typography';

type BaseInputTagSlotProps = {
  tags?: BaseInputProps['tags'];
  showAllTags: BaseInputProps['showAllTags'];
  setFocusOnInput: () => void;
  setShouldIgnoreBlurAnimation: BaseInputProps['setShouldIgnoreBlurAnimation'];
  handleOnClick: StyledBaseInputProps['handleOnClick'];
  isMultiline: BaseInputProps['isMultiline'];
};

function isElementVisibleInContainer(element: Element, container: HTMLDivElement): boolean {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.left >= containerRect.left &&
    elementRect.right <= containerRect.right
  );
}

const useTagsDisplay = (
  tags: BaseInputTagSlotProps['tags'],
): {
  invisibleTagsCount: number;
  tagsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
} => {
  const tagsContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [invisibleTagsCount, setInvisibleTagsCount] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!tags) return;
    if (!tagsContainerRef.current) return;

    const tagElements = tagsContainerRef.current.children;

    let visibleTagsCount = 0;
    for (const tagElement of tagElements) {
      if (
        tagsContainerRef.current &&
        isElementVisibleInContainer(tagElement, tagsContainerRef.current)
      ) {
        visibleTagsCount++;
      } else {
        break;
      }
    }

    setInvisibleTagsCount(tags.length - visibleTagsCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags?.length]);

  return { invisibleTagsCount, tagsContainerRef };
};

const BaseInputTagSlot = ({
  tags,
  setShouldIgnoreBlurAnimation,
  setFocusOnInput,
  handleOnClick,
  isMultiline,
  showAllTags,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const { invisibleTagsCount, tagsContainerRef } = useTagsDisplay(tags);

  if (!tags) {
    return null;
  }

  if (tags.length <= 0) {
    return null;
  }

  return (
    <BaseBox
      paddingLeft="spacing.4"
      marginY="spacing.2"
      justifyContent="flex-start"
      display="flex"
      flexDirection="column"
      // Move to using gap instead of marginLeft on individual tags after RN upgrade
      // gap="spacing.3"
      {...(!isReactNative()
        ? {
            onMouseDown: () => {
              setShouldIgnoreBlurAnimation?.(true);
            },
            onClick: (e) => {
              if (tagsContainerRef.current === e.target) {
                handleOnClick?.({ name: '', value: e as React.MouseEvent<HTMLInputElement> });
              }
              setFocusOnInput();
            },
            onMouseUp: () => {
              setShouldIgnoreBlurAnimation?.(false);
            },
          }
        : {})}
    >
      <BaseBox
        ref={tagsContainerRef}
        // switch to these on `props.rows` value
        flexWrap={isMultiline ? 'wrap' : 'nowrap'}
        whiteSpace={isMultiline ? undefined : 'nowrap'}
        overflow={showAllTags ? 'auto' : 'hidden'}
        maxHeight={showAllTags ? '100px' : '80px'}
      >
        {tags}
      </BaseBox>
      <BaseBox minHeight="20px" display={showAllTags ? 'none' : 'flex'} alignItems="center">
        {invisibleTagsCount ? <Text>+{invisibleTagsCount} More</Text> : null}
      </BaseBox>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
