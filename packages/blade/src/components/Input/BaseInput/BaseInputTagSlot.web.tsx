import React from 'react';
import type { BaseInputTagSlotProps } from './types';
import { BASEINPUT_DEFAULT_HEIGHT } from './baseInputConfig';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useIsMobile } from '~utils/useIsMobile';
import { MetaConstants } from '~utils/metaAttribute';
import { size } from '~tokens/global';

const MINUMUM_INPUT_SPACE = 30;
const PLUS_X_MORE_TEXT_WIDTH = 60;
const TAG_MAX_WIDTH = size['140'];

const useVisibleTagsCount = ({
  slotRef,
  tags,
  maxTagRows,
}: {
  slotRef: React.RefObject<HTMLDivElement>;
  tags: BaseInputTagSlotProps['tags'];
  maxTagRows: BaseInputTagSlotProps['maxTagRows'];
}): number => {
  const [visibleTagsCount, setVisibleTagsCount] = React.useState(0);
  const visibleTagsCountRef = React.useRef<number>(0);

  useIsomorphicLayoutEffect(() => {
    if (!tags) {
      setVisibleTagsCount(0);
      return;
    }

    if (maxTagRows === 'multiple') {
      setVisibleTagsCount(tags.length);
      return;
    }

    const inputTagsSlotWidth = slotRef.current?.clientWidth;
    visibleTagsCountRef.current = 0;
    let totalTagsWidth = 0;

    if (!inputTagsSlotWidth) {
      return;
    }

    const allTagsEl = slotRef.current?.querySelectorAll(
      `[data-blade-component="${MetaConstants.Tag}"]`,
    );

    const totalAvailableSpaceForTags =
      inputTagsSlotWidth - (MINUMUM_INPUT_SPACE + PLUS_X_MORE_TEXT_WIDTH);

    if (allTagsEl.length !== tags.length) {
      // some weird edge cases in controlled select where tags are not rendered in children
      // we assume 140px (max-width of tag as width of all tags)
      setVisibleTagsCount(Math.floor((totalAvailableSpaceForTags / TAG_MAX_WIDTH) * tags.length));
      return;
    }

    for (const tagEl of allTagsEl) {
      totalTagsWidth += tagEl.clientWidth;
      if (totalTagsWidth >= totalAvailableSpaceForTags) {
        break;
      } else {
        visibleTagsCountRef.current++;
      }
    }

    setVisibleTagsCount(visibleTagsCountRef.current);
  }, [tags?.length]);

  return visibleTagsCount;
};

const BaseInputTagSlot = ({
  renderAs,
  children,
  tags,
  maxTagRows,
  showAllTags,
  setShouldIgnoreBlurAnimation,
  handleOnClick,
  isDropdownTrigger,
}: BaseInputTagSlotProps): React.ReactElement => {
  const hasTags = tags && tags.length > 0;
  const slotRef = React.useRef<HTMLDivElement>(null);
  const visibleTagsCount = useVisibleTagsCount({
    slotRef,
    tags,
    maxTagRows,
  });

  React.useEffect(() => {
    slotRef.current?.scrollTo?.({
      top:
        maxTagRows === 'multiple' || maxTagRows === 'expandable' ? slotRef.current.scrollHeight : 0,
      left: maxTagRows === 'single' ? slotRef.current.scrollWidth : 0,
      behavior: 'smooth',
    });
  }, [tags?.length, maxTagRows]);

  React.useEffect(() => {
    if (!showAllTags) {
      slotRef.current?.scrollTo?.({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllTags]);

  const visibleTags = React.useMemo(() => {
    return showAllTags ? tags : tags?.slice(0, visibleTagsCount);
  }, [showAllTags, tags, visibleTagsCount]);

  const invisibleTagsCount = React.useMemo(() => {
    if (tags && visibleTags) {
      return tags.length - visibleTags.length;
    }

    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags?.length, visibleTags?.length]);

  const isMobile = useIsMobile();

  if (!isDropdownTrigger) {
    // If its not dropdown trigger, we don't need to render tag containers
    return children;
  }

  // tag height changes in mobile and desktop so we keep different paddings to make it look as expected
  const paddingYWithTags = isMobile ? 'spacing.1' : 'spacing.2';

  return (
    <BaseBox
      ref={slotRef}
      className="tags-slot"
      paddingY={hasTags ? paddingYWithTags : 'spacing.0'}
      paddingX={hasTags ? 'spacing.3' : 'spacing.0'}
      display="flex"
      flex="1"
      flexWrap={maxTagRows === 'single' ? 'nowrap' : 'wrap'}
      overflow="auto"
      minHeight={makeSize(BASEINPUT_DEFAULT_HEIGHT)}
      onMouseDown={() => {
        setShouldIgnoreBlurAnimation?.(true);
      }}
      onClick={(e) => {
        handleOnClick?.({ name: '', value: e as React.MouseEvent<HTMLInputElement> });
      }}
      onMouseUp={() => {
        setShouldIgnoreBlurAnimation?.(false);
      }}
    >
      {visibleTags}
      {tags && !showAllTags && invisibleTagsCount ? (
        <Text alignSelf="center" marginY="spacing.2">
          <BaseBox as="span" whiteSpace="nowrap">
            {visibleTags?.length === 0
              ? `${invisibleTagsCount} Items Selected`
              : `+${invisibleTagsCount} More`}
          </BaseBox>
        </Text>
      ) : null}
      <BaseBox width={hasTags && renderAs === 'button' ? makeSize(size['1']) : '100%'}>
        {children}
      </BaseBox>
    </BaseBox>
  );
};

export { BaseInputTagSlot };
