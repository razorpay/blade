<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { nativeOptionState } from '../../runes/base/option-list';
  import { getOptionList, getOptionRow } from '../../runes/option-list/context';
  import { createOptionItem } from '../../runes/option-list/item.svelte';
  import OptionRow from './OptionRow.svelte';
  import {
    resolveOptionItem,
    type OptionItemContentProps,
    type OptionListShared,
    type OptionState,
  } from './styles';

  interface Props extends OptionItemContentProps {
    /** The option this item picks: what the list's value holds. */
    value: T;
    /**
     * Refuses picks and skips the keyboard. Inside a VirtualOptionList the
     * list's `isOptionDisabled` decides what the keyboard skips; this only
     * greys the row.
     * @default false
     */
    isDisabled?: boolean;
    /** What typeahead matches. @default title, else the row's text */
    text?: string;
    /** `negative`: in the action look, the row is red. @default 'none' */
    intent?: 'none' | 'negative';
    /** Overrides the `${testID}-${index}` the list hands the control. */
    testID?: string;
    class?: string;
    /**
     * Custom content in place of the title, description, leading and
     * trailing layout. The row owns the control, the click and the pick
     * look, so this never needs a click target of its own.
     */
    children?: Snippet<[OptionState]>;
  }

  let {
    value,
    isDisabled = false,
    text,
    title,
    description,
    leading,
    trailing,
    intent = 'none',
    testID,
    class: className = '',
    children,
  }: Props = $props();

  const item = createOptionItem<T, OptionListShared>(
    getOptionList(),
    getOptionRow(),
    {
      value: () => value,
      isDisabled: () => isDisabled,
      text: () => text ?? title,
    }
  );
  const list = $derived(item.list);
  const state = $derived(item.state);
  const layout = resolveOptionItem();
  const controlTestID = $derived(
    testID ??
      (list?.shared.testID ? `${list.shared.testID}-${state.index}` : undefined)
  );
</script>

{#snippet edge(content: string | Snippet)}
  {#if typeof content === 'string'}{content}{:else}{@render content()}{/if}
{/snippet}

{#snippet content()}
  {#if children}
    {@render children(state)}
  {:else}
    <span class={cx(layout.root, className)}>
      {#if leading}
        <span class={layout.leading}>{@render edge(leading)}</span>
      {/if}
      <span class={layout.text}>
        <span class={layout.title}>{title}</span>
        {#if description}
          <span class={layout.description}>{description}</span>
        {/if}
      </span>
      {#if trailing}
        <span class={layout.trailing}>{@render edge(trailing)}</span>
      {/if}
    </span>
  {/if}
{/snippet}

{#if list}
  <OptionRow
    kind={list.kind}
    name={list.name}
    isSelected={state.isSelected}
    isDisabled={state.isDisabled}
    isInvalid={list.isInvalid}
    isActive={item.isActive}
    isTabStop={item.isTabStop}
    onFocus={item.handleFocus}
    onBlur={list.handleFocusOut}
    onKeyDown={list.handleKeyDown}
    classes={list.shared.classes}
    optionState={nativeOptionState(state.isSelected, state.isDisabled)}
    onToggle={item.toggle}
    testID={controlTestID}
    attach={item.attach}
    {intent}
  >
    {@render content()}
  </OptionRow>
{:else}
  <!-- Outside an OptionList: the content alone, with nothing to pick. -->
  {@render content()}
{/if}
