import React, { useEffect } from 'react';
import styled from 'styled-components';
import getIn from 'lodash/get';
import { useTableContext } from './TableContext';
import { tablePagination } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Text } from '~components/Typography';

type TablePaginationProps = {
  pageSize?: number;
  defaultPageSize?: number;
  currentPage?: number;
  onPageChange?: ({ page }: { page: number }) => void;
  onPageSizeChange?: ({ pageSize }: { pageSize: number }) => void;
};

const rowSizeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const PageSelectionButton = styled.button<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorSelected)
    : 'transparent',
  border: 'none',
  cursor: 'pointer',
  height: '32px',
  width: '32px',
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
    '&:focus-visible': {
      outline: `1px solid ${theme.colors.surface.background.level1.lowContrast}`,
      boxShadow: `0px 0px 0px 4px ${getIn(
        theme.colors,
        tablePagination.pageSelectionButton.focusRingColor,
      )}`,
    },
  },
  '&:active': {
    backgroundColor: isSelected
      ? getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorSelectedActive)
      : getIn(theme.colors, tablePagination.pageSelectionButton.backgroundColorActive),
  },
}));

const TablePagination = ({
  pageSize: controlledPageSize,
  currentPage: controlledCurrentPage,
  onPageChange,
  onPageSizeChange,
  defaultPageSize = tablePagination.defaultPageSize,
}: TablePaginationProps): React.ReactElement => {
  const {
    setPaginationPage,
    currentPaginationState,
    totalItems,
    setPaginationRowSize,
  } = useTableContext();
  const [currentPageSize, setCurrentPageSize] = React.useState<number>(
    controlledPageSize ?? defaultPageSize,
  );
  const [currentPage, setCurrentPage] = React.useState<number>(
    controlledCurrentPage ?? currentPaginationState?.page ?? 0,
  );

  useEffect(() => {
    setPaginationRowSize(currentPageSize);
  }, []);

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
    onPageChange?.({ page });
    if (controlledCurrentPage) return;
    setPaginationPage(page);
    setCurrentPage(page);
  };

  if (currentPage > totalPages - 1) {
    handlePageChange(totalPages - 1);
  }

  const handlePageSizeChange = (pageSize: number): void => {
    onPageSizeChange?.({ pageSize });
    if (controlledPageSize) return;
    setPaginationRowSize(pageSize);
    setCurrentPageSize(pageSize);
  };

  const shouldDisableNextPage = (): boolean => {
    return currentPage >= totalPages - 1;
  };

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      padding={tablePagination.padding}
      backgroundColor={tablePagination.backgroundColor}
    >
      <BaseBox
        display="flex"
        flex={1}
        gap="spacing.2"
        justifyContent="flex-end"
        alignItems="center"
      >
        <BaseBox width="65px">
          <Dropdown selectionType="single">
            <SelectInput
              accessibilityLabel="Page Size"
              name="page-size"
              label=""
              labelPosition="inside-input"
              placeholder=""
              onChange={({ values }) => {
                handlePageSizeChange(Number(values[0]));
              }}
              defaultValue={currentPageSize.toString()}
              value={controlledPageSize?.toString()}
            />
            <DropdownOverlay>
              <ActionList>
                {rowSizeOptions.map((item, index) => (
                  <ActionListItem key={index} title={item.toString()} value={item.toString()} />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </BaseBox>
        <BaseBox display="flex" flexDirection="row" gap="spacing.2">
          <Button
            size="small"
            icon={ChevronLeftIcon}
            accessibilityLabel="Previous Page"
            variant="tertiary"
            onClick={() => {
              handlePageChange(currentPage - 1);
            }}
            isDisabled={currentPage <= 0}
          />
          <BaseBox gap="spacing.1" display="flex" flexDirection="row">
            {Array(totalPages)
              .fill('')
              .map((_, index) => (
                <PageSelectionButton
                  key={index}
                  onClick={() => handlePageChange(index)}
                  isSelected={currentPage === index}
                >
                  <Text
                    size="medium"
                    color={
                      currentPage === index
                        ? tablePagination.pageSelectionButton.textColorSelected
                        : tablePagination.pageSelectionButton.textColor
                    }
                  >
                    {index + 1}
                  </Text>
                </PageSelectionButton>
              ))}
          </BaseBox>
          <Button
            size="small"
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
    </BaseBox>
  );
};

export { TablePagination };
export type { TablePaginationProps };
