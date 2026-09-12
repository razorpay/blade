<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import { getActionListWrapperClasses, getActionListTemplateClasses } from '@razorpay/blade-core/styles';
  import { getBottomSheetContext } from '../BottomSheet/bottomSheetContext';
  import { getDropdownContext } from '../Dropdown/dropdownContext';
  import { setActionListContext } from './actionListContext';
  import { getActionListContainerRole } from './getA11yRoles';
  import type { ActionListContextValue, ActionListProps } from './types';

  // Call template getter so CVA classes used in compound selectors aren't tree-shaken.
  void getActionListTemplateClasses();

  let {
    children,
    selectionType = 'single',
    selectedValue,
    onAction,
    testID,
    ...rest
  }: ActionListProps = $props();

  // Rendering-context flag, resolved only from the migrated BottomSheet context
  // (not a public prop) — mirrors React's `useBottomSheetContext()`.
  const bs = getBottomSheetContext();
  const isInBottomSheet = $derived(bs?.isInBottomSheet ?? false);

  // Optional Dropdown bridge — undefined for standalone / BottomSheet usage, so
  // that path stays unchanged. When present, the container adopts the Dropdown
  // a11y role + id and exposes its scroll element for keyboard scroll-visibility.
  const dropdown = getDropdownContext();
  const isInsideDropdown = Boolean(dropdown);

  let scrollWrapperEl = $state<HTMLDivElement | null>(null);
  $effect(() => {
    if (!dropdown) return;
    dropdown.setActionListContainerEl(scrollWrapperEl);
    return () => dropdown.setActionListContainerEl(null);
  });

  // Reactive context for child items (getters keep `selectedValue` live).
  const contextValue: ActionListContextValue = {
    get selectionType() {
      return selectionType;
    },
    get selectedValue() {
      return selectedValue;
    },
    get isInBottomSheet() {
      return isInBottomSheet;
    },
    get onAction() {
      return onAction;
    },
    registerItem: () => {},
  };
  setActionListContext(() => contextValue);

  const wrapperClasses = $derived(getActionListWrapperClasses({ isInBottomSheet }));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const styledClassString = $derived((styledProps.classes || []).filter(Boolean).join(' '));
  const styledStyleString = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const isMultiSelectable = $derived(selectionType === 'multiple');

  const containerRole = $derived(
    isInsideDropdown
      ? getActionListContainerRole(
          dropdown?.hasFooterAction ?? false,
          dropdown?.dropdownTriggerer,
          true,
        )
      : getActionListContainerRole(),
  );
  const containerId = $derived(
    isInsideDropdown && dropdown ? `${dropdown.dropdownBaseId}-actionlist` : undefined,
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.ActionList, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: containerRole,
      multiSelectable: isMultiSelectable,
    }),
  );
</script>

{#if isInBottomSheet}
  <!-- In a BottomSheet: render ONLY the scroll wrapper so BottomSheetBody owns
       scroll + padding (mirrors React's isInBottomSheet branch). -->
  <div
    class={[wrapperClasses, styledClassString].filter(Boolean).join(' ') || undefined}
    style={styledStyleString}
    {...a11yAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render children()}
  </div>
{:else}
  <!-- Standalone: plain outer shell (a11y/meta/analytics/styled props) + inner scroll
       wrapper — mirrors React's BaseBox + ActionListBox. Border/shadow come from the
       Dropdown overlay when embedded, not ActionList itself. -->
  <div
    id={containerId}
    class={styledClassString || undefined}
    style={styledStyleString}
    {...a11yAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    <div class={wrapperClasses} bind:this={scrollWrapperEl}>
      {@render children()}
    </div>
  </div>
{/if}
