/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React, { useEffect } from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import { useFilterChipGroupContext } from './FilterChipGroupContext.web';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { BaseFilterChip } from '~components/FilterChip/BaseFilterChip';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import type { BaseFilterChipProps } from '~components/FilterChip/types';
import type { DataAnalyticsAttribute } from '~utils/types';
import { useId } from '~utils/useId';
import { useListViewFilterContext } from '~components/ListView/ListViewFiltersContext.web';
import { useFirstRender } from '~utils/useFirstRender';

type FilterChipSelectInputProps = Pick<
  BaseFilterChipProps,
  'onKeyDown' | 'value' | 'label' | 'testID' | 'onClick' | 'selectionType' | 'onBlur'
> & {
  accessibilityLabel?: string;
  onChange?: (props: { name: string; values: string[] }) => void;
  name?: string;
  onClearButtonClick?: (props: { name: string; values: string[] }) => void;
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
    setHasUnControlledFilterChipSelectInput,
    setSelectedIndices,
    controlledValueIndices,
    changeCallbackTriggerer,
  } = useDropdown();

  const isUnControlled = options.length > 0 && props.value === undefined;
  // Currently we are having 2 context for selectedFilters. One is for FilterChipGroup and other is for  ListView
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

    return indices.map((selectionIndex) => options[selectionIndex].value);
  };

  useEffect(() => {
    if (isUnControlled) {
      setHasUnControlledFilterChipSelectInput(true);
      if (listViewSelectedFilters[label]) {
        const value = (listViewSelectedFilters[label] as unknown) as number[];
        setSelectedIndices(value);
        const inputValue = value.map((selectionIndex) => options[selectionIndex].value);
        setUncontrolledInputValue(inputValue);
        setFilterChipGroupSelectedFilters((prev) =>
          prev.includes(label) ? prev : [...prev, label],
        );
      }
    } else if (listViewSelectedFilters[label]) {
      const value = (listViewSelectedFilters[label] as unknown) as number[];
      setSelectedIndices(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnControlled]);

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
    return uncontrolledInputValue;
  };

  const handleClearButtonClick = (): void => {
    props.onClearButtonClick?.({ name: name ?? idBase, values: getValuesArrayFromIndices() });
    props.onChange?.({ name: name ?? idBase, values: [] });
    if (isUnControlled) {
      setUncontrolledInputValue([]);
      setSelectedIndices([]);
    }
    setFilterChipGroupSelectedFilters((prev) => prev.filter((filter) => filter !== label));
    setListViewSelectedFilters((prev) => {
      const { [label]: _, ...updatedFilters } = prev;
      return updatedFilters;
    });
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

  return (
    <BaseFilterChip
      label={label}
      value={value ?? getUnControlledFilterChipValue()}
      onClearButtonClick={handleClearButtonClick}
      selectionType={selectionType}
      {...rest}
      ref={triggererRef as any}
      accessibilityProps={{
        label: accessibilityLabel ?? label,
        hasPopup: getActionListContainerRole(hasFooterAction, 'FilterChipSelectInput'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
      }}
      onClick={(e) => {
        onTriggerClick();
        // Setting it for web fails it on native typecheck and vice versa
        onClick?.(e as any);
      }}
      onBlur={(e) => {
        // With button trigger, there is no "value" as such. It's just clickable items
        // Setting it for web fails it on native typecheck and vice versa
        onBlur?.(e as any);
      }}
      onKeyDown={(e) => {
        onTriggerKeydown?.({ event: e as any });
        // Setting it for web fails it on native typecheck and vice versa
        onKeyDown?.(e as any);
      }}
    />
  );
};

const FilterChipSelectInput = assignWithoutSideEffects(_FilterChipSelectInput, {
  componentId: dropdownComponentIds.triggers.FilterChipSelectInput,
});

export { FilterChipSelectInput };
