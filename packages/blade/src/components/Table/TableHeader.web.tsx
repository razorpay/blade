import React from 'react';
import styled from 'styled-components';
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';
import { tableHeader, tableRow } from './tokens';
import { useTableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import type {
  TableHeaderRowProps,
  TableHeaderCellProps,
  TableBackgroundColors,
  TableProps,
} from './types';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { castWebType, makeMotionTime, makeSize, makeSpace } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { size } from '~tokens/global';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const SortButton = styled.button(({ theme }) => ({
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  margin: 0,
  borderRadius: theme.border.radius.small,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transitionProperty: 'color, box-shadow',
  transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, 'duration.quick'))),
  transitionTimingFunction: (theme.motion.easing.standard as unknown) as string,
  '&:focus-visible': getFocusRingStyles({ theme }),
}));

const SortIcon = ({
  isSorted,
  isSortReversed,
}: {
  isSorted: boolean;
  isSortReversed: boolean;
}): React.ReactElement => {
  const { theme } = useTheme();
  const defaultColor = getIn(theme.colors, 'interactive.icon.gray.muted');
  const activeColor = getIn(theme.colors, 'interactive.icon.primary.subtle');
  const upArrowColor = isSorted && isSortReversed ? activeColor : defaultColor;
  const downArrowColor = isSorted && !isSortReversed ? activeColor : defaultColor;
  return (
    <SortButton {...makeAccessible({ label: 'Toggle Sort', role: 'button' })}>
      <svg width={20} height={20} fill="none">
        <path
          fill={upArrowColor}
          d="M10.59 2.251a.817.817 0 0 0-1.18 0L5.245 6.537a.875.875 0 0 0 0 1.212.817.817 0 0 0 1.179 0L10 4.069l3.577 3.68a.817.817 0 0 0 1.179 0 .874.874 0 0 0 0-1.212L10.589 2.25Z"
        />
        <path
          fill={downArrowColor}
          d="M9.41 17.749a.817.817 0 0 0 1.18 0l4.166-4.286a.874.874 0 0 0 0-1.212.817.817 0 0 0-1.179 0L10 15.931l-3.577-3.68a.817.817 0 0 0-1.179 0 .874.874 0 0 0 0 1.212l4.167 4.286Z"
        />
      </svg>
    </SortButton>
  );
};

const StyledHeader = styled(Header)({
  '&&&': {
    '& tr:first-child th': {
      borderTop: 'none',
    },
  },
});

