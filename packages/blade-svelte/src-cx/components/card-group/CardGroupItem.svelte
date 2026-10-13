<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createCardGroupItem,
    type CardGroupValue,
  } from '../../runes/card-group/card-group.svelte';
  import { getCardGroup } from '../../runes/card-group/context';
  import Icon from '../icon/Icon.svelte';
  import CollapsePanel from '../shared/CollapsePanel.svelte';
  import {
    resolveCardGroup,
    type CardGroupItemState,
    type CardGroupShared,
  } from './styles';

  type Slot = Snippet<[CardGroupItemState]>;

  interface Props {
    /**
     * The item's identity in the CardGroup's `value`.
     * @default its index among the items
     */
    value?: CardGroupValue;
    /** The title in Figma's medium weight, sized by the CardGroup; a snippet sizes its own. */
    title?: string | Slot;
    /** The small muted line under the title. */
    subtitle?: string | Slot;
    /** Ahead of the title, capped at 32px (24px at medium); the number prefix wins. */
    leading?: Slot;
    /**
     * Replaces the chevron: a status glyph, a loading placeholder, a badge.
     * It owns its look, turning included.
     */
    trailing?: Slot;
    /**
     * The header's content between `leading` and `trailing`, around the
     * drawn title and subtitle: it receives them as snippets (`title`,
     * `subtitle`; each renders nothing when its prop is unset) beside the
     * item state, and places them with anything else — as Modal's
     * `header`. Without it the two render on their own. Inside the header
     * button: phrasing content only, nothing interactive.
     */
    header?: Snippet<[CardGroupItemState & { title: Snippet; subtitle: Snippet }]>;
    /** The body, in Figma's body box (16px above and in, 16px below; 12px at medium). Ignored when `children` is given. */
    body?: Slot;
    /** A custom body at full width, with no padding or background of the card group's own; wins over `body`. */
    children?: Slot;
    /** @default false */
    isDisabled?: boolean;
    /**
     * Every header press, before anything changes. Return `false` to veto
     * the expand. An item with no `body` or `children` never expands: the
     * press is all it does, and it draws a chevron pointing right.
     */
    onClick?: (event: MouseEvent) => boolean | void;
    /** Overrides the `${testID}-${index}` the CardGroup hands the header. */
    testID?: string;
  }

  let {
    value,
    title,
    subtitle,
    leading,
    trailing,
    header,
    body,
    children,
    isDisabled = false,
    onClick,
    testID,
  }: Props = $props();

  const uid = $props.id();
  const item = createCardGroupItem<CardGroupShared>(getCardGroup(), {
    id: uid,
    value: () => value,
    isDisabled: () => isDisabled,
    hasBody: () => Boolean(body || children),
    onClick,
  });

  // Outside a CardGroup the item still draws, in the defaults.
  const shared = $derived(
    item.shared ?? {
      classes: resolveCardGroup({}),
      size: 'large' as const,
      showNumberPrefix: false,
      scrollOnExpand: true,
      testID: undefined,
    }
  );
  const classes = $derived(shared.classes);
  const state: CardGroupItemState = $derived({
    ...item.state,
    size: shared.size,
    collapse: item.collapse,
  });
  const kind = $derived(
    state.isActionable ? 'go' : state.isExpanded ? 'expanded' : 'collapsed'
  );
  const prefixed = $derived(shared.showNumberPrefix);
  const headerTestID = $derived(
    testID ?? (shared.testID ? `${shared.testID}-${state.index}` : undefined)
  );
</script>

{#snippet text(slot: string | Slot, className: string)}
  <span class={className}>
    {#if typeof slot === 'string'}
      {slot}
    {:else}
      {@render slot(state)}
    {/if}
  </span>
{/snippet}

<!-- The drawn title and subtitle: on their own, or handed to `header`. -->
{#snippet titleSlot()}
  {#if title}
    {@render text(title, classes.title)}
  {/if}
{/snippet}

{#snippet subtitleSlot()}
  {#if subtitle}
    {@render text(subtitle, classes.subtitle)}
  {/if}
{/snippet}

<div class={classes.item}>
  <div role="heading" aria-level={3} class={classes.heading}>
    <button
      type="button"
      id={item.headerId}
      class={cx(
        classes.header,
        classes.headerState[state.isExpanded ? 'expanded' : 'collapsed']
      )}
      disabled={state.isDisabled}
      aria-expanded={state.isActionable
        ? undefined
        : state.isExpanded
          ? 'true'
          : 'false'}
      aria-controls={state.isExpanded ? item.panelId : undefined}
      data-testid={headerTestID}
      onclick={item.handleClick}
      onkeydown={item.handleKeyDown}
      {@attach item.attach}
    >
      <span
        class={cx(
          classes.headerRow,
          classes.headerRowAlign[
            prefixed || leading || subtitle || (header && title) ? 'start' : 'center'
          ]
        )}
      >
        {#if prefixed}
          <span class={classes.prefix}>{state.index + 1}.</span>
        {:else if leading}
          <span class={classes.leading}>{@render leading(state)}</span>
        {/if}
        <span class={classes.headerContent}>
          {#if header}
            {@render header({ ...state, title: titleSlot, subtitle: subtitleSlot })}
          {:else}
            {@render titleSlot()}
            {@render subtitleSlot()}
          {/if}
        </span>
        <span
          class={cx(
            classes.trailing,
            !trailing &&
              classes.trailingTone[state.isExpanded ? 'expanded' : 'collapsed']
          )}
        >
          {#if trailing}
            {@render trailing(state)}
          {:else}
            <Icon
              source={classes.chevron}
              size={classes.chevronSize}
              class={classes.chevronState[kind]}
            />
          {/if}
        </span>
      </span>
      {#if state.isExpanded}
        <span class={classes.headerDivider}></span>
      {/if}
    </button>
  </div>
  {#if state.isExpanded}
    <CollapsePanel
      id={item.panelId}
      labelledBy={item.headerId}
      duration={classes.slide}
      scrollIntoView={shared.scrollOnExpand}
    >
      {#if children}
        {@render children(state)}
      {:else if body}
        <div class={classes.body}>
          {@render body(state)}
        </div>
      {/if}
    </CollapsePanel>
  {/if}
</div>
