<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import type { IconSource } from '../../runes/icon/source';
  import { useCardHeader } from '../../runes/card/header.svelte';
  import Icon from '../icon/Icon.svelte';
  import { resolveCardHeader, type HeaderClasses } from './styles';

  // Blade's CardHeader (CardHeaderLeading and CardHeaderTrailing as props):
  // the header's anatomy and slots. Open by design — no back button, no
  // close, no drag of its own — and the base the overlays' headers build
  // on: they pass their own `classes`, `start` (a back button), the ids
  // that name their dialog and the drag zone's `attach`. Directly in a Card,
  // its title names the card.
  interface Props extends Partial<AnalyticsAttributes> {
    /** CardHeaderLeading's title: a string or a snippet. */
    title?: string | Snippet;
    /** One muted line under the title. */
    subtitle?: string | Snippet;
    /**
     * Before the title: an icon (CardHeaderIcon), or a snippet with an
     * asset or an avatar.
     */
    prefix?: IconSource | Snippet;
    /** Beside the title: a Counter or a Badge. */
    suffix?: Snippet;
    /** CardHeaderTrailing's visual: a Badge, an Amount, a Link, an IconButton. */
    trailing?: Snippet;
    /** A hairline under the header. @default true */
    showDivider?: boolean;
    /** The whole look, in place of Card's. @default resolveCardHeader({ showDivider }) */
    classes?: HeaderClasses;
    /** First in the row, before the prefix: a back button, say. */
    start?: Snippet;
    /** In place of the title block; it receives the drawn title and subtitle. */
    content?: Snippet<[{ title: Snippet; subtitle: Snippet }]>;
    /** Under the row, inside the header. */
    children?: Snippet;
    /** The title's id, so something is named by it (a dialog). */
    titleId?: string;
    /** The subtitle's id, so something is described by it. */
    subtitleId?: string;
    /** On the root: a drag zone, say. */
    attach?: Attachment<HTMLElement>;
    testID?: string;
    class?: string;
  }

  let {
    title,
    subtitle,
    prefix,
    suffix,
    trailing,
    showDivider = true,
    classes: given,
    start,
    content,
    children,
    titleId,
    subtitleId,
    attach,
    testID,
    class: className = '',
    ...rest
  }: Props = $props();

  const analytics = $derived(analyticsAttributes(rest));

  const card = useCardHeader({
    hasContent: () => Boolean(title || subtitle || prefix || suffix || trailing || content || children),
    hasTitle: () => Boolean(title),
    hasSubtitle: () => Boolean(subtitle),
    isWired: () => Boolean(titleId || subtitleId || given),
  });
  const classes = $derived(given ?? resolveCardHeader({ showDivider }));
  const ids = $derived({
    title: titleId ?? card.titleId,
    subtitle: subtitleId ?? card.subtitleId,
  });
</script>

{#snippet text(slot: string | Snippet, className: string, id?: string)}
  {#if typeof slot === 'string'}
    <p {id} class={className}>{slot}</p>
  {:else}
    <div {id} class={className}>{@render slot()}</div>
  {/if}
{/snippet}

{#snippet titleSlot()}
  {#if title && suffix}
    <div class={classes.titleRow}>
      {@render text(title, classes.title, ids.title)}
      <span class={classes.suffix}>{@render suffix()}</span>
    </div>
  {:else if title}
    {@render text(title, classes.title, ids.title)}
  {:else if suffix}
    <span class={classes.suffix}>{@render suffix()}</span>
  {/if}
{/snippet}

{#snippet subtitleSlot()}
  {#if subtitle}
    {@render text(subtitle, classes.subtitle, ids.subtitle)}
  {/if}
{/snippet}

<div class={cx(classes.root, className)} data-testid={testID} {...analytics} {@attach attach}>
  <div class={classes.row}>
    {#if start}{@render start()}{/if}
    {#if typeof prefix === 'function'}
      <span class={classes.prefix}>{@render prefix()}</span>
    {:else if prefix}
      <span class={classes.prefixIcon}><Icon source={prefix} size="large" /></span>
    {/if}
    <div class={classes.titleBlock}>
      {#if content}
        {@render content({ title: titleSlot, subtitle: subtitleSlot })}
      {:else}
        {@render titleSlot()}
        {@render subtitleSlot()}
      {/if}
    </div>
    {#if trailing}
      <div class={classes.trailing}>{@render trailing()}</div>
    {/if}
  </div>
  {#if children}{@render children()}{/if}
</div>
