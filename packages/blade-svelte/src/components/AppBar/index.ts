/**
 * AppBar — top application/page header with a leading cluster (back button, logo,
 * title, RTB badge) and a trailing actions slot.
 *
 * @example
 * ```svelte
 * <script>
 *   import { AppBar, AppBarLeading, AppBarActions, Button } from '@razorpay/blade-svelte/components';
 *   import { UserIcon, CloseIcon } from '@razorpay/blade-svelte/components';
 *
 *   const goBack = () => history.back();
 * </script>
 *
 * <AppBar backButton={{ onClick: goBack, accessibilityLabel: 'Go back' }}>
 *   <AppBarLeading title="Mavenshop" isTrustedBusiness>
 *     {#snippet logo()}<MerchantLogo />{/snippet}
 *   </AppBarLeading>
 *   <AppBarActions>
 *     <Button icon={UserIcon} accessibilityLabel="Profile" variant="tertiary" color="white" />
 *     <Button icon={CloseIcon} accessibilityLabel="Close" variant="tertiary" color="white" />
 *   </AppBarActions>
 * </AppBar>
 * ```
 */
export { default as AppBar } from './AppBar.svelte';
export { default as AppBarLeading } from './AppBarLeading.svelte';
export { default as AppBarActions } from './AppBarActions.svelte';
export type {
  AppBarProps,
  AppBarLeadingProps,
  AppBarActionsProps,
  AppBarVariant,
  AppBarBackButton,
} from './types';
