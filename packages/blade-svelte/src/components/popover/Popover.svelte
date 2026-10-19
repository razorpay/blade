<script lang="ts">
  import { CloseIcon } from '../../icons';
  import Icon from '../icon/Icon.svelte';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { createOverlay } from '../../runes/modal/overlay.svelte';
  import { useComponentDefaults } from '../defaults';
  import FloatingPanel from '../layer/FloatingPanel.svelte';
  import OverlayTrigger from '../layer/OverlayTrigger.svelte';
  import OverlaySections from '../modal/OverlaySections.svelte';
  import { resolvePopover, type PopoverBehaviourProps, type PopoverStyleProps } from './styles';

  // Blade's Popover: a non-modal panel by its trigger with an arrow toward
  // it, 16px round, at most 288px wide (328px on desktop). Escape and a
  // press outside dismiss it; the page stays live, with no scrim.
  let {
    isOpen = $bindable(false),
    children: trigger,
    placement = 'top',
    isDisabled = false,
    onOpenChange,
    onDismiss,
    onClosed,
    isDismissible = true,
    chrome,
    closeLabel = 'Close',
    accessibilityLabel,
    initialFocusRef,
    testID,
    class: className = '',
    padding,
    title,
    subtitle,
    leading,
    titleSuffix,
    trailing,
    header,
    body,
    footer,
    content,
    showBackButton,
    onBackButtonClick,
    backLabel,
    // A dialog; `alertdialog` for one that asks to confirm. The rest:
    // analytics attributes.
    role = 'dialog',
    ...rest
  }: PopoverBehaviourProps & PopoverStyleProps = $props();

  const style = useComponentDefaults('Popover', () => ({ padding }));
  const classes = resolvePopover();

  const uid = $props.id();
  const overlay = createOverlay({
    id: uid,
    layout: () => 'popover',
    isOpen: () => isOpen,
    onValue: (next) => {
      if (next !== isOpen) {
        isOpen = next;
        onOpenChange?.({ isOpen: next });
      }
    },
    onDismiss: (event) => onDismiss?.(event),
    isDismissible: () => isDismissible,
    isDisabled: () => isDisabled,
    hasClose: () => isDismissible,
  });
</script>

<OverlayTrigger {overlay} {isOpen} {trigger} />

{#if isOpen && overlay.trigger.anchor}
  <FloatingPanel
    id={overlay.panelId}
    anchor={overlay.trigger.anchor}
    {placement}
    classes={classes.floating}
    {role}
    {accessibilityLabel}
    labelledBy={overlay.labelledBy}
    describedBy={overlay.describedBy}
    isFocusMoved
    {initialFocusRef}
    onOutside={() => overlay.dialog.dismiss('blur')}
    {onClosed}
    {testID}
    analytics={analyticsAttributes(rest)}
    class={className}
  >
    <!-- First, so what it holds (the close button) is early in tab order. -->
    <div class={classes.chrome}>
      {#if overlay.hasClose}
        <button
          type="button"
          class={overlay.hasHeader ? classes.close : classes.floatingClose}
          aria-label={closeLabel}
          onclick={() => overlay.dialog.dismiss('cross')}
        >
          <Icon source={CloseIcon} size="large" />
        </button>
      {/if}
      {@render chrome?.({ close: overlay.close })}
    </div>
    <div class={classes.content}>
      {#if !overlay.hasHeader}<div class={classes.emptyHeader}></div>{/if}
      <OverlaySections
        {title}
        {subtitle}
        {leading}
        {titleSuffix}
        {trailing}
        {header}
        {body}
        {footer}
        children={content}
        {showBackButton}
        {onBackButtonClick}
        {backLabel}
        padding={style.current.padding}
        close={overlay.close}
      />
    </div>
  </FloatingPanel>
{/if}
