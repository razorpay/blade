import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
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

const InvisibleTagsContainer = styled(BaseBox)(
  (): CSSObject => {
    return {
      '&.show': {
        display: 'flex',
      },
      display: 'none',
    };
  },
);

const useTagsDisplay = (
  tags: BaseInputTagSlotProps['tags'],
  visibleTagsCountRef: BaseInputTagSlotProps['visibleTagsCountRef'],
  inputRef: BaseInputTagSlotProps['inputRef'],
): {
  invisibleTagsCount: number;
  tagsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
} => {
  const tagsContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [invisibleTagsCount, setInvisibleTagsCount] = React.useState(0);
  const [invisibleTagSlotWidth, setInivsibleTagSlotWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!tags) return;
    if (!tagsContainerRef.current) return;

    const tagElements = tagsContainerRef.current.children;
    tagsContainerRef.current.classList.add('show');
    let visibleTagsCount = 0;
    for (const tagElement of tagElements) {
      if (isElementVisibleInContainer(tagElement, tagsContainerRef.current)) {
        visibleTagsCount++;
      } else {
        break;
      }
    }

    visibleTagsCountRef.current = visibleTagsCount;
    setInvisibleTagsCount(tags.length - visibleTagsCount);
    tagsContainerRef.current.classList.remove('show');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags?.length]);

  return { invisibleTagsCount, tagsContainerRef };
};

const TAG_HEIGHT = 20;
const GAP = 8;

const MAX_TAGSLOT_HEIGHT = TAG_HEIGHT * 4 + GAP * 4;

const BaseInputTagSlot = ({
  tags,
  setShouldIgnoreBlurAnimation,
  setFocusOnInput,
  handleOnClick,
  isMultiline,
  showAllTags,
  visibleTagsCountRef,
  inputRef,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const { invisibleTagsCount, tagsContainerRef } = useTagsDisplay(
    tags,
    visibleTagsCountRef,
    inputRef,
  );

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
      maxHeight={`${MAX_TAGSLOT_HEIGHT}px`}
      // Full width minus the trailing icon space
      backgroundColor="action.background.secondary.default"
      position="relative"
      maxWidth="100%"
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
      <InvisibleTagsContainer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={tagsContainerRef as any}
        // switch to these on `props.rows` value
        flexWrap={isMultiline ? 'wrap' : 'nowrap'}
        whiteSpace={isMultiline ? undefined : 'nowrap'}
        overflow={showAllTags ? 'auto' : 'hidden'}
        // We only want the tags to be shown till 75% of maximum height possible for input
        maxHeight={`${(MAX_TAGSLOT_HEIGHT * 75) / 100}px`}
        maxWidth={inputRef.current.clientWidth - 100 + 'px'}
        position="absolute"
        top="spacing.0"
        left="spacing.0"
        // backgroundColor="action.background.primary.default"
      >
        {tags}
      </InvisibleTagsContainer>
      <BaseBox
        flexWrap={isMultiline ? 'wrap' : 'nowrap'}
        whiteSpace={isMultiline ? undefined : 'nowrap'}
        overflow={showAllTags ? 'auto' : 'hidden'}
        maxHeight="100%"
        maxWidth="100%"
        display="flex"
        alignItems="center"
        flexDirection={isMultiline ? 'column' : 'row'}
      >
        <BaseBox>
          {tags.slice(0, showAllTags ? tags.length : tags.length - invisibleTagsCount)}
        </BaseBox>
        {!showAllTags && invisibleTagsCount ? (
          <Text marginY="spacing.2">+{invisibleTagsCount} More</Text>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
