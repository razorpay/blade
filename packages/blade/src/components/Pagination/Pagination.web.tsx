import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { pagination } from './tokens';
import type { PaginationProps } from './types';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from '~components/Icons';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';
import { Button } from '~components/Button';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/BladeProvider';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useControllableState } from '~utils/useControllable';

const pageSizeOptions: NonNullable<PaginationProps['defaultPageSize']>[] = [10, 25, 50];

const PageSelectionButton = styled.button.attrs(() => {
  return {
    ...metaAttribute({ name: MetaConstants.TablePageSelectionButton }),
  };
})<{ isSelected?: boolean; isDisabled?: boolean }>(({ theme, isSelected, isDisabled }) => ({
  backgroundColor: isSelected
    ? getIn(theme.colors, pagination.pageSelectionButton.backgroundColorSelected)
    : 'transparent',
  border: 'none',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  height: makeSize(pagination.pageSelectionButton.height),
  width: makeSize(pagination.pageSelectionButton.width),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: getIn(theme.border.radius, pagination.pageSelectionButton.borderRadius),
  opacity: isDisabled ? 0.5 : 1,
  '&:hover': {
    backgroundColor: isDisabled
      ? 'transparent'
      : isSelected
      ? getIn(theme.colors, pagination.pageSelectionButton.backgroundColorSelectedHover)
      : getIn(theme.colors, pagination.pageSelectionButton.backgroundColorHover),
  },
  '&:focus-visible': {
    backgroundColor: isDisabled
      ? 'transparent'
      : isSelected
      ? getIn(theme.colors, pagination.pageSelectionButton.backgroundColorSelectedActive)
      : getIn(theme.colors, pagination.pageSelectionButton.backgroundColorActive),
    ...getFocusRingStyles({ theme }),
    outline: 'none',
    '&:focus-visible': getFocusRingStyles({ theme }),
  },
  '&:active': {
    backgroundColor: isDisabled
      ? 'transparent'
      : isSelected
      ? getIn(theme.colors, pagination.pageSelectionButton.backgroundColorSelectedActive)
      : getIn(theme.colors, pagination.pageSelectionButton.backgroundColorActive),
  },
}));

const getPaginationButtons = ({
  currentSelection,
  totalPages,
}: {
  currentSelection: number;
  totalPages: number;
}): {
  middleItems: number[];
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
  firstItem: number;
  lastItem: number;
} => {
  const halfRange = 2;
  const minMiddleItems = 5;

  // return if totalPages is less than minMiddleItems
  if (totalPages <= minMiddleItems) {
    return {
      middleItems: Array.from({ length: totalPages - 2 }, (_, index) => index + 2),
      showStartEllipsis: false,
      showEndEllipsis: false,
      firstItem: 1,
      lastItem: totalPages,
    };
  }

  let start = Math.max(1, currentSelection - halfRange);
  let end = Math.min(totalPages, start + 2 * halfRange);

  // Ensure at least minMiddleItems items in middleItems
  while (end - start + 1 < minMiddleItems && (start > 1 || end < totalPages)) {
    if (start > 1) {
      start--;
    }
    if (end < totalPages) {
      end++;
    }
  }

  let showStartEllipsis = false;
  let showEndEllipsis = false;

  const paginationButtons: number[] = [];
  for (let i = start; i <= end; i++) {
    paginationButtons.push(i);
  }

  // if paginationButtons contains 1, remove it
  if (paginationButtons.includes(1)) {
    paginationButtons.shift();
    // add an extra item at the end if length of total pages is greater than minMiddleItems+1
    if (totalPages > minMiddleItems + 1) paginationButtons.push(end + 1);
  }

  // if paginationButtons contains totalPages, remove it
  if (paginationButtons.includes(totalPages)) {
    paginationButtons.pop();
    // add an extra item at the beginning if length of total pages is greater than minMiddleItems+1
    if (totalPages > minMiddleItems + 1) paginationButtons.unshift(start - 1);
  }

  if (paginationButtons[0] > 2) {
    showStartEllipsis = true;
  }

  if (paginationButtons[paginationButtons.length - 1] + 1 < totalPages) {
    showEndEllipsis = true;
  }

  return {
    middleItems: paginationButtons,
    showStartEllipsis,
    showEndEllipsis,
    firstItem: 1,
    lastItem: totalPages,
  };
};

