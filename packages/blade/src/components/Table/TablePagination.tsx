import React, { useEffect } from 'react';
import { useTableContext } from './TableContext';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';

type TablePaginationProps = {
  pageSize?: number;
  defaultPageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

const rowSizeOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const TablePagination = ({
  pageSize: controlledPageSize,
  currentPage: controlledCurrentPage,
  onPageChange,
  defaultPageSize,
}: TablePaginationProps): React.ReactElement => {
  const {
    setPaginationPage,
    currentPaginationState,
    totalItems,
    setPaginationRowSize,
  } = useTableContext();
  const [currentPageSize, setCurrentPageSize] = React.useState<number>(
    controlledPageSize ?? defaultPageSize ?? currentPaginationState?.size ?? 10,
  );
  console.log('🚀 ~ file: TablePagination.tsx:34 ~ currentPageSize:', currentPageSize);
  const [currentPage, setCurrentPage] = React.useState<number>(
    controlledCurrentPage ?? currentPaginationState?.page ?? 1,
  );

  useEffect(() => {
    if (controlledPageSize && currentPaginationState?.size !== controlledPageSize) {
      setPaginationRowSize(controlledPageSize);
    }
  }, [controlledPageSize, currentPaginationState?.size, setPaginationRowSize]);

  useEffect(() => {
    if (currentPage && currentPaginationState?.page !== currentPage) {
      setPaginationPage(currentPage);
    }
  }, [currentPage, currentPaginationState?.page, setPaginationPage]);

  const totalPages = Math.ceil(totalItems / currentPageSize);

  const handlePageChange = (page: number): void => {
    onPageChange?.(page);
    if (controlledCurrentPage) return;
    setPaginationPage(page);
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number): void => {
    if (controlledPageSize) return;
    setPaginationRowSize(size);
    setCurrentPageSize(size);
  };

  const shouldDisableNextPage = (): boolean => {
    return currentPage >= totalPages - 1;
  };

  return (
    <BaseBox display="flex" flexDirection="row" padding="spacing.4">
      <BaseBox display="flex" flex={1} gap="spacing.2" justifyContent="flex-end">
        <BaseBox width="64px">
          <Dropdown selectionType="single">
            <AutoComplete
              name="page-size"
              placeholder=""
              onChange={({ name, values }) => {
                handlePageSizeChange(Number(values[0]));
              }}
              defaultValue={currentPageSize.toString()}
            />
            <DropdownOverlay>
              <ActionList>
                {rowSizeOptions.map((item, index) => (
                  <ActionListItem
                    key={index}
                    title={(index + 1).toString()}
                    value={(index + 1).toString()}
                  />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </BaseBox>
        <Button
          size="large"
          icon={ChevronLeftIcon}
          accessibilityLabel="Previous Page"
          variant="tertiary"
          onClick={() => {
            handlePageChange(currentPage - 1);
          }}
          isDisabled={currentPage <= 0}
        />
        <Button
          size="large"
          icon={ChevronRightIcon}
          accessibilityLabel="Next Page"
          variant="tertiary"
          onClick={() => {
            handlePageChange(currentPage + 1);
            console.log('next page');
          }}
          isDisabled={shouldDisableNextPage()}
        />
      </BaseBox>
    </BaseBox>
  );
};

export { TablePagination };
export type { TablePaginationProps };
