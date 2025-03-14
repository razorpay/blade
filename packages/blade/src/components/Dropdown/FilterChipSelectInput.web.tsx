/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React, { useEffect } from 'react';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
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

  const { selectedFilters, setSelectedFilters } = useListViewFilterContext();

  useEffect(() => {
    if (isUnControlled) {
      setHasUnControlledFilterChipSelectInput(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnControlled]);

  const getValuesArrayFromIndices = (): string[] => {
    let indices: number[] = [];
    if (isControlled) {
      indices = controlledValueIndices;
    } else {
      indices = selectedIndices;
    }

    return indices.map((selectionIndex) => options[selectionIndex].value);
  };

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

    if (isUnControlled) {
      setUncontrolledInputValue([]);
      setSelectedIndices([]);
    }
    setSelectedFilters((prev) => {
      return prev.filter((filter) => filter !== label);
    });
  };

  useEffect(() => {
    if (selectedFilters.length === 0) {
      handleClearButtonClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters.length]);

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
    const isValueEmpty = Array.isArray(value) ? value.length === 0 : !value;
    if (!isFirstRender && !isValueEmpty) {
      setSelectedFilters((prev) => {
        if (!prev.includes(label)) {
          return [...prev, label];
        }
        return prev;
      });
    } else if (!isFirstRender && isValueEmpty) {
      setSelectedFilters((prev) => {
        return prev.filter((filter) => filter !== label);
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
