import React from 'react';
import styled from 'styled-components';
import type { BaseInputTagSlotProps } from './types';
import { baseInputHeight } from './baseInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { castWebType, makeSize } from '~utils';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useIsMobile } from '~utils/useIsMobile';
import { MetaConstants } from '~utils/metaAttribute';
import { size as sizeToken } from '~tokens/global';
import { useTableEditableCell } from '~components/Table/TableEditableCellContext';

const MINUMUM_INPUT_SPACE = 60;
const PLUS_X_MORE_TEXT_WIDTH = 60;
const TAG_MAX_WIDTH: number = sizeToken['140'];

const useVisibleTagsCount = ({
  slotRef,
  tags,
  maxTagRows,
  visibleTagsCountRef,
  showAllTags,
  labelPrefix,
}: {
  slotRef: React.RefObject<HTMLDivElement>;
  tags: BaseInputTagSlotProps['tags'];
  maxTagRows: BaseInputTagSlotProps['maxTagRows'];
  visibleTagsCountRef: BaseInputTagSlotProps['visibleTagsCountRef'];
  showAllTags: BaseInputTagSlotProps['showAllTags'];
  labelPrefix: BaseInputTagSlotProps['labelPrefix'];
}): number => {
  const [visibleTagsCount, setVisibleTagsCount] = React.useState(0);
  const visibleTagsCountStateRef = React.useRef<number>(0);
  const { isInsideTableEditableCell } = useTableEditableCell();

  useIsomorphicLayoutEffect(() => {
    if (!tags || labelPrefix || isInsideTableEditableCell) {
      setVisibleTagsCount(0);
      return;
    }

    if (maxTagRows === 'multiple' || showAllTags) {
      visibleTagsCountRef.current = tags.length;
      setVisibleTagsCount(tags.length);
      return;
    }

    const inputTagsSlotWidth = slotRef.current?.clientWidth;
    visibleTagsCountStateRef.current = 0;
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
      const tagsCount = Math.floor((totalAvailableSpaceForTags / TAG_MAX_WIDTH) * tags.length);
      visibleTagsCountRef.current = tagsCount;
      setVisibleTagsCount(tagsCount);
      return;
    }

    for (const tagEl of allTagsEl) {
      totalTagsWidth += tagEl.clientWidth;
      if (totalTagsWidth >= totalAvailableSpaceForTags) {
        break;
      } else {
        visibleTagsCountStateRef.current++;
      }
    }

    visibleTagsCountRef.current = visibleTagsCountStateRef.current;
    setVisibleTagsCount(visibleTagsCountStateRef.current);
  }, [tags?.length, showAllTags]);

  return visibleTagsCount;
};

const getSelectedTextWithoutTags = ({
  items,
  labelPrefix,
}: {
  items: number;
  labelPrefix?: string;
}): string => {
  if (labelPrefix) {
    return `${labelPrefix} (${items} Selected)`;
  }

  return `${items} Selected`;
};

const TagSlotContainer = styled(BaseBox)(() => {
  return {
    // hides the scrollbar of tagslot
    '::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  };
});

const SelectedCountText = ({
  children,
  isDisabled,
}: {
  children: string;
  isDisabled?: boolean;
}): React.ReactElement => {
  return (
    <Text
      color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
      alignSelf="center"
      marginY="spacing.2"
      marginRight="spacing.4"
      variant="body"
      size="small"
      weight="regular"
    >
      <BaseBox as="span" whiteSpace="nowrap">
        {children}
      </BaseBox>
    </Text>
  );
};

const BaseInputTagSlot = ({
  renderAs,
  children,
  tags,
  maxTagRows,
  showAllTags,
  setShouldIgnoreBlurAnimation,
  handleOnInputClick,
  isDropdownTrigger,
  visibleTagsCountRef,
  labelPrefix,
  isDisabled,
  numberOfLines,
  isTextArea,
  size,
}: BaseInputTagSlotProps): React.ReactElement => {
  const hasTags = tags && tags.length > 0;
  const slotRef = React.useRef<HTMLDivElement>(null);
  const { isInsideTableEditableCell } = useTableEditableCell();
  const visibleTagsCount = useVisibleTagsCount({
    slotRef,
    tags,
    maxTagRows,
    visibleTagsCountRef,
    showAllTags,
    labelPrefix,
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
    } else if (maxTagRows === 'single') {
      // when its single line input and showAllTags is true, we scroll till item on focus
      slotRef.current?.scrollTo?.({
        top: 0,
        left: maxTagRows === 'single' ? slotRef.current.scrollWidth : 0,
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
    <TagSlotContainer
      ref={slotRef}
      className="tags-slot"
      paddingY={paddingYWithTags}
      paddingLeft="spacing.4"
      display="flex"
      flex="1"
      flexWrap={maxTagRows === 'single' ? 'nowrap' : 'wrap'}
      overflowX="auto"
      overflowY={showAllTags || maxTagRows === 'multiple' ? 'auto' : 'hidden'}
      minHeight={makeSize(baseInputHeight[size])}
      maxHeight={
        // In TextArea with tagged input, we explicitly define maxHeight based on maxHeight so that tags dont overflow out of textarea
        // And In table we strictly want the maxHeight to be defined to not mess up the table layout
        (isDropdownTrigger && isTextArea) || isInsideTableEditableCell
          ? makeSize(baseInputHeight[size] * (numberOfLines ?? 1))
          : undefined
      }
      onMouseDown={() => {
        setShouldIgnoreBlurAnimation?.(true);
      }}
      onClick={(e) => {
        handleOnInputClick(castWebType(e));
      }}
      onMouseUp={() => {
        setShouldIgnoreBlurAnimation?.(false);
      }}
    >
      {isInsideTableEditableCell && tags && tags.length > 0 ? (
        <SelectedCountText isDisabled={isDisabled}>
          {getSelectedTextWithoutTags({ items: tags.length, labelPrefix })}
        </SelectedCountText>
      ) : (
        <>
          {visibleTags}
          {tags && !showAllTags && invisibleTagsCount ? (
            <SelectedCountText isDisabled={isDisabled}>
              {visibleTags?.length === 0
                ? getSelectedTextWithoutTags({
                    items: invisibleTagsCount,
                    labelPrefix,
                  })
                : `+${invisibleTagsCount} More`}
            </SelectedCountText>
          ) : null}
        </>
      )}
      <BaseBox
        marginTop="-4px"
        minWidth={
          hasTags && renderAs === 'button'
            ? undefined
            : `min(20%, ${makeSize(MINUMUM_INPUT_SPACE)})`
        }
        width={hasTags && renderAs === 'button' ? makeSize(sizeToken['1']) : '100%'}
      >
        {children}
      </BaseBox>
    </TagSlotContainer>
  );
};

export { BaseInputTagSlot };
