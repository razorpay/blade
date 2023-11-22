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
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { makeMotionTime, useTheme } from '~utils';

type TableToolbarActionsProps = {
  children?: React.ReactNode;
} & StyledPropsBlade;

/**
 * TableToolbarActions is a component that is used to render actions in the TableToolbar.
 * It is a flex container that will render its children in a row on desktop and a column on mobile.
 * @param children - any react element
 * @param styledProps - accepts all of the styled props from Box
 */
const TableToolbarActions = ({
  children,
  ...styledProps
}: TableToolbarActionsProps): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  return (
    <BaseBox
      display="flex"
      flex={onMobile ? 1 : 0}
      justifyContent={onMobile ? 'flex-start' : 'flex-end'}
      {...getStyledProps(styledProps)}
    >
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
  /**
   * The children of TableToolbar should be TableToolbarActions
   */
  children?: React.ReactNode;
  /**
   * The title of the TableToolbar. If not provided, it will show the default title.
   * @default `Showing 1 to ${totalItems} Items`
   */
  title?: string;
  /**
   * The title to show when items are selected. If not provided, it will show the default title.
   * @default `${selectedRows.length} 'Items'} Selected`
   */
  selectedTitle?: string;
};

const _TableToolbar = ({
  children,
  title,
  selectedTitle: controlledSelectedTitle,
}: TableToolbarProps): React.ReactElement => {
  const {
    selectedRows,
    deselectAllRows,
    currentPaginationState,
    totalItems,
    surfaceLevel,
  } = useTableContext();
  const { platform } = useTheme();
  const isSelected = selectedRows && selectedRows.length > 0;

  const defaultTitle = currentPaginationState
    ? `Showing ${currentPaginationState.page * currentPaginationState.size + 1}-${
        currentPaginationState.page * currentPaginationState.size + currentPaginationState.size
      } Items`
    : `Showing 1 to ${totalItems} Items`;
  const selectedItemsCount = selectedRows ? selectedRows.length : 0;
  const selectedTitle = isSelected
    ? controlledSelectedTitle ??
      `${selectedRows.length} ${selectedItemsCount === 1 ? 'Item' : 'Items'} Selected`
    : null;

  const onMobile = platform === 'onMobile';

  const deselectButton = (
    <Link marginLeft="spacing.5" variant="button" onClick={() => deselectAllRows()}>
      Deselect
    </Link>
  );

  return (
    <BaseBox backgroundColor={`surface.background.level${surfaceLevel}.lowContrast`}>
      <ToolbarWrapper
        display="flex"
        backgroundColor={
          isSelected ? tableToolbar.backgroundColorSelected : tableToolbar.backgroundColor
        }
        padding="spacing.4"
        flexWrap="wrap"
        flexDirection={onMobile ? 'column' : 'row'}
        gap="spacing.5"
      >
        <BaseBox display="flex" alignItems="center" flex={1}>
          <BaseBox>
            <Text size="medium" weight="bold">
              {selectedTitle ?? title ?? defaultTitle}
            </Text>
          </BaseBox>
          {isSelected && !onMobile && (
            <BaseBox display="flex" marginLeft="spacing.5" height="100%">
              <Divider orientation="vertical" thickness="thick" />
              {deselectButton}
            </BaseBox>
          )}
          {isSelected && onMobile && (
            <BaseBox display="flex" flex={1} justifyContent="flex-end">
              {deselectButton}
            </BaseBox>
          )}
        </BaseBox>
        {children}
      </ToolbarWrapper>
    </BaseBox>
  );
};

const TableToolbar = assignWithoutSideEffects(_TableToolbar, {
  componentId: ComponentIds.TableToolbar,
});

export { TableToolbar, TableToolbarActions };
