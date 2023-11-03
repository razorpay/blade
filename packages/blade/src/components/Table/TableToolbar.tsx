import React from 'react';
import getIn from 'lodash/get';
import styled from 'styled-components';
import { ComponentIds } from './componentIds';
import { tableToolbar } from './tokens';
import { useTableContext } from './TableContext';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Divider } from '~components/Divider';
import { Link } from '~components/Link';
import { makeMotionTime } from '~utils';

type TableToolbarActionsProps = {
  children?: React.ReactNode;
};

const TableToolbarActions = ({ children }: TableToolbarActionsProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flex={1} justifyContent="flex-end">
      {children}
    </BaseBox>
  );
};

const ToolbarWrapper = styled(BaseBox)(({ theme }) => ({
  transition: `background-color ${makeMotionTime(
    getIn(theme.motion, tableToolbar.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableToolbar.backgroundColorMotionEasing)}`,
}));

type TableToolbarProps = {
  children?: React.ReactNode;
  title?: string;
};

const _TableToolbar = ({ children, title }: TableToolbarProps): React.ReactElement => {
  const { selectedRows, toggleAllRowsSelection } = useTableContext();
  const isSelected = selectedRows && selectedRows.length > 0;
  const defaultTitle = 'Showing 1-10 Items'; // TODO: Use pagination data to show correct title
  const selectedItemsCount = selectedRows ? selectedRows.length : 0;
  const selectedTitle = isSelected
    ? `${selectedRows.length} ${selectedItemsCount === 1 ? 'Item' : 'Items'} Selected`
    : null;

  return (
    <ToolbarWrapper
      display="flex"
      backgroundColor={
        isSelected ? tableToolbar.backgroundColorSelected : tableToolbar.backgroundColor
      }
      padding="spacing.4"
    >
      <BaseBox display="flex" flex={1} alignItems="center">
        <Text size="medium" weight="bold">
          {selectedTitle ?? title ?? defaultTitle}
        </Text>
        {isSelected && (
          <BaseBox display="flex" marginLeft="spacing.5" flex={1} height="100%">
            <Divider orientation="vertical" thickness="thick" />
            <Link marginLeft="spacing.5" variant="button" onClick={() => toggleAllRowsSelection()}>
              Deselect
            </Link>
          </BaseBox>
        )}
      </BaseBox>
      {children}
    </ToolbarWrapper>
  );
};

const TableToolbar = assignWithoutSideEffects(_TableToolbar, {
  componentId: ComponentIds.TableToolbar,
});

export { TableToolbar, TableToolbarActions };
