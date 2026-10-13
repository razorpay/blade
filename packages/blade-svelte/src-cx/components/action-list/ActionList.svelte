<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { getDropdown } from '../../runes/dropdown/context';
  import type { OptionSearchItem } from '../../runes/option-list/search.svelte';
  import type { FieldChange } from '../shared/change';
  import OptionList from '../option-list/OptionList.svelte';
  import type { OptionListValidationState } from '../option-list/styles';
  import { actionListClasses, type ActionListVariant } from './styles';

  interface Props {
    /** ActionListItems and ActionListSections, and anything between them. */
    children: Snippet;
    /**
     * Standalone only — inside a Dropdown the Dropdown holds the value. The
     * pick, an array with `selectionType="multiple"`; bindable.
     */
    value?: T | readonly T[] | null;
    /**
     * A user pick changed the value; with `selectionType="none"`, a row was
     * pressed (`value` is that row's).
     */
    onChange?: (change: FieldChange<T | readonly T[] | null>) => void;
    /**
     * Standalone. `single`: one pick. `multiple`: rows lead with a checkbox;
     * the value is an array. `none`: rows act and hold nothing — a press
     * reports through `onChange` (a bank list that moves on).
     * @default 'single'
     */
    selectionType?: 'single' | 'multiple' | 'none';
    /**
     * Standalone. `plain`: Dropdown's rows, in no box. `card`: rows divided
     * by hairlines in a bordered box — each ActionListSection its own box,
     * its heading above it.
     * @default 'plain'
     */
    variant?: ActionListVariant;
    /**
     * Standalone. The search: rows whose title does not hold it (ignoring
     * case and outer spaces) are not drawn, and a section left with none
     * steps aside. Bind a SearchInput's value to it.
     */
    query?: string;
    /** Replaces the title match: whether a row passes the `query`. */
    filter?: (item: OptionSearchItem<T>, query: string) => boolean;
    /**
     * Shown in place of the rows while a `query` leaves none, in a status
     * region that announces it.
     */
    empty?: Snippet<[{ query: string }]>;
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

  let { children, value = $bindable(null), variant = 'plain', ...rest }: Props = $props();

  // Inside a Dropdown the rows are its options: the Dropdown owns the
  // listbox, the value and the search, and this is only their group.
  const inDropdown = Boolean(getDropdown());
</script>

{#if inDropdown}
  {@render children()}
{:else}
  <!-- Standalone: OptionList's anatomy and behaviour — the search, the
       sections, the empty state — in ActionList's look. -->
  <OptionList bind:value classes={actionListClasses(variant)} {...rest}>
    {@render children()}
  </OptionList>
{/if}