const _TableHeader = ({ children, ...rest }: TableHeaderRowProps): React.ReactElement => {
  return (
    <StyledHeader
      {...metaAttribute({ name: MetaConstants.TableHeader })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledHeader>
  );
};

const TableHeader = assignWithoutSideEffects(_TableHeader, {
  componentId: ComponentIds.TableHeader,
});

const StyledHeaderCell = styled(HeaderCell)<{
  $isSortable: boolean;
  $backgroundColor: TableBackgroundColors;
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  $hasPadding: boolean;
}>(({ theme, $isSortable, $backgroundColor, $rowDensity, $hasPadding }) => ({
  '&&&': {
    height: '100%',
    backgroundColor: getIn(theme.colors, $backgroundColor),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderTopWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderTopColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderBottomStyle: 'solid',
    borderTopStyle: 'solid',
    cursor: $isSortable ? 'pointer' : 'auto',
    '> div': {
      backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      paddingLeft: $hasPadding
        ? makeSpace(getIn(theme, tableRow.paddingLeft[$rowDensity]))
        : undefined,
      paddingRight: $hasPadding
        ? makeSpace(getIn(theme, tableRow.paddingRight[$rowDensity]))
        : undefined,
      minHeight: makeSize(getIn(size, tableRow.minHeight[$rowDensity])),
    },
    '&:focus-visible': getFocusRingStyles({ theme, negativeOffset: true }),
  },
}));

const _TableHeaderCell = ({
  children,
  headerKey,
  _hasPadding = true,
  ...rest
}: TableHeaderCellProps): React.ReactElement => {
  const {
    toggleSort,
    currentSortedState,
    backgroundColor,
    rowDensity,
    headerRowDensity,
  } = useTableContext();
  const isChildrenString = typeof children === 'string';
  const isSortable =
    headerKey && Boolean(currentSortedState.sortableColumns?.find((key) => key === headerKey));
  return (
    <StyledHeaderCell
      tabIndex={0}
      $isSortable={isSortable}
      $backgroundColor={backgroundColor}
      $rowDensity={headerRowDensity ?? rowDensity}
      $hasPadding={_hasPadding}
      onClick={() => {
        if (isSortable) {
          toggleSort(headerKey);
        }
      }}
      {...metaAttribute({ name: MetaConstants.TableHeaderCell })}
      {...makeAnalyticsAttribute(rest)}
    >
      {isChildrenString ? (
        <Text size="medium" weight="medium" color="surface.text.gray.normal">
          {children}
        </Text>
      ) : (
        children
      )}
      {isSortable && (
        <BaseBox paddingLeft="spacing.2" backgroundColor="transparent">
          <SortIcon
            isSorted={currentSortedState.sortKey === headerKey}
            isSortReversed={currentSortedState.isSortReversed}
          />
        </BaseBox>
      )}
    </StyledHeaderCell>
  );
};

const TableHeaderCell = assignWithoutSideEffects(_TableHeaderCell, {
  componentId: ComponentIds.TableHeaderCell,
});

const TableHeaderCellCheckbox = ({
  isChecked,
  isDisabled,
  isIndeterminate,
  onChange,
}: {
  isChecked: CheckboxProps['isChecked'];
  isDisabled: CheckboxProps['isDisabled'];
  isIndeterminate?: CheckboxProps['isIndeterminate'];
  onChange: CheckboxProps['onChange'];
}): React.ReactElement => {
  return (
    <TableHeaderCell headerKey="SELECT">
      <BaseBox display="flex" alignItems="center" justifyContent="center" flex={1}>
        <Checkbox
          isChecked={isChecked}
          isDisabled={isDisabled}
          isIndeterminate={isIndeterminate}
          onChange={onChange}
        />
      </BaseBox>
    </TableHeaderCell>
  );
};

const StyledHeaderRow = styled(HeaderRow)<{ $showBorderedCells: boolean }>(
  ({ theme, $showBorderedCells }) => ({
    '& th': $showBorderedCells
      ? {
          borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderRightColor: getIn(theme.colors, tableRow.borderColor),
          borderRightStyle: 'solid',
        }
      : undefined,
    '& th:last-child ': {
      borderRight: 'none',
    },
  }),
);

const _TableHeaderRow = ({
  children,
  rowDensity,
  ...rest
}: TableHeaderRowProps): React.ReactElement => {
  const {
    disabledRows,
    selectionType,
    selectedRows,
    totalItems,
    toggleAllRowsSelection,
    setHeaderRowDensity,
    showBorderedCells,
    hasHoverActions,
  } = useTableContext();
  const isMultiSelect = selectionType === 'multiple';
  const isAllSelected = selectedRows && selectedRows.length === totalItems;
  const isIndeterminate = selectedRows && selectedRows.length > 0 && !isAllSelected;
  const isDisabled = disabledRows && disabledRows.length === totalItems;
  if (rowDensity) {
    setHeaderRowDensity(rowDensity);
  }
  return (
    <StyledHeaderRow
      role="rowheader"
      {...metaAttribute({ name: MetaConstants.TableHeaderRow })}
      {...makeAnalyticsAttribute(rest)}
      $showBorderedCells={showBorderedCells}
    >
      {isMultiSelect && (
        <TableHeaderCellCheckbox
          isChecked={isAllSelected}
          isDisabled={isDisabled}
          isIndeterminate={isIndeterminate}
          onChange={() => toggleAllRowsSelection()}
        />
      )}
      {children}
      {hasHoverActions ? <TableHeaderCell _hasPadding={false}>Actions</TableHeaderCell> : null}
    </StyledHeaderRow>
  );
};

const TableHeaderRow = assignWithoutSideEffects(_TableHeaderRow, {
  componentId: ComponentIds.TableHeaderRow,
});

export { TableHeader, TableHeaderRow, TableHeaderCell };
