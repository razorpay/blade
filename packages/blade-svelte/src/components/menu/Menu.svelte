<script lang="ts">
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { createOverlay } from '../../runes/modal/overlay.svelte';
  import FloatingPanel from '../layer/FloatingPanel.svelte';
  import OverlayTrigger from '../layer/OverlayTrigger.svelte';
  import OverlaySections from '../modal/OverlaySections.svelte';
  import { resolveMenu, type MenuBehaviourProps, type MenuStyleProps } from './styles';

  // Blade's Menu look: the panel by its trigger, 12px round, 240 to 400px
  // wide, with no close button; ArrowDown or ArrowUp on the closed trigger
  // opens it. A dialog holding what the app puts in it — an ActionList whose
  // onPick calls the body's close.
  let {
    isOpen = $bindable(false),
    children: trigger,
    placement = 'bottom-start',
    isDisabled = false,
    onOpenChange,
    onDismiss,
    onClosed,
    isDismissible = true,
    chrome,
    accessibilityLabel,
    testID,
    class: className = '',
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
    ...rest
  }: MenuBehaviourProps & MenuStyleProps = $props();

  const classes = resolveMenu();

  const uid = $props.id();
  const overlay = createOverlay({
    id: uid,
    layout: () => 'menu',
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
    hasClose: () => false,
  });
</script>

<OverlayTrigger {overlay} {isOpen} {trigger} />

{#if isOpen && overlay.trigger.anchor}
  <FloatingPanel
    id={overlay.panelId}
    anchor={overlay.trigger.anchor}
    {placement}
    classes={classes.floating}
    role="dialog"
    {accessibilityLabel}
    labelledBy={overlay.labelledBy}
    describedBy={overlay.describedBy}
    isFocusMoved
    onOutside={() => overlay.dialog.dismiss('blur')}
    {onClosed}
    {testID}
    analytics={analyticsAttributes(rest)}
    class={className}
  >
    <!-- First, so what it holds is early in tab order. -->
    <div class={classes.chrome}>
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
        padding="default"
        close={overlay.close}
      />
    </div>
  </FloatingPanel>
{/if}
