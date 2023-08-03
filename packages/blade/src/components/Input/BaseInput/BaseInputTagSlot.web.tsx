import React from 'react';
import type { BaseInputTagSlotProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

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
  visibleTagsCountRef: BaseInputTagSlotProps['visibleTagsCountRef'],
): {
  invisibleTagsCount: number;
  tagsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  showTagsWithPlusMore: boolean;
} => {
  const tagsContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [invisibleTagsCount, setInvisibleTagsCount] = React.useState(0);
  const [showTagsWithPlusMore, setShowTagsWithPlusMore] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!tags) return;
    if (!tagsContainerRef.current) return;

    const tagElements = tagsContainerRef.current.children;

    let visibleTagsCount = 0;
    for (const tagElement of tagElements) {
      if (isElementVisibleInContainer(tagElement, tagsContainerRef.current)) {
        visibleTagsCount++;
      } else {
        break;
      }
    }

    if (visibleTagsCount < tags.length) {
      setShowTagsWithPlusMore(true);
    }

    visibleTagsCountRef.current = visibleTagsCount;
    setInvisibleTagsCount(tags.length - visibleTagsCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags?.length]);

  return { invisibleTagsCount, tagsContainerRef, showTagsWithPlusMore };
};

const BaseInputTagSlot = ({
  tags,
  setShouldIgnoreBlurAnimation,
  setFocusOnInput,
  handleOnClick,
  isMultiline,
  showAllTags,
  visibleTagsCountRef,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const { invisibleTagsCount, tagsContainerRef } = useTagsDisplay(tags, visibleTagsCountRef);

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
      maxHeight="100px"
      // Move to using gap instead of marginLeft on individual tags after RN upgrade
      // gap="spacing.3"
      onMouseDown={() => {
        setShouldIgnoreBlurAnimation?.(true);
      }}
      onClick={(e) => {
        if (tagsContainerRef.current === e.target) {
          handleOnClick?.({ name: '', value: e as React.MouseEvent<HTMLInputElement> });
        }
        setFocusOnInput();
      }}
      onMouseUp={() => {
        setShouldIgnoreBlurAnimation?.(false);
      }}
    >
      <BaseBox
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={tagsContainerRef as any}
        // switch to these on `props.rows` value
        flexWrap={isMultiline ? 'wrap' : 'nowrap'}
        whiteSpace={isMultiline ? undefined : 'nowrap'}
        overflow={showAllTags ? 'auto' : 'hidden'}
        maxHeight={showAllTags && invisibleTagsCount ? '100%' : '84px'}
      >
        {tags}
      </BaseBox>
      {!showAllTags && invisibleTagsCount ? (
        <BaseBox flex="1" alignItems="center">
          <Text>+{invisibleTagsCount} More</Text>
        </BaseBox>
      ) : null}
    </BaseBox>
  );
};

export { BaseInputTagSlot };
