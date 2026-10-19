<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { getCardGroup } from '../../runes/card-group/context';
  import { createCardGroupItem } from '../../runes/card-group/item.svelte';
  import CardGroupBody from './CardGroupBody.svelte';
  import CardGroupRow from './CardGroupRow.svelte';
  import {
    resolveCardGroup,
    resolveCardGroupItem,
    type CardGroupItemClick,
    type CardGroupItemContentProps,
    type CardGroupShared,
    type CardGroupItemState,
  } from './styles';

  interface Props extends CardGroupItemContentProps {
    /** The option this item picks: what the list's value holds. */
    value: T;
    /**
     * Refuses picks and skips the keyboard. In a list that owns its rows as
     * data, the list decides what the keyboard skips; this only greys the
     * row.
     * @default false
     */
    isDisabled?: boolean;
    /** What typeahead matches. @default title, else the row's text */
    text?: string;
    /** `negative`: a look may draw the row red (ActionList's). @default 'none' */
    intent?: 'none' | 'negative';
    /** Overrides the `${testID}-${index}` the list hands the control. */
    testID?: string;
    /**
     * The row was pressed — by pointer, or Enter or Space — after the pick,
     * as React's ActionListItem: `name` is the row's value, `value` whether
     * it was selected when pressed.
     */
    onClick?: (click: CardGroupItemClick<T>) => void;
    class?: string;
    /**
     * Custom content in place of the title, description, leading and
     * trailing layout. The row owns the control, the click and the pick
     * look, so this never needs a click target of its own.
     */
    children?: Snippet<[CardGroupItemState]>;
    /**
     * What the row reveals under it: anything, a field the pick needs
     * included. It shows while the row is picked.
     */
    content?: Snippet;
    /**
     * With `content`: whether it shows, in place of following the pick.
     * @default undefined (the pick decides)
     */
    isExpanded?: boolean;
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
    onClick,
    class: className = '',
    children,
    content,
    isExpanded,
    ...rest
  }: Props & AnalyticsAttributes = $props();

  const item = createCardGroupItem<T, CardGroupShared>(
    getCardGroup(),
    {
      value: () => value,
      isDisabled: () => isDisabled,
      text: () => text ?? title,
    }
  );
  const list = $derived(item.list);
  const state = $derived(item.state);
  const layout = resolveCardGroupItem();
  const uid = $props.id();
  const bodyId = `${uid}-body`;
  const isOpen = $derived(isExpanded ?? state.isSelected);
  const parts = $derived(list?.shared.classes.collapsible ?? resolveCardGroup({}).collapsible!);
  const controlTestID = $derived(
    testID ??
      (list?.shared.testID ? `${list.shared.testID}-${state.index}` : undefined)
  );
</script>

{#snippet edge(part: string | Snippet)}
  {#if typeof part === 'string'}{part}{:else}{@render part()}{/if}
{/snippet}

{#snippet rowContent()}
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
          <span class={state.isDisabled ? layout.descriptionDisabled : layout.description}>{description}</span>
        {/if}
      </span>
      {#if trailing}
        <span class={layout.trailing}>{@render edge(trailing)}</span>
      {/if}
    </span>
  {/if}
{/snippet}

{#snippet row()}
{#if list}
  <CardGroupRow
    kind={list.kind}
    name={list.name}
    isSelected={state.isSelected}
    isDisabled={state.isDisabled}
    isInvalid={list.isInvalid}
    isActive={item.isActive}
    isTabStop={item.isTabStop}
    onFocus={item.handleFocus}
    onBlur={list.handleFocusOut}
    onKeyDown={(event) => {
      const wasSelected = state.isSelected;
      list.handleKeyDown(event);
      // Enter and Space picked this row (the list took the key): a press,
      // as a click is — the focused control is always the row it acts on.
      if ((event.key === 'Enter' || event.key === ' ') && event.defaultPrevented) {
        onClick?.({ name: value, value: wasSelected, event });
      }
    }}
    classes={list.shared.classes}
    onToggle={(event) => {
      const wasSelected = state.isSelected;
      const isPicked = item.toggle(event);
      onClick?.({ name: value, value: wasSelected, event: event as MouseEvent });
      return isPicked;
    }}
    analytics={analyticsAttributes(rest)}
    testID={controlTestID}
    attach={item.attach}
    {intent}
  >
    {@render rowContent()}
  </CardGroupRow>
{:else}
  <!-- Outside a CardGroup: the content alone, with nothing to pick. -->
  {@render rowContent()}
{/if}
{/snippet}

{#if content}
  <!-- The row and what it reveals are one row of the group: one wrapper,
       under the group's hairlines and corners. -->
  <div class={parts.root}>
    {@render row()}
    <CardGroupBody id={bodyId} {isOpen} class={parts.body}>{@render content()}</CardGroupBody>
  </div>
{:else}
  {@render row()}
{/if}
