/**
 * # Dropdown
 *
 * Dropdown is a generic component that controls overlay/menu functionality.
 * Use it with `DropdownButton`, `DropdownIconButton`, or `DropdownLink` as a trigger,
 * and place `DropdownOverlay` inside containing your `ActionList`.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import {
 *     Dropdown,
 *     DropdownOverlay,
 *     DropdownButton,
 *     DropdownHeader,
 *     DropdownFooter,
 *   } from '@razorpay/blade-svelte';
 * </script>
 *
 * <Dropdown selectionType="single">
 *   {#snippet children()}
 *     <DropdownButton>Open Menu</DropdownButton>
 *     <DropdownOverlay>
 *       {#snippet children()}
 *         <!-- ActionList goes here -->
 *       {/snippet}
 *     </DropdownOverlay>
 *   {/snippet}
 * </Dropdown>
 * ```
 *
 * ### Not implemented in Svelte
 * - `FilterChipGroup` / `FilterChipSelectInput` — requires FilterChip migration
 * - `InputDropdownButton` — requires Input component migration
 * - `SelectInput` / `AutoComplete` / `SearchInput` triggers — require Input migration
 */
export { default as Dropdown } from './Dropdown.svelte';
export { default as DropdownOverlay } from './DropdownOverlay.svelte';
export { default as DropdownButton } from './DropdownButton.svelte';
export { default as DropdownIconButton } from './DropdownIconButton.svelte';
export { default as DropdownLink } from './DropdownLink.svelte';
export { default as DropdownHeader } from './DropdownHeader.svelte';
export { default as DropdownFooter } from './DropdownFooter.svelte';

// Context helpers — re-exported for advanced use-cases (e.g. custom triggers)
export { getDropdownContext, setDropdownContext } from './dropdownContext';
export type { DropdownContextState, DropdownTriggererType, OptionsType } from './dropdownContext';

// Utility functions — re-exported for consumers who build on top of Dropdown
export {
  getActionListContainerRole,
  getActionFromKey,
  getUpdatedIndex,
  filterOptions,
  getIndexByLetter,
  ensureScrollVisiblity,
  isScrollable,
  isElementVisibleOnScreen,
  makeInputValue,
  makeInputDisplayValue,
  performAction,
} from './dropdownUtils';
export type { SelectActionsType } from './dropdownUtils';

// Types
export type {
  DropdownProps,
  DropdownOverlayProps,
  DropdownButtonProps,
  DropdownIconButtonProps,
  DropdownLinkProps,
  DropdownHeaderProps,
  DropdownFooterProps,
} from './types';
