<script module lang="ts">
  // Module-level counter ensures each Dropdown instance across the page gets a unique base ID.
  let idCounter = 0;
  function generateId(prefix: string): string {
    return `${prefix}-${++idCounter}`;
  }
</script>

<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import {
    dropdownContainerClass,
    getDropdownTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { setDropdownContext } from './dropdownContext';
  import type { DropdownTriggererType, OptionsType } from './dropdownContext';
  import type { DropdownProps } from './types';

  // Reference template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getDropdownTemplateClasses();

  let {
    children,
    isOpen: isOpenControlled,
    onOpenChange,
    selectionType = 'single',
    testID,
    _width,
  }: DropdownProps = $props();

  // --- Controllable open state ---
  let isOpenInternal = $state(false);
  const isOpen = $derived(isOpenControlled !== undefined ? isOpenControlled : isOpenInternal);

  const setIsOpen = (v: boolean): void => {
    if (isOpenControlled === undefined) {
      isOpenInternal = v;
    }
    onOpenChange?.(v);
  };

  const close = (): void => {
    setActiveTagIndex(-1);
    setIsOpen(false);
  };

  // --- Options state ---
  let options = $state<OptionsType>([]);
  const setOptions = (value: OptionsType): void => {
    options = value;
  };

  // --- Filtered values ---
  let filteredValues = $state<string[]>([]);
  const setFilteredValues = (values: string[]): void => {
    filteredValues = values;
  };

  // --- Selection state ---
  let selectedIndices = $state<number[]>([]);
  const setSelectedIndices = (value: number[]): void => {
    selectedIndices = value;
  };

  let controlledValueIndices = $state<number[]>([]);
  const setControlledValueIndices = (value: number[]): void => {
    controlledValueIndices = value;
  };

  // --- Active index state ---
  let activeIndex = $state(-1);
  const setActiveIndex = (value: number): void => {
    activeIndex = value;
  };

  let activeTagIndex = $state(-1);
  const setActiveTagIndex = (value: number): void => {
    activeTagIndex = value;
  };

  // --- Focus/blur state ---
  let shouldIgnoreBlurAnimation = $state(false);
  const setShouldIgnoreBlurAnimation = (value: boolean): void => {
    shouldIgnoreBlurAnimation = value;
  };

  let isKeydownPressed = $state(false);
  const setIsKeydownPressed = (value: boolean): void => {
    isKeydownPressed = value;
  };

  // --- Footer/header state ---
  let hasFooterAction = $state(false);
  const setHasFooterAction = (value: boolean): void => {
    hasFooterAction = value;
  };

  let hasAutoCompleteInHeader = $state(false);
  const setHasAutoCompleteInHeader = (value: boolean): void => {
    hasAutoCompleteInHeader = value;
  };

  // --- Change callback ---
  let changeCallbackTriggerer = $state(0);
  const setChangeCallbackTriggerer = (value: number): void => {
    changeCallbackTriggerer = value;
  };

  // --- Controlled mode ---
  let isControlled = $state(false);
  const setIsControlled = (value: boolean): void => {
    isControlled = value;
  };

  // --- Triggerer type ---
  let dropdownTriggerer = $state<DropdownTriggererType | undefined>(undefined);
  const setDropdownTriggerer = (triggerer: DropdownTriggererType): void => {
    dropdownTriggerer = triggerer;
  };

  // --- Refs (mutable plain objects mirroring React refs) ---
  const triggererRef: { current: HTMLButtonElement | HTMLAnchorElement | null } = { current: null };
  const headerAutoCompleteRef: { current: HTMLButtonElement | null } = { current: null };
  const triggererWrapperRef: { current: HTMLElement | null } = { current: null };
  const actionListItemRef: { current: HTMLDivElement | null } = { current: null };

  // --- Base ID ---
  const dropdownBaseId = generateId('dropdown');

  // --- Set context using getter-function pattern ---
  setDropdownContext(() => ({
    isOpen,
    setIsOpen,
    close,
    selectedIndices,
    setSelectedIndices,
    controlledValueIndices,
    setControlledValueIndices,
    options,
    setOptions,
    filteredValues,
    setFilteredValues,
    activeIndex,
    setActiveIndex,
    activeTagIndex,
    setActiveTagIndex,
    triggererRef,
    headerAutoCompleteRef,
    triggererWrapperRef,
    actionListItemRef,
    shouldIgnoreBlurAnimation,
    setShouldIgnoreBlurAnimation,
    isKeydownPressed,
    setIsKeydownPressed,
    dropdownBaseId,
    dropdownTriggerer,
    setDropdownTriggerer,
    selectionType,
    hasFooterAction,
    setHasFooterAction,
    hasAutoCompleteInHeader,
    setHasAutoCompleteInHeader,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    setIsControlled,
    // Stub: BottomSheet integration not implemented in Svelte
    dropdownHasBottomSheet: false,
  }));

  const metaAttrs = metaAttribute({ name: MetaConstants.Dropdown, testID });

  const containerStyle = $derived(_width ? `width: ${_width}` : undefined);
</script>

<div
  {...metaAttrs}
  style={containerStyle}
>
  <div class={dropdownContainerClass}>
    {@render children()}
  </div>
</div>