const _Pagination = ({
  totalPages: controlledTotalPages,
  selectedPage: controlledSelectedPage,
  defaultSelectedPage = 1,
  onSelectedPageChange,
  defaultPageSize = pagination.defaultPageSize,
  pageSize: controlledPageSize,
  pageSizeLabel = 'items / page',
  onPageSizeChange,
  showPageSizePicker = false,
  showPageNumberSelector = false,
  showLabel = false,
  label,
  isDisabled = false,
  ...rest
}: PaginationProps): React.ReactElement => {
  const [internalPageSize, setInternalPageSize] = useControllableState<10 | 25 | 50>({
    defaultValue: defaultPageSize,
    value: controlledPageSize,
    onChange: (pageSize) => {
      onPageSizeChange?.({ pageSize });
    },
  });
  // Convert 1-based external page to 0-based internal page
  const controlledInternalPage = useMemo(() => {
    if (isUndefined(controlledSelectedPage)) {
      return undefined;
    }
    return controlledSelectedPage - 1;
  }, [controlledSelectedPage]);

  const defaultInternalPage = useMemo(() => {
    return defaultSelectedPage - 1;
  }, [defaultSelectedPage]);

  const [internalPage, setInternalPage] = useControllableState<number>({
    defaultValue: defaultInternalPage,
    value: controlledInternalPage,
    onChange: (page) => {
      // Convert 0-based internal page back to 1-based external page
      onSelectedPageChange?.({ page: page + 1 });
    },
  });
  // Calculate totalPages
  const totalPages = useMemo(() => {
    if (!isUndefined(controlledTotalPages)) {
      return controlledTotalPages;
    }

    return 1;
  }, [controlledTotalPages]);

  const [currentEllipseHover, setCurrentEllipseHover] = useState<'start' | 'end' | undefined>(
    undefined,
  );

  // Generate default label
  const defaultLabel = label
    ? label
    : `Showing ${internalPage * internalPageSize + 1}-${
        (internalPage + 1) * internalPageSize
      } items`;

  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  const handlePageChange = useCallback(
    (page: number): void => {
      if (isDisabled) return;

      // page is 0-based internally
      let pageToJumpTo = page;
      if (pageToJumpTo < 0) {
        pageToJumpTo = 0;
      } else if (pageToJumpTo > totalPages - 1) {
        pageToJumpTo = totalPages - 1;
      }

      setInternalPage(() => pageToJumpTo);
    },
    [isDisabled, setInternalPage, totalPages],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: 10 | 25 | 50): void => {
      if (isDisabled) return;
      setInternalPageSize(() => pageSize);
    },
    [isDisabled, setInternalPageSize],
  );

  const shouldDisableNextPage = (): boolean => {
    return internalPage >= totalPages - 1 || isDisabled;
  };

  const shouldDisablePreviousPage = (): boolean => {
    return internalPage <= 0 || isDisabled;
  };

  const paginationButtons = getPaginationButtons({
    currentSelection: internalPage + 1,
    totalPages,
  });

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      padding={pagination.padding}
      backgroundColor="transparent"
      {...makeAnalyticsAttribute(rest)}
    >
      {showLabel && !onMobile && (
        <BaseBox display="flex" justifyContent="center" alignItems="center">
          <Text size="medium" weight="semibold">
            {defaultLabel}
          </Text>
        </BaseBox>
      )}
      <BaseBox
        display="flex"
        flex={1}
        gap="spacing.2"
        justifyContent="flex-end"
        alignItems="center"
      >
        {showPageSizePicker && !onMobile && (
          <BaseBox display="flex" flexDirection="row" alignItems="center">
            <Dropdown selectionType="single">
              <SelectInput
                accessibilityLabel="Select items per page"
                name="page-size"
                label=""
                labelPosition="inside-input"
                placeholder=""
                onChange={({ values }) => {
                  handlePageSizeChange(Number(values[0]) as 10 | 25 | 50);
                }}
                value={internalPageSize.toString()}
                isDisabled={isDisabled}
              />
              <DropdownOverlay>
                <ActionList>
                  {pageSizeOptions.map((item, index) => (
                    <ActionListItem key={index} title={item.toString()} value={item.toString()} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <BaseBox aria-hidden paddingLeft="spacing.3" paddingRight="spacing.3">
              <Text> {pageSizeLabel} </Text>
            </BaseBox>
          </BaseBox>
        )}
        <BaseBox
          display="flex"
          flexDirection="row"
          gap="spacing.2"
          flex={onMobile ? 1 : undefined}
          alignItems="center"
        >
          <Button
            icon={ChevronLeftIcon}
            accessibilityLabel="Previous Page"
            variant="tertiary"
            onClick={() => {
              handlePageChange(internalPage - 1);
            }}
            isDisabled={shouldDisablePreviousPage()}
          />
          {onMobile && (
            <BaseBox flex={1} alignItems="center" justifyContent="center">
              <Text textAlign="center">{`Showing ${internalPage + 1} of ${totalPages} pages`}</Text>
            </BaseBox>
          )}
          {totalPages > 1 && showPageNumberSelector && !onMobile && (
            <BaseBox gap="spacing.1" display="flex" flexDirection="row">
              <PageSelectionButton
                onClick={() => handlePageChange(paginationButtons.firstItem - 1)}
                isSelected={internalPage === paginationButtons.firstItem - 1}
                isDisabled={isDisabled}
                {...makeAccessible({ label: `Page ${paginationButtons.firstItem}` })}
              >
                <Text
                  size="medium"
                  color={
                    internalPage === paginationButtons.firstItem - 1
                      ? pagination.pageSelectionButton.textColorSelected
                      : pagination.pageSelectionButton.textColor
                  }
                >
                  {paginationButtons.firstItem}
                </Text>
              </PageSelectionButton>
              {paginationButtons.showStartEllipsis && (
                <PageSelectionButton
                  onClick={() => handlePageChange(internalPage - 5)}
                  onMouseOver={() => setCurrentEllipseHover('start')}
                  onMouseLeave={() => setCurrentEllipseHover(undefined)}
                  onFocus={() => setCurrentEllipseHover('start')}
                  onBlur={() => setCurrentEllipseHover(undefined)}
                  isDisabled={isDisabled}
                  {...makeAccessible({ label: 'Go back 5 pages' })}
                >
                  {currentEllipseHover === 'start' ? (
                    <ChevronsLeftIcon size="medium" />
                  ) : (
                    <MoreHorizontalIcon size="medium" />
                  )}
                </PageSelectionButton>
              )}
              {paginationButtons.middleItems.map((item) => (
                <PageSelectionButton
                  key={item - 1}
                  onClick={() => handlePageChange(item - 1)}
                  isSelected={internalPage === item - 1}
                  isDisabled={isDisabled}
                  {...makeAccessible({ label: `Page ${item}` })}
                >
                  <Text
                    size="medium"
                    color={
                      internalPage === item - 1
                        ? pagination.pageSelectionButton.textColorSelected
                        : pagination.pageSelectionButton.textColor
                    }
                  >
                    {item}
                  </Text>
                </PageSelectionButton>
              ))}
              {paginationButtons.showEndEllipsis && (
                <PageSelectionButton
                  onClick={() => handlePageChange(internalPage + 5)}
                  onMouseOver={() => setCurrentEllipseHover('end')}
                  onMouseLeave={() => setCurrentEllipseHover(undefined)}
                  onFocus={() => setCurrentEllipseHover('end')}
                  onBlur={() => setCurrentEllipseHover(undefined)}
                  isDisabled={isDisabled}
                  {...makeAccessible({ label: 'Go forward 5 pages' })}
                >
                  {currentEllipseHover === 'end' ? (
                    <ChevronsRightIcon size="medium" />
                  ) : (
                    <MoreHorizontalIcon size="medium" />
                  )}
                </PageSelectionButton>
              )}
              <PageSelectionButton
                onClick={() => handlePageChange(paginationButtons.lastItem - 1)}
                isSelected={internalPage === paginationButtons.lastItem - 1}
                isDisabled={isDisabled}
                {...makeAccessible({ label: `Page ${paginationButtons.lastItem}` })}
              >
                <Text
                  size="medium"
                  color={
                    internalPage === paginationButtons.lastItem - 1
                      ? pagination.pageSelectionButton.textColorSelected
                      : pagination.pageSelectionButton.textColor
                  }
                >
                  {paginationButtons.lastItem}
                </Text>
              </PageSelectionButton>
            </BaseBox>
          )}
          <Button
            variant="tertiary"
            icon={ChevronRightIcon}
            accessibilityLabel="Next Page"
            onClick={() => {
              handlePageChange(internalPage + 1);
            }}
            isDisabled={shouldDisableNextPage()}
          />
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

const Pagination = assignWithoutSideEffects(_Pagination, {
  componentId: 'Pagination',
});

export { Pagination };
