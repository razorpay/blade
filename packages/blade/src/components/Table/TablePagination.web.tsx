import React, { useEffect, useMemo } from 'react';
import { useTableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import { tablePagination } from './tokens';
import type { TablePaginationProps } from './types';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { Pagination } from '~components/Pagination';

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

  // Sync pagination type with table context
  useEffect(() => {
    setPaginationType(paginationType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationType]);

  // Calculate totalPages - use provided value, or calculate from totalItemCount
  const totalPages = useMemo(() => {
    if (
      !isUndefined(totalItemCount) &&
      currentPaginationState &&
      !isUndefined(currentPaginationState.size)
    ) {
      return Math.ceil(totalItemCount / currentPaginationState.size);
    }
    if (
      paginationType === 'client' &&
      totalItems &&
      currentPaginationState &&
      !isUndefined(currentPaginationState.size)
    ) {
      return Math.ceil(totalItems / currentPaginationState.size);
    }
    return undefined;
  }, [totalItemCount, currentPaginationState, totalItems, paginationType]);

  // Determine current page - use controlled value, fallback to table context, or default to 0 (0-indexed)
  const currentPage = useMemo(() => {
    if (!isUndefined(controlledCurrentPage)) {
      return controlledCurrentPage;
    }
    if (!isUndefined(currentPaginationState?.page)) {
      return currentPaginationState?.page;
    }
    return 0;
  }, [controlledCurrentPage, currentPaginationState?.page]);

  // Determine current page size - fallback to table context, or default
  const currentPageSize = useMemo(() => {
    if (!isUndefined(currentPaginationState?.size)) {
      return currentPaginationState?.size;
    }
    return defaultPageSize;
  }, [currentPaginationState?.size, defaultPageSize]);

  // Generate default label for table context
  const defaultLabel = useMemo(() => {
    if (label) {
      return label;
    }
    if (currentPaginationState && totalItemCount) {
      const start = currentPaginationState.page * currentPaginationState.size + 1;
      const end = Math.min(
        (currentPaginationState.page + 1) * currentPaginationState.size,
        totalItemCount,
      );
      return `Showing ${start}-${end} Items`;
    }
    if (currentPaginationState && totalItems) {
      const start = currentPaginationState.page * currentPaginationState.size + 1;
      const end = Math.min(
        (currentPaginationState.page + 1) * currentPaginationState.size,
        totalItems,
      );
      return `Showing ${start}-${end} Items`;
    }
    if (totalItemCount) {
      return `Showing 1 to ${totalItemCount} Items`;
    }
    if (totalItems) {
      return `Showing 1 to ${totalItems} Items`;
    }
    return 'Showing Items';
  }, [label, currentPaginationState, totalItemCount, totalItems]);

  // Sync page size with table context
  useEffect(() => {
    if (!isUndefined(currentPageSize)) {
      setPaginationRowSize(currentPageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageSize]);

  // Sync page with table context
  useEffect(() => {
    if (!isUndefined(currentPage) && currentPaginationState?.page !== currentPage) {
      setPaginationPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentPaginationState?.page]);

  // Handle page change - update table context and call callback
  // Pagination component uses 1-indexed pages, but Table uses 0-indexed
  const handlePageChange = ({ page }: { page: number }): void => {
    // Convert from 1-indexed (Pagination) to 0-indexed (Table)
    const zeroIndexedPage = page - 1;
    onPageChange?.({ page: zeroIndexedPage });
    setPaginationPage(zeroIndexedPage);
  };

  // Handle page size change - update table context and call callback
  const handlePageSizeChange = ({ pageSize }: { pageSize: number }): void => {
    onPageSizeChange?.({ pageSize });
    setPaginationRowSize(pageSize);
  };

  // Validation for server-side pagination
  if (__DEV__) {
    if (paginationType === 'server' && (isUndefined(totalItemCount) || isUndefined(onPageChange))) {
      throwBladeError({
        message:
          '`onPageChange` and `totalItemCount` props are required when paginationType is server.',
        moduleName: 'TablePagination',
      });
    }
  }

  return (
<<<<<<< HEAD
    <BaseBox backgroundColor={backgroundColor}>
      <Pagination
        totalPages={totalPages}
        selectedPage={currentPage !== undefined ? currentPage + 1 : undefined}
        defaultSelectedPage={1}
        onSelectedPageChange={handlePageChange}
        defaultPageSize={defaultPageSize}
        pageSize={currentPageSize as 10 | 25 | 50}
        onPageSizeChange={handlePageSizeChange}
        showPageSizePicker={showPageSizePicker}
        showPageNumberSelector={showPageNumberSelector}
        showLabel={showLabel}
        label={defaultLabel}
        pageSizeLabel="rows / page"
        {...rest}
      />
=======
    <BaseBox
      display="flex"
      flexDirection="row"
      padding={tablePagination.padding}
      backgroundColor={backgroundColor}
      {...makeAnalyticsAttribute(rest)}
    >
      {showLabel && !onMobile && (
        <BaseBox display="flex" justifyContent="center" alignItems="center">
          <Text color="surface.text.gray.subtle" size="small" weight="regular">
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
              <Text color="surface.text.gray.subtle" size="small" textAlign="center">{`Showing ${
                currentPage + 1
              } of ${totalPages} pages`}</Text>
            </BaseBox>
          )}
          {totalPages > 1 && showPageNumberSelector && !onMobile && (
            <BaseBox gap="spacing.1" display="flex" flexDirection="row">
              <PageSelectionButton
                onClick={() => handlePageChange(paginationButtons.firstItem - 1)}
                isSelected={currentPage === paginationButtons.firstItem - 1}
                {...makeAccessible({ label: `Page ${paginationButtons.firstItem}` })}
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
                {...makeAccessible({ label: `Page ${paginationButtons.lastItem}` })}
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
>>>>>>> origin
    </BaseBox>
  );
};

const TablePagination = assignWithoutSideEffects(_TablePagination, {
  componentId: ComponentIds.TablePagination,
});

export { TablePagination };
