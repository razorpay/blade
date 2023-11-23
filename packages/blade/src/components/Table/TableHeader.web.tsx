import React from 'react';
import getIn from 'lodash/get';
import styled from 'styled-components';
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';
import { tableHeader } from './tokens';
import { useTableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { castWebType, makeMotionTime, makeSpace, useTheme } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import type { SurfaceLevels } from '~tokens/theme/theme';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

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
  '&:focus-visible': {
    boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    outline: 'none',
  },
}));

const SortIcon = ({
  isSorted,
  isSortReversed,
  onClick,
}: {
  isSorted: boolean;
  isSortReversed: boolean;
  onClick: () => void;
}): React.ReactElement => {
  const { theme } = useTheme();
  const defaultColor = getIn(theme.colors, 'surface.action.icon.default.lowContrast');
  const activeColor = getIn(theme.colors, 'brand.primary.500');
  const upArrowColor = isSorted && isSortReversed ? activeColor : defaultColor;
  const downArrowColor = isSorted && !isSortReversed ? activeColor : defaultColor;
  return (
    <SortButton {...makeAccessible({ label: 'Toggle Sort', role: 'button' })} onClick={onClick}>
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

type TableHeaderProps = {
  /**
   * The children of TableHeader should be TableHeaderRow
   * @example
   * <TableHeader>
   *   <TableHeaderRow>
   *     <TableHeaderCell>Header Cell 1</TableHeaderCell>
   *   </TableHeaderRow>
   * </TableHeader>
   **/
  children: React.ReactNode;
};

const StyledHeader = styled(Header)({
  '&&&': {
    '& tr:first-child th': {
      borderTop: 'none',
    },
  },
});

const _TableHeader = ({ children }: TableHeaderProps): React.ReactElement => {
  return (
    <StyledHeader {...metaAttribute({ name: MetaConstants.TableHeader })}>{children}</StyledHeader>
  );
};

const TableHeader = assignWithoutSideEffects(_TableHeader, {
  componentId: ComponentIds.TableHeader,
});

export type TableHeaderCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The unique key of the column.
   * This is used to identify the column for sorting in sortFunctions prop of Table.
   * Sorting is enabled only for columns whose key is present in sortableColumns prop of Table.
   **/
  headerKey?: string;
};

const StyledHeaderCell = styled(HeaderCell)<{
  surfaceLevel: SurfaceLevels;
  isSortable: boolean;
}>(({ theme, surfaceLevel, isSortable }) => ({
  '&&&': {
    backgroundColor: getIn(theme.colors, `surface.background.level${surfaceLevel}.lowContrast`),
    height: '100%',
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderTopWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderTopColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderBottomStyle: 'solid',
    borderTopStyle: 'solid',
    cursor: isSortable ? 'pointer' : 'auto',
    '> div': {
      backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      paddingTop: makeSpace(getIn(theme, tableHeader.paddingTop)),
      paddingBottom: makeSpace(getIn(theme, tableHeader.paddingBottom)),
      paddingLeft: makeSpace(getIn(theme, tableHeader.paddingLeft)),
      paddingRight: makeSpace(getIn(theme, tableHeader.paddingRight)),
    },
    '&:focus-visible': {
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]} inset`,
      outline: 'none',
    },
  },
}));

const _TableHeaderCell = ({ children, headerKey }: TableHeaderCellProps): React.ReactElement => {
  const { toggleSort, currentSortedState, surfaceLevel } = useTableContext();
  const isChildrenString = typeof children === 'string';
  const isSortable =
    headerKey && Boolean(currentSortedState.sortableColumns?.find((key) => key === headerKey));
  return (
    <StyledHeaderCell
      tabIndex={0}
      surfaceLevel={surfaceLevel}
      isSortable={isSortable}
      onClick={() => {
        if (isSortable) {
          toggleSort(headerKey);
        }
      }}
      {...metaAttribute({ name: MetaConstants.TableHeaderCell })}
    >
      {isChildrenString ? (
        <Text size="medium" weight="bold">
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
            onClick={() => headerKey && toggleSort(headerKey)}
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
  isIndeterminate,
  onChange,
}: {
  isChecked: CheckboxProps['isChecked'];
  isIndeterminate?: CheckboxProps['isIndeterminate'];
  onChange: CheckboxProps['onChange'];
}): React.ReactElement => {
  return (
    <TableHeaderCell headerKey="SELECT">
      <BaseBox display="flex" alignItems="center" justifyContent="center" flex={1}>
        <Checkbox isChecked={isChecked} isIndeterminate={isIndeterminate} onChange={onChange} />
      </BaseBox>
    </TableHeaderCell>
  );
};
type TableHeaderRowProps = {
  /**
   * The children of TableHeaderRow should be TableHeaderCell
   * @example
   * <TableHeader>
   *   <TableHeaderRow>
   *     <TableHeaderCell>Header Cell 1</TableHeaderCell>
   *   </TableHeaderRow>
   * </TableHeader>
   **/
  children: React.ReactNode;
};

const _TableHeaderRow = ({ children }: TableHeaderRowProps): React.ReactElement => {
  const { selectionType, selectedRows, totalItems, toggleAllRowsSelection } = useTableContext();
  const isMultiSelect = selectionType === 'multiple';
  const isAllSelected = selectedRows && selectedRows.length === totalItems;
  const isIndeterminate = selectedRows && selectedRows.length > 0 && !isAllSelected;
  return (
    <HeaderRow role="row" {...metaAttribute({ name: MetaConstants.TableHeaderRow })}>
      {isMultiSelect && (
        <TableHeaderCellCheckbox
          isChecked={isAllSelected}
          isIndeterminate={isIndeterminate}
          onChange={() => toggleAllRowsSelection()}
        />
      )}
      {children}
    </HeaderRow>
  );
};

const TableHeaderRow = assignWithoutSideEffects(_TableHeaderRow, {
  componentId: ComponentIds.TableHeaderRow,
});

export { TableHeader, TableHeaderRow, TableHeaderCell, TableHeaderCellCheckbox };
