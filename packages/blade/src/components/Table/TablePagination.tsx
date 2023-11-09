import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';

type TablePaginationProps = {};

const TablePagination = (props: TablePaginationProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="row" padding="spacing.4">
      <BaseBox display="flex" flex={1} gap="spacing.2" justifyContent="flex-end">
        <Button
          icon={ChevronLeftIcon}
          accessibilityLabel="Previous Page"
          variant="tertiary"
          onClick={() => console.log('previous page')}
        />
        <Button
          icon={ChevronRightIcon}
          accessibilityLabel="Next Page"
          variant="tertiary"
          onClick={() => console.log('next page')}
        />
      </BaseBox>
    </BaseBox>
  );
};

export { TablePagination };
export type { TablePaginationProps };
