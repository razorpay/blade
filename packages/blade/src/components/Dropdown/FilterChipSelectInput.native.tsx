/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React, { useEffect } from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import { useFilterChipGroupContext } from './FilterChipGroupContext';
import type { DataAnalyticsAttribute } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { BaseFilterChip } from '~components/FilterChip/BaseFilterChip';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import type { BaseFilterChipProps } from '~components/FilterChip/types';
import { useId } from '~utils/useId';
import { useListViewFilterContext } from '~components/ListView/ListViewFiltersContext';
import { useFirstRender } from '~utils/useFirstRender';

type FilterChipSelectInputProps = Pick<
  BaseFilterChipProps,
  | 'onKeyDown'
  | 'value'
  | 'label'
  | 'testID'
  | 'onClick'
  | 'selectionType'
  | 'onBlur'
  | 'showClearButton'
> & {
  accessibilityLabel?: string;
  onChange?: (props: { name: string; values: string[] }) => void;
  name?: string;
  onClearButtonClick?: (props: { name: string; values: string[] }) => void;
  isDisabled?: boolean;
} & DataAnalyticsAttribute;

const _FilterChipSelectInput = (props: FilterChipSelectInputProps): React.ReactElement => {
  const idBase = useId('filter-chip-select-input');
  const {
    onClick,
    onBlur,
    onKeyDown,
    accessibilityLabel,
    testID,
    value,
    onClearButtonClick,
    label,
    onChange,
    name,
    isDisabled,
    showClearButton = true,
    ...rest
  } = props;
  const [uncontrolledInputValue, setUncontrolledInputValue] = React.useState<string[]>([]);
  const isFirstRender = useFirstRender();

  const {
    options,
    selectedIndices,
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
    selectionType,
    isControlled,
    setSelectedIndices,
    controlledValueIndices,
    changeCallbackTriggerer,
  } = useDropdown();
  const isUnControlled = options.length > 0 && props.value === undefined;
  const { listViewSelectedFilters, setListViewSelectedFilters } = useListViewFilterContext();
  const {
    clearFilterCallbackTriggerer,
    setFilterChipGroupSelectedFilters,
  } = useFilterChipGroupContext();

  const getValuesArrayFromIndices = (): string[] => {
    let indices: number[] = [];
    if (isControlled) {
      indices = controlledValueIndices;
    } else {
      indices = selectedIndices;
    }

    return indices.map((i) => options[i]?.value).filter((v): v is string => v !== undefined);
  };

  useEffect(() => {
    const valueNotEmpty =
      (typeof value === 'string' && value.trim() !== '') ||
      (Array.isArray(value) && value.length > 0);

    const currentSelectedValues = selectedIndices.map((i) => options[i]?.value);
    const isSingleValueSynced =
      typeof value === 'string' &&
      currentSelectedValues.length === 1 &&
      currentSelectedValues[0] === value;

    const isMultiValueSynced =
      Array.isArray(value) &&
      value.length === currentSelectedValues.length &&
      value.every((v) => currentSelectedValues.includes(v));

    const isValueAndSelectedIndicesSynced = isSingleValueSynced || isMultiValueSynced;

    if (isUnControlled) {
      if (listViewSelectedFilters[label]) {
        const savedIndices = (listViewSelectedFilters[label] as unknown) as number[];
        setSelectedIndices(savedIndices);
        const inputValue = savedIndices
          .map((i) => options[i]?.value)
          .filter((v): v is string => v !== undefined);
        setUncontrolledInputValue(inputValue);
        setFilterChipGroupSelectedFilters((prev) =>
          prev.includes(label) ? prev : [...prev, label],
        );
      } else {
        setSelectedIndices([]);
      }
    } else if (listViewSelectedFilters[label]) {
      const savedIndices = (listViewSelectedFilters[label] as unknown) as number[];
      setSelectedIndices(savedIndices);
    } else if (valueNotEmpty && !isValueAndSelectedIndicesSynced && options.length > 0) {
      const newSelectedIndices =
        typeof value === 'string'
          ? [options.findIndex((option) => option.value === value)]
          : options
              .map((option, index) => (value.includes(option.value) ? index : -1))
              .filter((index) => index !== -1);
      setSelectedIndices(newSelectedIndices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnControlled, options, value]);

  const getTitleFromValue = (value: string): string => {
    const option = options.find((option) => option.value === value);
    return option ? option.title : '';
  };

  const getUnControlledFilterChipValue = (): string | string[] => {
    if (selectionType === 'single') {
      if (uncontrolledInputValue.length > 0) {
        return getTitleFromValue(uncontrolledInputValue[0]);
      }
      return '';
    }
    // For multiple selection, hand the chip the option titles (not the raw values) so it can
    // render the selected option name(s) instead of a bare count.
    return uncontrolledInputValue.map((selectionValue) => getTitleFromValue(selectionValue));
  };

  // Resolves the value shown inside the chip: option titles for display. Controlled consumers
  // pass option value(s); we map them to titles here (falling back to the raw value if the
  // options haven't loaded yet).
  const getFilterChipDisplayValue = (): string | string[] => {
    if (props.value === undefined) {
      return getUnControlledFilterChipValue();
    }
    if (Array.isArray(props.value)) {
      return props.value.map(
        (selectionValue) => getTitleFromValue(selectionValue) || selectionValue,
      );
    }
    return getTitleFromValue(props.value) || props.value;
  };

  const handleClearButtonClick = (): void => {
    const currentValues = getValuesArrayFromIndices();
    onClearButtonClick?.({ name: name ?? idBase, values: currentValues });
    onChange?.({ name: name ?? idBase, values: [] });
    setFilterChipGroupSelectedFilters((prev) => prev.filter((filter) => filter !== label));
    setListViewSelectedFilters((prev) => {
      const { [label]: _, ...updatedFilters } = prev;
      return updatedFilters;
    });
    setUncontrolledInputValue([]);
    setSelectedIndices([]);
  };

  useEffect(() => {
    if (clearFilterCallbackTriggerer) {
      handleClearButtonClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearFilterCallbackTriggerer]);

  useEffect(() => {
    if (!isFirstRender) {
      props.onChange?.({
        name: props.name || idBase,
        values: getValuesArrayFromIndices(),
      });
      if (isUnControlled) {
        setUncontrolledInputValue(getValuesArrayFromIndices());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);

  useEffect(() => {
    const isValueEmpty = selectedIndices.length === 0;
    if (!isFirstRender && !isValueEmpty) {
      setFilterChipGroupSelectedFilters((prev) => (prev.includes(label) ? prev : [...prev, label]));
      setListViewSelectedFilters((prev) => ({
        ...prev,
        [label]: selectedIndices as number[],
      }));
    } else if (!isFirstRender && isValueEmpty) {
      setFilterChipGroupSelectedFilters((prev) => prev.filter((filter) => filter !== label));
      setListViewSelectedFilters((prev) => {
        const { [label]: _, ...updatedFilters } = prev;
        return updatedFilters;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);

  const handleKeyDown = (e: React.KeyboardEvent<Element>): void => {
    onKeyDown?.(e);
    onTriggerKeydown?.({ event: e as React.KeyboardEvent<HTMLInputElement> });

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
    }

    if ((e.key === 'Enter' || e.key === ' ') && !isOpen) {
      e.preventDefault();
      e.stopPropagation();
      onTriggerClick();
    }
  };

  return (
    <BaseFilterChip
      label={label}
      value={getFilterChipDisplayValue()}
      onClearButtonClick={handleClearButtonClick}
      showClearButton={showClearButton}
      selectionType={selectionType}
      {...rest}
      testID={testID}
      ref={triggererRef as any}
      onKeyDown={handleKeyDown}
      accessibilityProps={{
        label: accessibilityLabel ?? label,
        hasPopup: getActionListContainerRole(hasFooterAction, 'FilterChipSelectInput'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      }}
      onClick={(e) => {
        onTriggerClick();
        onClick?.(e);
      }}
      onBlur={(e) => {
        onBlur?.(e);
      }}
      isDisabled={isDisabled}
    />
  );
};

const FilterChipSelectInput = assignWithoutSideEffects(_FilterChipSelectInput, {
  componentId: dropdownComponentIds.triggers.FilterChipSelectInput,
});

export { FilterChipSelectInput };
