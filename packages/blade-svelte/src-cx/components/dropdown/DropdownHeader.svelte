<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { SearchIcon } from '../../icons';
  import { getDropdown } from '../../runes/dropdown/context';
  import Icon from '../icon/Icon.svelte';
  import { framedControl } from '../text-input/styles';
  import { resolveDropdown, type DropdownShared } from './styles';

  interface Props {
    title?: string;
    subtitle?: string;
    /** After the title: an IconButton, a Badge. */
    trailing?: Snippet;
    /** A search field under the title: typing filters the rows by their title. @default false */
    hasSearch?: boolean;
    /** @default 'Search' */
    searchPlaceholder?: string;
    testID?: string;
  }

  let {
    title,
    subtitle,
    trailing,
    hasSearch = false,
    searchPlaceholder = 'Search',
    testID,
  }: Props = $props();

  const dropdown = getDropdown<unknown, DropdownShared>();
  const classes = $derived(dropdown?.shared.classes ?? resolveDropdown({}));
  const noop = (): void => undefined;
</script>

<div class={classes.header.root} data-testid={testID}>
  {#if title || trailing}
    <div class={classes.header.titleRow}>
      <div class="flex min-w-0 flex-1 flex-col">
        {#if title}<p class={classes.header.title}>{title}</p>{/if}
        {#if subtitle}<p class={classes.header.subtitle}>{subtitle}</p>{/if}
      </div>
      {#if trailing}{@render trailing()}{/if}
    </div>
  {/if}
  {#if hasSearch}
    <!-- The combobox: focus stays here while the arrows move over the rows. -->
    <label class={cx(framedControl('medium'), 'flex cursor-text flex-row items-center gap-2')}>
      <span class="flex shrink-0 items-center text-surface-gray-muted">
        <Icon source={SearchIcon} />
      </span>
      <input
        type="text"
        role="combobox"
        class="min-w-0 flex-1 border-none bg-transparent p-0 font-blade-text text-inherit outline-none placeholder:text-surface-gray-disabled"
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        aria-autocomplete="list"
        aria-expanded="true"
        aria-controls={dropdown?.listId}
        aria-activedescendant={dropdown?.activeId}
        autocomplete="off"
        value={dropdown?.query ?? ''}
        oninput={(event) => dropdown?.setQuery(event.currentTarget.value)}
        {@attach dropdown?.focusOwner ?? noop}
      />
    </label>
  {/if}
</div>
