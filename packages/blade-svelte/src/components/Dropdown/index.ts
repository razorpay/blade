/**
 * Dropdown — a generic controller that opens a floating `DropdownOverlay`
 * (portaled, positioned with `@floating-ui/dom`) containing an `ActionList`,
 * with optional `DropdownHeader` / `DropdownFooter`. Works with menu triggers
 * (Button / Link / IconButton) or the select-style `InputDropdownButton`.
 *
 * This is a partial (Tiers 1–3), web-only migration. Out of scope: SelectInput,
 * AutoComplete, FilterChip* triggers, DropdownButton/Link/IconButton wrappers,
 * TreeView / ListView overlay content, and the TopNav theme override.
 *
 * When an `ActionList` is rendered inside a `Dropdown`, its items self-register
 * into the Dropdown's option registry to power index-based keyboard navigation,
 * selection highlight, typeahead, and the trigger `displayValue`. Standalone /
 * BottomSheet `ActionList` usage is unaffected (registration is a no-op without
 * a Dropdown ancestor).
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import {
 *     Dropdown,
 *     DropdownOverlay,
 *     ActionList,
 *     ActionListItem,
 *     Button,
 *   } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <Dropdown selectionType="single">
 *   {#snippet children()}
 *     <Button>Open menu</Button>
 *     <DropdownOverlay>
 *       {#snippet children()}
 *         <ActionList>
 *           {#snippet children()}
 *             <ActionListItem title="Profile" value="profile" />
 *             <ActionListItem title="Settings" value="settings" />
 *           {/snippet}
 *         </ActionList>
 *       {/snippet}
 *     </DropdownOverlay>
 *   {/snippet}
 * </Dropdown>
 * ```
 */
export { default as Dropdown } from './Dropdown.svelte';
export { default as DropdownOverlay } from './DropdownOverlay.svelte';
export { default as DropdownHeader } from './DropdownHeader.svelte';
export { default as DropdownFooter } from './DropdownFooter.svelte';
export { default as InputDropdownButton } from './InputDropdownButton.svelte';
export type {
  DropdownProps,
  DropdownOverlayProps,
  DropdownHeaderProps,
  DropdownFooterProps,
  InputDropdownButtonProps,
  DropdownSelectionType,
  DropdownContextValue,
  DropdownOption,
} from './types';
