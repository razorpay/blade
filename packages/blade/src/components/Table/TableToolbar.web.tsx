import React from 'react';
import styled from 'styled-components';
import { ComponentIds } from './componentIds';
import { tableToolbar } from './tokens';
import { useTableContext } from './TableContext';
import type { TableToolbarProps, TableToolbarActionsProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Divider } from '~components/Divider';
import { Link } from '~components/Link';
import { getStyledProps } from '~components/Box/styledProps';
import { makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

/**
 * TableToolbarActions is a component that is used to render actions in the TableToolbar.
 * It is a flex container that will render its children in a row on desktop and a column on mobile.
 * @param children - any react element
 * @param styledProps - accepts all of the styled props from Box
 */
const _TableToolbarActions = ({
  children,
  ...rest
}: TableToolbarActionsProps): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  return (
    <BaseBox
      display="flex"
      flex={onMobile ? 1 : 0}
      justifyContent={onMobile ? 'flex-start' : 'flex-end'}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

const TableToolbarActions = assignWithoutSideEffects(_TableToolbarActions, {
  componentId: ComponentIds.TableToolbarActions,
});

const ToolbarWrapper = styled(BaseBox)(({ theme }) => ({
  transition: `background-color ${makeMotionTime(
    getIn(theme.motion, tableToolbar.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableToolbar.backgroundColorMotionEasing)}`,
}));

const _TableToolbar = ({
  children,
  title,
  selectedTitle: controlledSelectedTitle,
  ...rest
}: TableToolbarProps): React.ReactElement => {
  const {
    selectedRows,
    deselectAllRows,
    currentPaginationState,
    totalItems,
    backgroundColor,
  } = useTableContext();
  const { platform } = useTheme();
  const isSelected = selectedRows && selectedRows.length > 0;

  const defaultTitle = currentPaginationState
    ? `Showing ${currentPaginationState.page * currentPaginationState.size + 1}-${
        currentPaginationState.page * currentPaginationState.size + currentPaginationState.size
      } Items`
    : `Showing 1-${totalItems} Items`;
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
    <BaseBox backgroundColor={backgroundColor} {...makeAnalyticsAttribute(rest)}>
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
            <Text
              size="medium"
              weight="medium"
              color={isSelected ? 'surface.text.gray.normal' : 'surface.text.gray.subtle'}
            >
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
