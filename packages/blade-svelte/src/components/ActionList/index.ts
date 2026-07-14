/**
 * ActionList — a list of selectable/actionable items, designed to render inside
 * a `BottomSheet`. Supports both `single` and `multiple` selection. This is a
 * scoped, BottomSheet-mode slice of React's ActionList: the Dropdown/AutoComplete
 * couplings and virtualization are out of scope.
 *
 * Selection is controlled via `selectedValue` + `onAction` (keyed on each
 * item's `value`) — a `string` in `single` mode, a `string[]` in `multiple`
 * mode. When rendered inside a `BottomSheet`, `isInBottomSheet` is auto-detected
 * from the BottomSheet context, so the outer box (border/shadow/padding) is
 * dropped and `BottomSheetBody` owns scrolling.
 *
 * ### Deviations from React
 * - **Story title:** stories use `Components/ActionList` (blade-svelte
 *   convention), NOT React's Dropdown-nested `Components/Dropdown/ActionList/Stories`.
 * - **`isVirtualized` removed:** virtualization is dropped entirely (not even a
 *   noop); all items render in a plain `max-height` + `overflow-y: auto` scroll
 *   container.
 * - **Dropdown / AutoComplete triggers out of scope:** roles are fixed to
 *   list/option (no `menu`/`dialog`/`menuitemcheckbox` branches); there is no
 *   filtering/`filteredValues` behavior.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { getFlagOfCountry } from '@razorpay/i18nify-js/geo';
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
 *   let selected = $state<string | undefined>('IN');
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
 *             <ActionListItem title="India" value="IN">
 *               {#snippet leading()}
 *                 <ActionListItemAsset src={getFlagOfCountry('IN')['4X3']} alt="India" />
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
export { default as ActionListItemIcon } from './ActionListItemIcon.svelte';
export { default as ActionListItemAvatar } from './ActionListItemAvatar.svelte';
export { default as ActionListItemBadge } from './ActionListItemBadge.svelte';
export { default as ActionListItemBadgeGroup } from './ActionListItemBadgeGroup.svelte';
export { default as ActionListSection } from './ActionListSection.svelte';
export type {
  ActionListProps,
  ActionListItemProps,
  ActionListItemAssetProps,
  ActionListItemTextProps,
  ActionListItemIconProps,
  ActionListItemAvatarProps,
  ActionListItemBadgeProps,
  ActionListItemBadgeGroupProps,
  ActionListSectionProps,
  ActionListSelectionType,
  ActionListItemClickPayload,
  ActionListItemSelectPayload,
} from './types';
