<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { getDropdown } from '../../runes/dropdown/context';
  import type { FieldChange } from '../shared/change';
  import OptionList from '../option-list/OptionList.svelte';
  import type { OptionListValidationState } from '../option-list/styles';
  import { resolveActionList } from './styles';

  interface Props {
    /** ActionListItems and ActionListSections, and anything between them. */
    children: Snippet;
    /**
     * Standalone only — inside a Dropdown the Dropdown holds the value. The
     * pick, an array with `selectionType="multiple"`; bindable.
     */
    value?: T | readonly T[] | null;
    onChange?: (change: FieldChange<T | readonly T[] | null>) => void;
    /** Standalone, `multiple`: rows lead with a checkbox; the value is an array. @default 'single' */
    selectionType?: 'single' | 'multiple';
    /** Standalone, single: picking the pick clears it. @default false */
    isDeselectable?: boolean;
    compare?: (a: T, b: T) => boolean;
    name?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    validationState?: OptionListValidationState;
    label?: string;
    helpText?: string;
    errorText?: string;
    /** Names the list when there is no `label`. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
  }

  let { children, value = $bindable(null), ...rest }: Props = $props();

  // Inside a Dropdown the rows are its options: the Dropdown owns the
  // listbox and the value, and this is only their group.
  const inDropdown = Boolean(getDropdown());
</script>

{#if inDropdown}
  {@render children()}
{:else}
  <!-- Standalone: OptionList's anatomy and behaviour, in ActionList's look. -->
  <OptionList bind:value classes={resolveActionList()} {...rest}>
    {@render children()}
  </OptionList>
{/if}
