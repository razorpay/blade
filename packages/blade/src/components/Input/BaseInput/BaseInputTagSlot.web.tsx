import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import type { BaseInputTagSlotProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { size } from '~tokens/global';
import { makeSize } from '~utils';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

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
  maxTagRows: BaseInputTagSlotProps['maxTagRows'],
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

  useIsomorphicLayoutEffect(() => {
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

    // Set scroll
    if (horizontallyScrollableContainerRef.current && maxTagRows === 'single') {
      horizontallyScrollableContainerRef.current.scrollTo({
        top: 0,
        left: horizontallyScrollableContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }

    if (
      verticallyScrollableContainerRef.current &&
      (maxTagRows === 'multiple' || maxTagRows === 'expandable')
    ) {
      verticallyScrollableContainerRef.current.scrollTo({
        top: verticallyScrollableContainerRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  handleOnClick,
  maxTagRows,
  showAllTags,
  setFocusOnInput,
  visibleTagsCountRef,
  inputWrapperRef,
  renderAs,
  children,
}: BaseInputTagSlotProps): React.ReactElement | null => {
  const {
    invisibleTagsCount,
    tagsContainerRef,
    verticallyScrollableContainerRef,
    horizontallyScrollableContainerRef,
  } = useTagsDisplay(tags, visibleTagsCountRef, maxTagRows);

  React.useEffect(() => {
    if (
      !showAllTags &&
      verticallyScrollableContainerRef.current &&
      horizontallyScrollableContainerRef.current
    ) {
      verticallyScrollableContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });

      horizontallyScrollableContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllTags]);

  const isMultiline = maxTagRows === 'multiple' || maxTagRows === 'expandable';
  const hasTags = tags && tags.length > 0;

  // taking 400px as default width when we fail to get width from ref (should be rare). 400px is small enough so tags tend to be shown as +x selected
  const wrapperWidth = inputWrapperRef.current?.clientWidth ?? 400;

  return (
    <BaseBox
      ref={horizontallyScrollableContainerRef}
      justifyContent="flex-start"
      display="flex"
      flexDirection="column"
      maxHeight={`${MAX_TAGSLOT_HEIGHT}px`}
      minHeight={makeSize(size['36'])}
      position="relative"
      maxWidth="100%"
      flex="1"
      overflowX="auto"
      onMouseDown={() => {
        setShouldIgnoreBlurAnimation?.(true);
      }}
      onClick={(e) => {
        handleOnClick?.({ name: '', value: e as React.MouseEvent<HTMLInputElement> });
        setFocusOnInput();
      }}
      onMouseUp={() => {
        setShouldIgnoreBlurAnimation?.(false);
      }}
    >
      {hasTags && (
        <InvisibleTagsContainer
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={tagsContainerRef as any}
          // switch to these on `props.rows` value
          flexWrap={maxTagRows === 'multiple' ? 'wrap' : 'nowrap'}
          whiteSpace={maxTagRows === 'multiple' ? undefined : 'nowrap'}
          overflow={showAllTags ? 'auto' : 'hidden'}
          // We only want the tags to be shown till 75% of maximum height possible for input
          maxHeight={`${(MAX_TAGSLOT_HEIGHT * 75) / 100}px`}
          maxWidth={
            maxTagRows === 'single' || maxTagRows === 'expandable'
              ? `${wrapperWidth - 200}px`
              : '100%'
          }
          position="absolute"
          top="spacing.0"
          left="spacing.0"
          paddingLeft="spacing.4"
          backgroundColor="#f302"
        >
          {tags}
        </InvisibleTagsContainer>
      )}
      <BaseBox
        ref={verticallyScrollableContainerRef}
        flexWrap={
          maxTagRows === 'multiple' || (maxTagRows === 'expandable' && showAllTags)
            ? 'wrap'
            : 'nowrap'
        }
        whiteSpace={isMultiline ? undefined : 'nowrap'}
        overflow={showAllTags ? 'auto' : 'hidden'}
        position="relative"
        paddingLeft={hasTags ? 'spacing.4' : undefined}
        height="100%"
        maxWidth={hasTags ? 'max-content' : '100%'}
        display="inline-flex"
        alignItems="center"
        flexDirection="row"
      >
        {tags ? tags.slice(0, showAllTags ? tags.length : tags.length - invisibleTagsCount) : null}
        <BaseBox display={hasTags ? 'inline-flex' : 'flex'}>
          {tags && !showAllTags && invisibleTagsCount ? (
            <Text alignSelf="center" marginY="spacing.2">
              <BaseBox as="span" whiteSpace="nowrap">
                +{invisibleTagsCount} More
              </BaseBox>
            </Text>
          ) : null}
          {/* Giving it 1px width in button renders (e.g. selectinput) so it continues to maintain expected height but doesn't take up extra space from tags */}
          <BaseBox width={hasTags && renderAs === 'button' ? '1px' : '100%'}>{children}</BaseBox>
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
