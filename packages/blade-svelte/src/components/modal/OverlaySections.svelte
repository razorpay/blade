<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { ChevronLeftIcon } from '../../icons';
  import { getOverlay } from '../../runes/layer/overlay';
  import { useModalHeader } from '../../runes/modal/header.svelte';
  import CardHeader from '../card-children/CardHeader.svelte';
  import Icon from '../icon/Icon.svelte';
  import {
    resolveMenuBody,
    resolvePopoverBody,
    resolvePopoverFooter,
    resolvePopoverHeader,
  } from '../modal-children/styles';
  import type { OverlaySectionsProps } from './sections';

  // The content of Popover and Menu, which take it as props and snippets:
  // the header on CardHeader in Popover's look, the body (Menu's, around its
  // rows) and the footer. Internal: Modal, BottomSheet and Drawer compose
  // their parts instead, and do not load it.

  let {
    title,
    subtitle,
    leading,
    titleSuffix,
    trailing,
    header,
    body,
    footer,
    children,
    showBackButton = false,
    onBackButtonClick,
    backLabel = 'Back',
    padding = 'default',
    close,
  }: OverlaySectionsProps & { close: () => void } = $props();

  const isMenu = getOverlay()?.layout === 'menu';
  const hasContent = $derived(
    Boolean(title || subtitle || header || leading || titleSuffix || trailing || showBackButton)
  );
  const wiring = useModalHeader({
    hasContent: () => hasContent,
    hasTitle: () => Boolean(title),
    hasSubtitle: () => Boolean(subtitle),
  });
  const flush = $derived(padding === 'none');

  const parts = $derived({
    header: resolvePopoverHeader(),
    body:
      isMenu && !flush
        ? resolveMenuBody().root
        : resolvePopoverBody({ padding: flush ? 'spacing.0' : 'spacing.5' }).root,
    footer: resolvePopoverFooter().root,
  });
  const headerClasses = $derived(
    wiring.hasClose ? { ...parts.header, row: cx(parts.header.row, parts.header.closeClearance) } : parts.header
  );
</script>

{#snippet backButton()}
  <button
    type="button"
    class={headerClasses.back}
    aria-label={backLabel}
    onclick={() => onBackButtonClick?.({ close })}
  >
    <Icon source={ChevronLeftIcon} size="large" />
  </button>
{/snippet}

{#snippet trailingSlot()}
  {@render trailing?.({ close })}
{/snippet}

{#snippet contentSlot(drawn: { title: Snippet; subtitle: Snippet })}
  {@render header?.({ ...drawn, close })}
{/snippet}

{#if hasContent}
  <CardHeader
    classes={headerClasses}
    {title}
    {subtitle}
    prefix={leading}
    suffix={titleSuffix}
    trailing={trailing ? trailingSlot : undefined}
    start={showBackButton ? backButton : undefined}
    content={header ? contentSlot : undefined}
    titleId={wiring.titleId}
    subtitleId={wiring.subtitleId}
  />
{/if}
{#if children}
  {@render children({ close })}
{:else if body}
  <div class={parts.body}>{@render body({ close })}</div>
{/if}
{#if footer}
  <div class={parts.footer}>{@render footer({ close })}</div>
{/if}
