import styled from 'styled-components';
import { CellWrapper, StyledCell } from './TableBody';
import { useTableContext } from './TableContext';
import type { TableEditableCellProps, TableEditableDropdownCellProps, TableProps } from './types';
import {
  rowDensityToIsTableInputCellMapping,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
} from './tokens';
import { ComponentIds } from './componentIds';
import { TableEditableCellContext } from './TableEditableCellContext';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import type { MarginProps } from '~components/Box/BaseBox/types/spacingTypes';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { BaseInput } from '~components/Input/BaseInput';
import { castWebType } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Dropdown } from '~components/Dropdown';

const StyledEditableCell = styled(StyledCell)<{
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
}>(({ theme, $rowDensity }) => ({
  '&&&': {
    '&:focus-visible': { outline: '1px solid' },
    '&:focus-within': {
      ...($rowDensity !== 'comfortable' ? getFocusRingStyles({ theme, negativeOffset: true }) : {}),
    },
  },
}));

const getEditableInputMargin = ({
  rowDensity,
}: {
  rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
}): MarginProps['margin'] => {
  if (rowDensity === 'comfortable') {
    return ['spacing.4', 'spacing.4'];
  }

  return 'spacing.2';
};

const _TableEditableCell = ({
  validationState = 'none',
  accessibilityLabel,
  autoCapitalize,
  autoCompleteSuggestionType,
  autoFocus,
  defaultValue,
  isDisabled,
  isRequired,
  keyboardReturnKeyType,
  leadingIcon,
  maxCharacters,
  name,
  onBlur,
  onChange,
  onClick,
  onFocus,
  onSubmit,
  placeholder,
  prefix,
  suffix,
  value,
  testID,
  trailingButton,
  errorText,
  successText,
}: TableEditableCellProps): React.ReactElement => {
  const { rowDensity, showStripedRows, backgroundColor } = useTableContext();

  return (
    <StyledEditableCell
      role="cell"
      $backgroundColor={backgroundColor}
      $rowDensity={rowDensity}
      {...metaAttribute({ name: MetaConstants.TableCell })}
    >
      <BaseBox className="cell-wrapper-base" display="flex" alignItems="center" height="100%">
        <CellWrapper
          className="cell-wrapper"
          $rowDensity={rowDensity}
          showStripedRows={showStripedRows}
          display="flex"
          alignItems="center"
          flex={1}
          hasPadding={false}
        >
          <Box margin={getEditableInputMargin({ rowDensity })} width="100%">
            <BaseInput
              isTableInputCell={rowDensityToIsTableInputCellMapping[rowDensity]}
              validationState={validationState}
              id="table-editable-cell-input"
              type="text"
              size={tableEditableCellRowDensityToInputSizeMap[rowDensity]}
              trailingIcon={validationStateToInputTrailingIconMap[validationState]}
              accessibilityLabel={accessibilityLabel}
              autoCapitalize={autoCapitalize}
              autoCompleteSuggestionType={autoCompleteSuggestionType}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocus}
              defaultValue={defaultValue}
              isDisabled={isDisabled}
              isRequired={isRequired}
              keyboardReturnKeyType={keyboardReturnKeyType}
              leadingIcon={leadingIcon}
              maxCharacters={maxCharacters}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              onClick={onClick}
              onFocus={onFocus}
              onSubmit={castWebType(onSubmit)}
              placeholder={placeholder}
              prefix={prefix}
              suffix={suffix}
              value={value}
              testID={testID}
              trailingButton={trailingButton}
              errorText={errorText}
              successText={successText}
              showHintsAsTooltip={true}
            />
          </Box>
        </CellWrapper>
      </BaseBox>
    </StyledEditableCell>
  );
};

const TableEditableDropdownCell = (
  dropdownProps: TableEditableDropdownCellProps,
): React.ReactElement => {
  const { rowDensity, showStripedRows, backgroundColor } = useTableContext();

  return (
    <TableEditableCellContext.Provider value={{ isInsideTableEditableCell: true }}>
      <StyledEditableCell
        role="cell"
        $backgroundColor={backgroundColor}
        $rowDensity={rowDensity}
        {...metaAttribute({ name: MetaConstants.TableCell })}
      >
        <BaseBox
          className="cell-wrapper-base"
          display="flex"
          alignItems="center"
          height="100%"
          width="100%"
        >
          <CellWrapper
            className="cell-wrapper"
            $rowDensity={rowDensity}
            showStripedRows={showStripedRows}
            display="flex"
            alignItems="center"
            flex={1}
            hasPadding={false}
          >
            <Dropdown _width="100%" margin="spacing.2" {...dropdownProps} />
          </CellWrapper>
        </BaseBox>
      </StyledEditableCell>
    </TableEditableCellContext.Provider>
  );
};

const TableEditableCell = assignWithoutSideEffects(_TableEditableCell, {
  componentId: ComponentIds.TableEditableCell,
});

export { TableEditableCell, TableEditableDropdownCell };
