<script lang="ts">
  import type { Snippet } from 'svelte';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import { useModalHeader } from '../../runes/modal/header.svelte';
  import CardHeader from '../card-children/CardHeader.svelte';
  import type { Intent } from '../shared/intent';
  import { resolveDrawerHeader } from './styles';

  // Blade's DrawerHeader: Blade DSL's _Drawer Header (Figma), with content
  // below the row and an optional tint.
  // CardHeader in resolveDrawerHeader's look: inside its overlay it is wired to it
  // (the title names the overlay, the row leaves room for the close button,
  // a draggable surface drags by it). With nothing to draw it is no header,
  // and the overlay keeps its empty one.
  interface Props extends Partial<AnalyticsAttributes> {
    /** The overlay's name: a string or a snippet. */
    title?: string | Snippet;
    /** One muted line under the title; it describes the overlay. */
    subtitle?: string;
    /**
     * Before the title, 8px from it: an icon (a 20px glyph on the title's
     * first line), or a snippet with an asset or an avatar in a 32px slot.
     */
    leading?: IconSource | Snippet;
    /** Beside the title, 8px from it: a Counter or a Badge. */
    titleSuffix?: Snippet;
    /**
     * After the title block: a Badge, text, a Link or an action. Receives
     * `close`, which closes the overlay without a dismissal.
     */
    trailing?: Snippet<[{ close: () => void }]>;
    /** A feedback colour's subtle fill behind the header. */
    color?: Intent;
    /** A hairline under the header; Figma's _Drawer Header draws none. @default false */
    showDivider?: boolean;
    /** Under the title row, inside the header (a search field, a stepper). */
    children?: Snippet;
    testID?: string;
    class?: string;
  }

  let {
    title,
    subtitle,
    leading,
    titleSuffix,
    trailing,
    color,
    showDivider = false,
    children,
    testID,
    class: className = '',
    ...rest
  }: Props = $props();

  const analytics = $derived(analyticsAttributes(rest));

  const hasContent = $derived(Boolean(title || subtitle || leading || titleSuffix || trailing || children));
  const wiring = useModalHeader({
    hasContent: () => hasContent,
    hasTitle: () => Boolean(title),
    hasSubtitle: () => Boolean(subtitle),
  });
  // The look, with room for the overlay's close button while it shows.
  const classes = $derived.by(() => {
    const own = resolveDrawerHeader({ color, showDivider });
    return wiring.hasClose ? { ...own, row: cx(own.row, own.closeClearance) } : own;
  });
</script>

<!-- The caller's trailing, handed the overlay's close. -->
{#snippet trailingWithClose()}
  {@render trailing?.({ close: wiring.close })}
{/snippet}

{#if hasContent}
  <CardHeader
    {classes}
    {title}
    {subtitle}
    prefix={leading}
    suffix={titleSuffix}
    trailing={trailing ? trailingWithClose : undefined}
    titleId={wiring.titleId}
    subtitleId={wiring.subtitleId}
    attach={wiring.dragZone?.attach}
    class={cx(wiring.dragZone?.className, className)}
    {testID}
    {...analytics}
    {children}
  />
{/if}
