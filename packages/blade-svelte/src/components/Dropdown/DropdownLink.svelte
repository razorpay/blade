<script lang="ts">
  import { getDropdownContext } from './dropdownContext';
  import {
    getActionListContainerRole,
    getActionFromKey,
    getUpdatedIndex,
    ensureScrollVisibility,
    selectOption,
  } from './dropdownUtils';
  import { makeAccessible, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import {
    getBaseLinkClasses,
    getBaseLinkTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import type { DropdownLinkProps } from './types';

  // Reference link template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getBaseLinkTemplateClasses();

  let {
    children,
    icon: Icon,
    iconPosition = 'left',
    onClick,
    onBlur,
    onKeyDown,
    isDisabled = false,
    href,
    target,
    rel,
    accessibilityLabel,
    size = 'medium',
    color = 'primary',
    testID,
    ...rest
  }: DropdownLinkProps = $props();

  const getCtx = getDropdownContext();
  const ctx = $derived(getCtx());

  let linkEl = $state<HTMLButtonElement | HTMLAnchorElement | null>(null);

  // Register this element as the triggerer ref
  $effect(() => {
    ctx.triggererRef.current = linkEl;
    ctx.setDropdownTriggerer('DropdownLink');
  });

  const a11y = $derived(
    makeAccessible({
      label: accessibilityLabel,
      hasPopup: getActionListContainerRole(ctx.hasFooterAction, 'DropdownLink'),
      expanded: ctx.isOpen,
      controls: `${ctx.dropdownBaseId}-actionlist`,
      activeDescendant:
        ctx.activeIndex >= 0 ? `${ctx.dropdownBaseId}-${ctx.activeIndex}` : undefined,
    }),
  );

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const linkClass = $derived(
    getBaseLinkClasses({
      variant: href ? 'anchor' : 'button',
      size,
      isDisabled,
    }),
  );

  function handleClick(e: MouseEvent): void {
    if (isDisabled) return;
    if (!href) e.preventDefault();
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

{#if href}
  <a
    bind:this={linkEl as HTMLAnchorElement}
    {href}
    {target}
    {rel}
    aria-disabled={isDisabled || undefined}
    data-testid={testID}
    data-blade-component="DropdownLink"
    data-size={size}
    data-color={color}
    {...a11y}
    {...analyticsAttrs}
    onclick={handleClick}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
    class={linkClass}
  >
    {#if Icon && iconPosition === 'left'}
      <!-- svelte-ignore svelte_component_deprecated -->
      <svelte:component this={Icon} />
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
  </a>
{:else}
  <button
    bind:this={linkEl as HTMLButtonElement}
    type="button"
    disabled={isDisabled}
    data-testid={testID}
    data-blade-component="DropdownLink"
    data-size={size}
    data-color={color}
    {...a11y}
    {...analyticsAttrs}
    onclick={handleClick}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
    class={linkClass}
  >
    {#if Icon && iconPosition === 'left'}
      <!-- svelte-ignore svelte_component_deprecated -->
      <svelte:component this={Icon} />
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
{/if}
