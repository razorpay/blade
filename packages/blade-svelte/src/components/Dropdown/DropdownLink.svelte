<script lang="ts">
  import { getDropdownContext } from './dropdownContext';
  import {
    getActionListContainerRole,
    getActionFromKey,
    getUpdatedIndex,
    ensureScrollVisiblity,
  } from './dropdownUtils';
  import { makeAccessible, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import type { DropdownLinkProps } from './types';

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
    testID,
    ...rest
  }: DropdownLinkProps = $props();

  const getCtx = getDropdownContext();
  const ctx = $derived(getCtx());

  let linkEl = $state<HTMLButtonElement | HTMLAnchorElement | null>(null);

  // Register this element as the triggerer ref
  $effect(() => {
    ctx.triggererRef.current = linkEl as HTMLButtonElement | null;
    ctx.setDropdownTriggerer('DropdownLink');
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

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

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
            selectOption(activeIndex);
            ctx.triggererRef.current?.focus();
          }
          break;
        case 'First':
          ctx.setIsOpen(true);
          // fallthrough
        case 'Next':
        case 'Previous':
        case 'PageUp':
        case 'PageDown':
        case 'Last': {
          e.preventDefault();
          const updated = getUpdatedIndex({
            currentIndex: activeIndex,
            maxIndex: options.length - 1,
            actionType,
          });
          ctx.setActiveIndex(updated);
          ensureScrollVisiblity(
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

  function selectOption(index: number): void {
    const { selectedIndices, selectionType, isControlled, changeCallbackTriggerer } = ctx;

    if (selectionType === 'multiple') {
      if (selectedIndices.includes(index)) {
        const existingIdx = selectedIndices.indexOf(index);
        const newIndices = [
          ...selectedIndices.slice(0, existingIdx),
          ...selectedIndices.slice(existingIdx + 1),
        ];
        if (isControlled) ctx.setControlledValueIndices(newIndices);
        else ctx.setSelectedIndices(newIndices);
      } else {
        const newIndices = [...selectedIndices, index];
        if (isControlled) ctx.setControlledValueIndices(newIndices);
        else ctx.setSelectedIndices(newIndices);
      }
    } else {
      if (isControlled) ctx.setControlledValueIndices([index]);
      else ctx.setSelectedIndices([index]);
      ctx.close();
    }

    ctx.setChangeCallbackTriggerer(changeCallbackTriggerer + 1);
    ctx.setActiveIndex(index);
    ctx.options[index]?.onClickTrigger?.(true);
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
    {...a11y}
    {...analyticsAttrs}
    onclick={handleClick}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
    class="blade-dropdown-link blade-dropdown-link--{size}"
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
    {...a11y}
    {...analyticsAttrs}
    onclick={handleClick}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
    class="blade-dropdown-link blade-dropdown-link--{size}"
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
