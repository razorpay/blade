/**
 * AppBar — top application/page header with a leading cluster (back button, logo,
 * title, trust badge) and a trailing actions slot.
 *
 * @example
 * ```svelte
 * <script>
 *   import { AppBar, AppBarLeading, AppBarActions, IconButton } from '@razorpay/blade-svelte/components';
 *   import { UserIcon, CloseIcon } from '@razorpay/blade-svelte/components';
 *
 *   const goBack = () => history.back();
 * </script>
 *
 * <AppBar showBackButton={true} onBackButtonClick={goBack} backButtonAccessibilityLabel="Go back">
 *   <AppBarLeading title="Mavenshop" trustBadgeVariant="default">
 *     {#snippet logo()}<MerchantLogo />{/snippet}
 *   </AppBarLeading>
 *   <AppBarActions>
 *     <IconButton icon={UserIcon} emphasis="moderate" accessibilityLabel="Profile" onClick={() => {}} />
 *     <IconButton icon={CloseIcon} emphasis="moderate" accessibilityLabel="Close" onClick={() => {}} />
 *   </AppBarActions>
 * </AppBar>
 * ```
 */
export { default as AppBar } from './AppBar.svelte';
export { default as AppBarLeading } from './AppBarLeading.svelte';
export { default as AppBarActions } from './AppBarActions.svelte';
export type { AppBarProps, AppBarLeadingProps, AppBarActionsProps, AppBarVariant } from './types';
