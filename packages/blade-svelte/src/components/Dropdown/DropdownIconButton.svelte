<script lang="ts">
  import { getDropdownContext } from './dropdownContext';
  import {
    getActionListContainerRole,
    getActionFromKey,
    getUpdatedIndex,
    ensureScrollVisiblity,
  } from './dropdownUtils';
  import { makeAccessible } from '@razorpay/blade-core/utils';
  import type { DropdownIconButtonProps } from './types';

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
            selectOption(activeIndex);
            ctx.triggererRef.current?.focus();
          }
          break;
        case 'First':
          ctx.setIsOpen(true);
          // fallthrough intentional
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
  class="blade-dropdown-icon-button blade-dropdown-icon-button--{size} blade-dropdown-icon-button--{emphasis}"
>
  {#if Icon}
    <!-- svelte-ignore svelte_component_deprecated -->
    <svelte:component this={Icon} />
  {/if}
</button>
