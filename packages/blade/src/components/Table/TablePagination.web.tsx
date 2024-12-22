import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useTableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import { tablePagination } from './tokens';
import type { TablePaginationCommonProps, TablePaginationProps } from './types';
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
import { throwBladeError } from '~utils/logger';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const pageSizeOptions: NonNullable<TablePaginationCommonProps['defaultPageSize']>[] = [10, 25, 50];

const PageSelectionButton = styled.button<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorSelected)
    : 'transparent',
  border: 'none',
  cursor: 'pointer',
  height: makeSize(tablePagination.pageSelectionButton.height),
  width: makeSize(tablePagination.pageSelectionButton.width),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: getIn(theme.border.radius, tablePagination.pageSelectionButton.borderRadius),
  '&:hover': {
    backgroundColor: isSelected
      ? getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorSelectedHover)
      : getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorHover),
  },
  '&:focus-visible': {
    backgroundColor: isSelected
      ? getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorSelectedActive)
      : getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorActive),
    outline: 'none',
    '&:focus-visible': getFocusRingStyles({ theme }),
  },
  '&:active': {
    backgroundColor: isSelected
      ? getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorSelectedActive)
      : getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorActive),
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

const _TablePagination = ({
  currentPage: controlledCurrentPage,
  onPageChange,
  onPageSizeChange,
  defaultPageSize = tablePagination.defaultPageSize,
  showPageSizePicker = true,
  showPageNumberSelector = false,
  showLabel,
  label,
  totalItemCount,
  paginationType = 'client',
  ...rest
}: TablePaginationProps): React.ReactElement => {
  const {
    setPaginationPage,
    currentPaginationState,
    totalItems,
    setPaginationRowSize,
    setPaginationType,
    backgroundColor,
  } = useTableContext();
  const [currentPageSize, setCurrentPageSize] = React.useState<number>(defaultPageSize);
  const [currentPage, setCurrentPage] = React.useState<number>(
    !isUndefined(controlledCurrentPage) ? controlledCurrentPage : currentPaginationState?.page ?? 0,
  );
  const [currentEllipseHover, setCurrentEllipseHover] = React.useState<'start' | 'end' | undefined>(
    undefined,
  );

  const defaultLabel = currentPaginationState
    ? `Showing ${currentPaginationState.page * currentPaginationState.size + 1}-${
        currentPaginationState.page * currentPaginationState.size + currentPaginationState.size
      } Items`
    : `Showing 1 to ${totalItems} Items`;

  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  useEffect(() => {
    setPaginationRowSize(currentPageSize);
    setPaginationType(paginationType);
  }, []);

  useEffect(() => {
    if (currentPage && currentPaginationState?.page !== currentPage) {
      setPaginationPage(currentPage);
    }
  }, [currentPage, currentPaginationState?.page, setPaginationPage]);

  const totalPages = isUndefined(totalItemCount)
    ? Math.ceil(totalItems / currentPageSize)
    : Math.ceil(totalItemCount / currentPageSize);

  const handlePageChange = useCallback(
    (page: number): void => {
      let pageToJumpTo = page;
      if (pageToJumpTo < 0) {
        pageToJumpTo = 0;
      } else if (pageToJumpTo > totalPages - 1) {
        pageToJumpTo = totalPages - 1;
      }

      onPageChange?.({ page: pageToJumpTo });

      if (!isUndefined(controlledCurrentPage)) {
        pageToJumpTo = controlledCurrentPage;
      }
      setPaginationPage(pageToJumpTo);
      setCurrentPage(pageToJumpTo);
    },
    [controlledCurrentPage, onPageChange, setPaginationPage, totalPages],
  );

  useEffect(() => {
    if (!isUndefined(controlledCurrentPage) && controlledCurrentPage !== currentPage) {
      handlePageChange(controlledCurrentPage);
    }
  }, [controlledCurrentPage, currentPage, handlePageChange, onPageChange]);

  if (__DEV__) {
    if (paginationType === 'server' && (isUndefined(totalItemCount) || isUndefined(onPageChange))) {
      throwBladeError({
        message:
          '`onPageChange` and `totalItemCount` props are required when paginationType is server.',
        moduleName: 'TablePagination',
      });
    }
  }

  const handlePageSizeChange = (pageSize: number): void => {
    onPageSizeChange?.({ pageSize });
    setPaginationRowSize(pageSize);
    setCurrentPageSize(pageSize);
  };

  const shouldDisableNextPage = (): boolean => {
    return currentPage >= totalPages - 1;
  };
  const paginationButtons = getPaginationButtons({
    currentSelection: currentPage + 1,
    totalPages,
  });

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      padding={tablePagination.padding}
      backgroundColor={backgroundColor}
      {...makeAnalyticsAttribute(rest)}
    >
      {showLabel && !onMobile && (
        <BaseBox display="flex" justifyContent="center" alignItems="center">
          <Text size="medium" weight="semibold">
            {label ?? defaultLabel}
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
                accessibilityLabel="Select pages per row"
                name="page-size"
                label=""
                labelPosition="inside-input"
                placeholder=""
                onChange={({ values }) => {
                  handlePageSizeChange(Number(values[0]));
                }}
                defaultValue={currentPageSize.toString()}
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
              <Text>rows / page</Text>
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
              handlePageChange(currentPage - 1);
            }}
            isDisabled={currentPage <= 0}
          />
          {onMobile && (
            <BaseBox flex={1} alignItems="center" justifyContent="center">
              <Text textAlign="center">{`Showing ${currentPage + 1} of ${totalPages} pages`}</Text>
            </BaseBox>
          )}
          {totalPages > 1 && showPageNumberSelector && !onMobile && (
            <BaseBox gap="spacing.1" display="flex" flexDirection="row">
              <PageSelectionButton
                onClick={() => handlePageChange(paginationButtons.firstItem - 1)}
                isSelected={currentPage === paginationButtons.firstItem - 1}
              >
                <Text
                  size="medium"
                  color={
                    currentPage === paginationButtons.firstItem - 1
                      ? tablePagination.pageSelectionButton.textColorSelected
                      : tablePagination.pageSelectionButton.textColor
                  }
                >
                  {paginationButtons.firstItem}
                </Text>
              </PageSelectionButton>
              {paginationButtons.showStartEllipsis && (
                <PageSelectionButton
                  onClick={() => handlePageChange(currentPage - 5)}
                  onMouseOver={() => setCurrentEllipseHover('start')}
                  onMouseLeave={() => setCurrentEllipseHover(undefined)}
                  onFocus={() => setCurrentEllipseHover('start')}
                  onBlur={() => setCurrentEllipseHover(undefined)}
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
                  isSelected={currentPage === item - 1}
                  {...makeAccessible({ label: `Page ${item}` })}
                >
                  <Text
                    size="medium"
                    color={
                      currentPage === item - 1
                        ? tablePagination.pageSelectionButton.textColorSelected
                        : tablePagination.pageSelectionButton.textColor
                    }
                  >
                    {item}
                  </Text>
                </PageSelectionButton>
              ))}
              {paginationButtons.showEndEllipsis && (
                <PageSelectionButton
                  onClick={() => handlePageChange(currentPage + 5)}
                  onMouseOver={() => setCurrentEllipseHover('end')}
                  onMouseLeave={() => setCurrentEllipseHover(undefined)}
                  onFocus={() => setCurrentEllipseHover('end')}
                  onBlur={() => setCurrentEllipseHover(undefined)}
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
                isSelected={currentPage === paginationButtons.lastItem - 1}
              >
                <Text
                  size="medium"
                  color={
                    currentPage === paginationButtons.lastItem - 1
                      ? tablePagination.pageSelectionButton.textColorSelected
                      : tablePagination.pageSelectionButton.textColor
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
              handlePageChange(currentPage + 1);
            }}
            isDisabled={shouldDisableNextPage()}
          />
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

const TablePagination = assignWithoutSideEffects(_TablePagination, {
  componentId: ComponentIds.TablePagination,
});

export { TablePagination };
