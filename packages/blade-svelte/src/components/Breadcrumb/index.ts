/**
 * Breadcrumb component - navigational aid showing the user's location in an application.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Breadcrumb, BreadcrumbItem, HomeIcon } from '@razorpay/blade-svelte';
 * </script>
 *
 * <Breadcrumb>
 *   {#snippet children()}
 *     <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
 *     <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
 *     <BreadcrumbItem isCurrentPage href="/settlements">Settlements</BreadcrumbItem>
 *   {/snippet}
 * </Breadcrumb>
 * ```
 */
export { default as Breadcrumb } from './Breadcrumb.svelte';
export { default as BreadcrumbItem } from './BreadcrumbItem.svelte';
export type {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbSize,
  BreadcrumbColor,
} from './types';
