<script lang="ts">
  import { getDropdownContext } from './dropdownContext';
  import {
    getActionListContainerRole,
    getActionFromKey,
    getUpdatedIndex,
    ensureScrollVisibility,
    selectOption,
  } from './dropdownUtils';
  import { makeAccessible } from '@razorpay/blade-core/utils';
  import {
    getIconButtonClasses,
    getIconButtonTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import type { DropdownIconButtonProps } from './types';

  // Reference icon button template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getIconButtonTemplateClasses();

  let {
    icon: Icon,
    isDisabled = false,
    onClick,
    onBlur,
    onKeyDown,
    size = 'medium',
    accessibilityLabel,
    emphasis = 'intense',
    testID,
  }: DropdownIconButtonProps = $props();

  const getCtx = getDropdownContext();
  const ctx = $derived(getCtx());

  let buttonEl = $state<HTMLButtonElement | null>(null);

  // Register this element as the triggerer ref
  $effect(() => {
    ctx.triggererRef.current = buttonEl;
    ctx.setDropdownTriggerer('DropdownIconButton');
  });

  const a11y = $derived(
    makeAccessible({
      label: accessibilityLabel,
      hasPopup: getActionListContainerRole(ctx.hasFooterAction, 'DropdownIconButton'),
      expanded: ctx.isOpen,
      controls: `${ctx.dropdownBaseId}-actionlist`,
      activeDescendant:
        ctx.activeIndex >= 0 ? `${ctx.dropdownBaseId}-${ctx.activeIndex}` : undefined,
    }),
  );

  const iconButtonClass = $derived(
    getIconButtonClasses({
      emphasis,
      size,
      isHighlighted: false,
    }),
  );

  function handleClick(e: MouseEvent): void {
    if (isDisabled) return;
    if (ctx.isOpen) {
      ctx.close();
    } else {
      ctx.setIsOpen(true);
    }
    onClick?.(e);
  }

  function handleBlur(e: FocusEvent): void {
    onBlur?.(e);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (isDisabled) return;

    if (!ctx.isKeydownPressed && ![' ', 'Enter', 'Escape', 'Meta'].includes(e.key)) {
      ctx.setIsKeydownPressed(true);
    }

    const actionType = getActionFromKey(e, ctx.isOpen, ctx.dropdownTriggerer);
    if (actionType) {
      const options = ctx.options;
      const activeIndex = ctx.activeIndex;

      switch (actionType) {
        case 'Open':
          e.preventDefault();
          ctx.setIsOpen(true);
          break;
        case 'Close':
          e.preventDefault();
          ctx.close();
          break;
        case 'CloseSelect':
          e.preventDefault();
          if (activeIndex >= 0) {
            selectOption(activeIndex, ctx);
            ctx.triggererRef.current?.focus();
          }
          break;
        case 'First':
        case 'Next':
        case 'Previous':
        case 'PageUp':
        case 'PageDown':
        case 'Last': {
          if (actionType === 'First') ctx.setIsOpen(true);
          e.preventDefault();
          const updated = getUpdatedIndex({
            currentIndex: activeIndex,
            maxIndex: options.length - 1,
            actionType,
          });
          ctx.setActiveIndex(updated);
          ensureScrollVisibility(
            updated,
            ctx.actionListItemRef.current,
            options.map((o) => o.value),
          );
          break;
        }
        case 'Type':
          ctx.setIsOpen(true);
          break;
      }
    }

    onKeyDown?.(e);
  }
</script>

<button
  bind:this={buttonEl}
  type="button"
  disabled={isDisabled}
  data-testid={testID}
  data-blade-component="DropdownIconButton"
  data-emphasis={emphasis}
  data-size={size}
  {...a11y}
  onclick={handleClick}
  onblur={handleBlur}
  onkeydown={handleKeyDown}
  class={iconButtonClass}
>
  {#if Icon}
    <!-- svelte-ignore svelte_component_deprecated -->
    <svelte:component this={Icon} />
  {/if}
</button>
