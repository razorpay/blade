<script lang="ts">
  import { untrack } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    useId,
  } from '@razorpay/blade-core/utils';
  import {
    dropdownTriggerWrapperClass,
    getDropdownTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { setDropdownContext } from './dropdownContext';
  import { createDropdownController } from './useDropdown';
  import { makeInputValue, makeInputDisplayValue } from './dropdownUtils';

  // Prevent tree-shaking of template classes used in compound selectors.
  void getDropdownTemplateClasses();
  import type { DropdownContextValue, DropdownOption, DropdownProps } from './types';
  import type { DropdownTriggerer } from './dropdownComponentIds';

  let {
    children,
    isOpen,
    onOpenChange,
    selectionType = 'single',
    _width,
    testID,
    ...rest
  }: DropdownProps = $props();

  // Controllable open state — internal `$state` mirrors the `isOpen` prop when
  // uncontrolled; `onOpenChange` fires on every change (mirrors React
  // `useControllableState`).
  let internalOpen = $state(false);
  const isControlled = $derived(isOpen !== undefined);
  const openState = $derived(isControlled ? (isOpen as boolean) : internalOpen);

  function setIsOpen(next: boolean): void {
    if (next === openState) return;
    if (!isControlled) {
      internalOpen = next;
    }
    onOpenChange?.(next);
  }

  function close(): void {
    setIsOpen(false);
  }

  // Option registry — populated by ActionListItem on mount (append = visual
  // order). Reorder-safe: items read their index via `getOptionIndex(id)`.
  let options = $state<DropdownOption[]>([]);
  let selectedIndices = $state<number[]>([]);
  let activeIndex = $state(-1);
  let filteredValues = $state<string[]>([]);
  let hasFooterAction = $state(false);
  let hasAutoCompleteInHeader = $state(false);
  let isKeydownPressed = $state(false);
  let dropdownTriggerer = $state<DropdownTriggerer>(undefined);

  let triggererEl = $state<HTMLElement | null>(null);
  let triggererWrapperEl = $state<HTMLElement | null>(null);
  let actionListContainerEl = $state<HTMLElement | null>(null);

  const dropdownBaseId = useId('dropdown');

  // `registerOption`/`unregisterOption` both read AND write `options`. They are
  // called from `ActionListItem`'s registration `$effect`, so the reads must be
  // untracked — otherwise the calling effect subscribes to `options`, and each
  // (un)registration re-triggers every item's effect → reactive update loop
  // (`effect_update_depth_exceeded`).
  function registerOption(option: DropdownOption): void {
    untrack(() => {
      const existing = options.findIndex((o) => o.id === option.id);
      if (existing >= 0) {
        options[existing] = option;
      } else {
        options = [...options, option];
      }
    });
  }

  function unregisterOption(id: string): void {
    untrack(() => {
      options = options.filter((o) => o.id !== id);
      selectedIndices = selectedIndices.filter((i) => i < options.length);
    });
  }

  function getOptionIndex(id: string): number {
    return options.findIndex((o) => o.id === id);
  }

  const value = $derived(makeInputValue(selectedIndices, options));
  const displayValue = $derived(makeInputDisplayValue(selectedIndices, options));

  const controller = createDropdownController({
    getIsOpen: () => openState,
    setIsOpen,
    close,
    getSelectionType: () => selectionType,
    getOptions: () => options,
    getSelectedIndices: () => selectedIndices,
    setSelectedIndices: (indices) => {
      selectedIndices = indices;
    },
    getActiveIndex: () => activeIndex,
    setActiveIndex: (index) => {
      activeIndex = index;
    },
    getFilteredValues: () => filteredValues,
    getDropdownTriggerer: () => dropdownTriggerer,
    getActionListContainerEl: () => actionListContainerEl,
    getTriggererEl: () => triggererEl,
    getHasFooterAction: () => hasFooterAction,
    getIsKeydownPressed: () => isKeydownPressed,
    setIsKeydownPressed: (v) => {
      isKeydownPressed = v;
    },
  });

  const contextValue: DropdownContextValue = {
    get isOpen() {
      return openState;
    },
    setIsOpen,
    close,
    get selectionType() {
      return selectionType;
    },
    get selectedIndices() {
      return selectedIndices;
    },
    setSelectedValues: (values) => {
      const indices = values
        .map((v) => options.findIndex((o) => o.value === v))
        .filter((i) => i >= 0);
      selectedIndices = indices;
      if (indices.length > 0) {
        activeIndex = indices[indices.length - 1];
      }
    },
    get activeIndex() {
      return activeIndex;
    },
    get filteredValues() {
      return filteredValues;
    },
    get options() {
      return options;
    },
    get hasFooterAction() {
      return hasFooterAction;
    },
    setHasFooterAction: (v) => {
      hasFooterAction = v;
    },
    get hasAutoCompleteInHeader() {
      return hasAutoCompleteInHeader;
    },
    setHasAutoCompleteInHeader: (v) => {
      hasAutoCompleteInHeader = v;
    },
    dropdownBaseId,
    get dropdownTriggerer() {
      return dropdownTriggerer;
    },
    setDropdownTriggerer: (t) => {
      dropdownTriggerer = t;
    },
    get value() {
      return value;
    },
    get displayValue() {
      return displayValue;
    },
    registerOption,
    unregisterOption,
    getOptionIndex,
    onOptionClick: controller.onOptionClick,
    onTriggerClick: controller.onTriggerClick,
    onTriggerKeydown: controller.onTriggerKeydown,
    get triggererEl() {
      return triggererEl;
    },
    setTriggererEl: (el) => {
      triggererEl = el;
    },
    get triggererWrapperEl() {
      return triggererWrapperEl;
    },
    get actionListContainerEl() {
      return actionListContainerEl;
    },
    setActionListContainerEl: (el) => {
      actionListContainerEl = el;
    },
  };
  setDropdownContext(() => contextValue);

  // Dismiss on outside pointerdown / Escape while open (mirrors React
  // `useDismiss`). Both the trigger wrapper and the portaled overlay are tagged
  // with `data-dropdown-id` so a click on either counts as "inside".
  $effect(() => {
    if (!openState) return;

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(`[data-dropdown-id="${dropdownBaseId}"]`)) {
        return;
      }
      close();
    };
    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeydown, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeydown, true);
    };
  });

  const styledProps = $derived(getStyledPropsClasses(rest));
  const styledClassString = $derived((styledProps.classes || []).filter(Boolean).join(' ') || undefined);
  const containerStyle = $derived(
    [
      _width ? `width:${_width}` : undefined,
      ...Object.entries(styledProps.inlineStyles || {}).map(([k, v]) => `${k}:${v}`),
    ]
      .filter(Boolean)
      .join(';') || undefined,
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.Dropdown, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={styledClassString}
  style={containerStyle}
  data-dropdown-id={dropdownBaseId}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={triggererWrapperEl}
    class={dropdownTriggerWrapperClass}
    onkeydown={(event) => contextValue.onTriggerKeydown({ event })}
  >
    {@render children()}
  </div>
</div>
