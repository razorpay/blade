<script lang="ts">
  import type { Snippet } from 'svelte';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import { useModalHeader } from '../../runes/modal/header.svelte';
  import CardHeader from '../card-children/CardHeader.svelte';
  import Icon from '../icon/Icon.svelte';
  import { ChevronLeftIcon } from '../../icons';
  import { resolveBottomSheetHeader } from './styles';

  // Blade's BottomSheetHeader: Blade DSL's Bottom Sheet header (Figma), with
  // a back button (CardHeader's `start`) and content below the row.
  // CardHeader in resolveBottomSheetHeader's look: inside its overlay it is wired to it
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
    /** After the title block: a Badge, text, a Link or an action. */
    trailing?: Snippet;
    /**
     * A back button first in the row, before the leading item and the
     * title: a step back inside the sheet, not a dismissal.
     * @default false
     */
    showBackButton?: boolean;
    onBackButtonClick?: () => void;
    /** The back button's accessible name. @default 'Back' */
    backLabel?: string;
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
    showBackButton = false,
    onBackButtonClick,
    backLabel = 'Back',
    children,
    testID,
    class: className = '',
    ...rest
  }: Props = $props();

  const analytics = $derived(analyticsAttributes(rest));

  const hasContent = $derived(Boolean(title || subtitle || leading || titleSuffix || trailing || showBackButton || children));
  const wiring = useModalHeader({
    hasContent: () => hasContent,
    hasTitle: () => Boolean(title),
    hasSubtitle: () => Boolean(subtitle),
  });
  // The look, with room for the overlay's close button while it shows.
  const classes = $derived.by(() => {
    const own = resolveBottomSheetHeader({ hasHandle: wiring.hasHandle ?? true });
    return wiring.hasClose ? { ...own, row: cx(own.row, own.closeClearance) } : own;
  });
</script>

{#snippet backButton()}
  <button type="button" class={classes.back} aria-label={backLabel} onclick={() => onBackButtonClick?.()}>
    <Icon source={ChevronLeftIcon} size="large" />
  </button>
{/snippet}

{#if hasContent}
  <CardHeader
    {classes}
    {title}
    {subtitle}
    prefix={leading}
    suffix={titleSuffix}
    {trailing}
    titleId={wiring.titleId}
    subtitleId={wiring.subtitleId}
    attach={wiring.dragZone?.attach}
    class={cx(wiring.dragZone?.className, className)}
    {testID}
    {...analytics}
    start={showBackButton ? backButton : undefined}
    {children}
  />
{/if}
