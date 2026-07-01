/**
 * ActionList — a list of selectable/actionable items, designed to render inside
 * a `BottomSheet`. This is a scoped, single-select, BottomSheet-mode slice of
 * React's ActionList: Dropdown/AutoComplete/multiselect/virtualization are all
 * out of scope.
 *
 * Selection is controlled via `selectedValue` + `onAction` (keyed on each
 * item's `value`). When rendered inside a `BottomSheet`, `isInBottomSheet` is
 * auto-detected from the BottomSheet context, so the outer box (border/shadow/
 * padding) is dropped and `BottomSheetBody` owns scrolling.
 *
 * ### Deviations from React
 * - **Story title:** stories use `Components/ActionList` (blade-svelte
 *   convention), NOT React's Dropdown-nested `Components/Dropdown/ActionList/Stories`.
 * - **`isVirtualized` removed:** virtualization is dropped entirely (not even a
 *   noop); all items render in a plain `max-height` + `overflow-y: auto` scroll
 *   container.
 * - **`titleSuffix` removed:** Badge-in-item is out of scope.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import {
 *     ActionList,
 *     ActionListItem,
 *     ActionListItemAsset,
 *     ActionListItemText,
 *     BottomSheet,
 *     BottomSheetHeader,
 *     BottomSheetBody,
 *   } from '@razorpay/blade-svelte/components';
 *
 *   let isOpen = $state(false);
 *   let selected = $state<string | undefined>('in');
 * </script>
 *
 * <BottomSheet {isOpen} onDismiss={() => (isOpen = false)}>
 *   {#snippet children()}
 *     <BottomSheetHeader title="Select country" />
 *     <BottomSheetBody hasActionList>
 *       {#snippet children()}
 *         <ActionList
 *           selectedValue={selected}
 *           onAction={({ value }) => {
 *             selected = value;
 *             isOpen = false;
 *           }}
 *         >
 *           {#snippet children()}
 *             <ActionListItem title="India" value="in">
 *               {#snippet leading()}
 *                 <ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="India" />
 *               {/snippet}
 *               {#snippet trailing()}
 *                 <ActionListItemText>+91</ActionListItemText>
 *               {/snippet}
 *             </ActionListItem>
 *           {/snippet}
 *         </ActionList>
 *       {/snippet}
 *     </BottomSheetBody>
 *   {/snippet}
 * </BottomSheet>
 * ```
 */
export { default as ActionList } from './ActionList.svelte';
export { default as ActionListItem } from './ActionListItem.svelte';
export { default as ActionListItemAsset } from './ActionListItemAsset.svelte';
export { default as ActionListItemText } from './ActionListItemText.svelte';
export { default as ActionListSection } from './ActionListSection.svelte';
export type {
  ActionListProps,
  ActionListItemProps,
  ActionListItemAssetProps,
  ActionListItemTextProps,
  ActionListSectionProps,
  ActionListSelectionType,
  ActionListItemClickPayload,
  ActionListItemSelectPayload,
} from './types';
