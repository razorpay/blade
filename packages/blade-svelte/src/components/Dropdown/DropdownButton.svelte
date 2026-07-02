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
    getButtonClasses,
    getButtonTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import type { DropdownButtonProps } from './types';

  // Reference button template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getButtonTemplateClasses();

  let {
    children,
    icon: Icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    onClick,
    onBlur,
    onKeyDown,
    size = 'medium',
    type = 'button',
    variant = 'primary',
    color = 'primary',
    accessibilityLabel,
    testID,
  }: DropdownButtonProps = $props();

  const getCtx = getDropdownContext();
  const ctx = $derived(getCtx());

  let buttonEl = $state<HTMLButtonElement | null>(null);

  // Register this element as the triggerer ref
  $effect(() => {
    ctx.triggererRef.current = buttonEl;
    ctx.setDropdownTriggerer('DropdownButton');
  });

  const a11y = $derived(
    makeAccessible({
      label: accessibilityLabel,
      hasPopup: getActionListContainerRole(ctx.hasFooterAction, 'DropdownButton'),
      expanded: ctx.isOpen,
      controls: `${ctx.dropdownBaseId}-actionlist`,
      activeDescendant:
        ctx.activeIndex >= 0 ? `${ctx.dropdownBaseId}-${ctx.activeIndex}` : undefined,
    }),
  );

  const isIconOnly = $derived(Boolean(Icon) && !children);

  const buttonClass = $derived(
    getButtonClasses({
      variant,
      color,
      size,
      isDisabled: isDisabled || isLoading,
      isFullWidth,
      isIconOnly,
    }),
  );

  function handleClick(e: MouseEvent): void {
    if (isDisabled || isLoading) return;
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
    if (isDisabled || isLoading) return;

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
  {type}
  disabled={isDisabled || isLoading}
  data-testid={testID}
  data-blade-component="DropdownButton"
  {...a11y}
  onclick={handleClick}
  onblur={handleBlur}
  onkeydown={handleKeyDown}
  style={isFullWidth ? 'width:100%' : undefined}
  class={buttonClass}
>
  {#if Icon}
    {#if iconPosition === 'left'}
      <!-- svelte-ignore svelte_component_deprecated -->
      <svelte:component this={Icon} />
    {/if}
  {/if}
  {#if children}
    {#if typeof children === 'string'}
      {children}
    {:else}
      {@render children()}
    {/if}
  {/if}
  {#if Icon && iconPosition === 'right'}
    <!-- svelte-ignore svelte_component_deprecated -->
    <svelte:component this={Icon} />
  {/if}
</button>
