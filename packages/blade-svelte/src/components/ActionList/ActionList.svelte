<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getActionListBoxClasses,
    getActionListWrapperClasses,
    getActionListTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { getBottomSheetContext } from '../BottomSheet/bottomSheetContext';
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

  const boxClasses = $derived(getActionListBoxClasses({ isInBottomSheet }));
  const wrapperClasses = $derived(getActionListWrapperClasses({ isInBottomSheet }));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const styledClassString = $derived((styledProps.classes || []).filter(Boolean).join(' '));
  const styledStyleString = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const outerClasses = $derived([boxClasses, styledClassString].filter(Boolean).join(' ') || undefined);

  const isMultiSelectable = $derived(selectionType === 'multiple');

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.ActionList, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: getActionListContainerRole(),
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
  <div class={outerClasses} style={styledStyleString} {...a11yAttrs} {...metaAttrs} {...analyticsAttrs}>
    <div class={wrapperClasses}>
      {@render children()}
    </div>
  </div>
{/if}
