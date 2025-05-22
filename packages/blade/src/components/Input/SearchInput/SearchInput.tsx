import React from 'react';
import type { BaseSearchInputProps } from './BaseSearchInput';
import { BaseSearchInput } from './BaseSearchInput';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const SearchInput = assignWithoutSideEffects(React.forwardRef(BaseSearchInput), {
  displayName: 'SearchInput',
  componentId: dropdownComponentIds.triggers.SearchInput,
});

export type { BaseSearchInputProps as SearchInputProps };
export { SearchInput };
