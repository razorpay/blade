<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createAccordionItem,
    type AccordionValue,
  } from '../../runes/accordion/accordion.svelte';
  import { getAccordion } from '../../runes/accordion/context';
  import Icon from '../icon/Icon.svelte';
  import AccordionPanel from './AccordionPanel.svelte';
  import {
    resolveAccordion,
    type AccordionItemState,
    type AccordionShared,
  } from './styles';

  type Slot = Snippet<[AccordionItemState]>;

  interface Props {
    /**
     * The item's identity in the Accordion's `value`.
     * @default its index among the items
     */
    value?: AccordionValue;
    /** Blade's semibold title, sized by the Accordion; a snippet sizes its own. */
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
     * Replaces the title block (leading, title, subtitle). Inside the header
     * button: phrasing content only, nothing interactive.
     */
    header?: Slot;
    /** The body, in Blade's body box (12px above, 16px in and below). Wins over `children`. */
    content?: Slot;
    /** A custom body at full width, with no padding or background of the accordion's own. */
    children?: Slot;
    /** @default false */
    isDisabled?: boolean;
    /**
     * Every header press, before anything changes. Return `false` to veto
     * the expand. An item with no `content` or `children` never expands: the
     * press is all it does, and it draws a chevron pointing right.
     */
    onClick?: (event: MouseEvent) => boolean | void;
    /** Overrides the `${testID}-${index}` the Accordion hands the header. */
    testID?: string;
  }

  let {
    value,
    title,
    subtitle,
    leading,
    trailing,
    header,
    content,
    children,
    isDisabled = false,
    onClick,
    testID,
  }: Props = $props();

  const uid = $props.id();
  const item = createAccordionItem<AccordionShared>(getAccordion(), {
    id: uid,
    value: () => value,
    isDisabled: () => isDisabled,
    hasBody: () => Boolean(content || children),
    onClick,
  });

  // Outside an Accordion the item still draws, in the defaults.
  const shared = $derived(
    item.shared ?? {
      classes: resolveAccordion({}),
      size: 'large' as const,
      showNumberPrefix: false,
      scrollOnExpand: true,
      testID: undefined,
    }
  );
  const classes = $derived(shared.classes);
  const state: AccordionItemState = $derived({
    ...item.state,
    size: shared.size,
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
            prefixed || leading || subtitle ? 'start' : 'center'
          ]
        )}
      >
        {#if prefixed}
          <span class={classes.prefix}>{state.index + 1}.</span>
        {:else if leading && !header}
          <span class={classes.leading}>{@render leading(state)}</span>
        {/if}
        <span class={classes.headerContent}>
          {#if header}
            {@render header(state)}
          {:else}
            {#if title}
              {@render text(title, classes.title)}
            {/if}
            {#if subtitle}
              {@render text(subtitle, classes.subtitle)}
            {/if}
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
              size="large"
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
    <AccordionPanel
      id={item.panelId}
      labelledBy={item.headerId}
      duration={classes.slide}
      scrollIntoView={shared.scrollOnExpand}
    >
      {#if content}
        <div class={classes.body}>
          {@render content(state)}
        </div>
      {:else if children}
        {@render children(state)}
      {/if}
    </AccordionPanel>
  {/if}
</div>
