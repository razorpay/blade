import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import type { BaseInputTagSlotProps } from './types';
import type { SpacingValueType } from '~components/Box/BaseBox';
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
  tagRows: BaseInputTagSlotProps['tagRows'],
): {
  invisibleTagsCount: number;
  tagsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  horizontallyScrollableContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  verticallyScrollableContainerRef: React.MutableRefObject<HTMLDivElement | null>;
} => {
  const verticallyScrollableContainerRef = React.useRef<HTMLDivElement | null>(null);
  const horizontallyScrollableContainerRef = React.useRef<HTMLDivElement | null>(null);
  const tagsContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [invisibleTagsCount, setInvisibleTagsCount] = React.useState(0);

  // @TODO replace with SSR-friendly hook
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

  React.useEffect(() => {
    if (horizontallyScrollableContainerRef.current && tagRows === '1') {
      horizontallyScrollableContainerRef.current.scrollTo({
        top: 0,
        left: horizontallyScrollableContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }

    if (verticallyScrollableContainerRef.current && (tagRows === '3' || tagRows === 'expandable')) {
      verticallyScrollableContainerRef.current.scrollTo({
        top: verticallyScrollableContainerRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [tags?.length]);

  return {
    invisibleTagsCount,
    tagsContainerRef,
    horizontallyScrollableContainerRef,
    verticallyScrollableContainerRef,
  };
};

const TAG_HEIGHT = 20;
const GAP = 8;

const MAX_TAGSLOT_HEIGHT = TAG_HEIGHT * 4 + GAP * 4;

const BaseInputTagSlot = ({
  tags,
  setShouldIgnoreBlurAnimation,
  setFocusOnInput,
  handleOnClick,
  tagRows,
  showAllTags,
  visibleTagsCountRef,
  inputWrapperRef,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const {
    invisibleTagsCount,
    tagsContainerRef,
    verticallyScrollableContainerRef,
    horizontallyScrollableContainerRef,
  } = useTagsDisplay(tags, visibleTagsCountRef, tagRows);

  if (!tags) {
    return null;
  }

  if (tags.length <= 0) {
    return null;
  }

  const isMultiline = tagRows === '3' || tagRows === 'expandable';

  // taking 200px as default width when we fail to get width from ref (should be rare). 200px is small enough so tags tend to be shown as +x selected
  const inputContainerWidth = inputWrapperRef.current?.clientWidth ?? 200;
  const maxTagContainerWidth: SpacingValueType =
    tagRows === '3' ? '100%' : `${inputContainerWidth - 100}px`;

  return (
    <BaseBox
      ref={horizontallyScrollableContainerRef}
      paddingLeft="spacing.4"
      marginY="spacing.2"
      justifyContent="flex-start"
      display="flex"
      flexDirection="column"
      maxHeight={`${MAX_TAGSLOT_HEIGHT}px`}
      position="relative"
      maxWidth="100%"
      overflowX="auto"
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
        flexWrap={tagRows === '3' ? 'wrap' : 'nowrap'}
        whiteSpace={tagRows === '3' ? undefined : 'nowrap'}
        overflow={showAllTags ? 'auto' : 'hidden'}
        // We only want the tags to be shown till 75% of maximum height possible for input
        maxHeight={`${(MAX_TAGSLOT_HEIGHT * 75) / 100}px`}
        maxWidth={maxTagContainerWidth}
        position="absolute"
        top="spacing.0"
        left="spacing.0"
        paddingLeft="spacing.4"
        marginY="spacing.2"
      >
        {tags}
      </InvisibleTagsContainer>
      <BaseBox
        ref={verticallyScrollableContainerRef}
        flexWrap={isMultiline ? 'wrap' : 'nowrap'}
        whiteSpace={isMultiline ? undefined : 'nowrap'}
        overflow={showAllTags ? 'auto' : 'hidden'}
        maxHeight="100%"
        maxWidth="100%"
        display="flex"
        alignItems="center"
        flexDirection={tagRows === '3' ? 'column' : 'row'}
      >
        <BaseBox>
          {tags.slice(0, showAllTags ? tags.length : tags.length - invisibleTagsCount)}
        </BaseBox>
        {!showAllTags && invisibleTagsCount ? (
          <Text alignSelf="start" marginY="spacing.2">
            +{invisibleTagsCount} More
          </Text>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
