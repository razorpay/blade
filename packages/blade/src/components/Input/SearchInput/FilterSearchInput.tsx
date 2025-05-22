import React from 'react';
import type { BaseSearchInputProps } from './BaseSearchInput';
import { BaseSearchInput } from './BaseSearchInput';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

const _FilterSearchInput: React.ForwardRefRenderFunction<BladeElementRef, BaseSearchInputProps> = (
  props,
  ref,
): React.ReactElement => {
  return <BaseSearchInput ref={ref} {...props} isFilterSearchInput />;
};

const FilterSearchInput = assignWithoutSideEffects(_FilterSearchInput, {
  displayName: 'FilterSearchInput',
  componentId: dropdownComponentIds.triggers.SearchInput,
});

export type { BaseSearchInputProps as FilterSearchInputProps };
export { FilterSearchInput };
