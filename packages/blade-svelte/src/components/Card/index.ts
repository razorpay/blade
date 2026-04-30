/**
 * Card component and sub-components for Blade Design System.
 *
 * @example
 * ```svelte
 * <script>
 *   import {
 *     Card, CardBody, CardHeader, CardHeaderLeading,
 *     CardHeaderTrailing, CardHeaderIcon, CardHeaderCounter,
 *     CardHeaderBadge, CardFooter, CardFooterLeading,
 *     CardFooterTrailing
 *   } from '@razorpay/blade-svelte/components';
 *   import { InfoIcon } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <Card>
 *   <CardHeader>
 *     <CardHeaderLeading
 *       title="Card Header"
 *       subtitle="Subtitle"
 *     >
 *       {#snippet prefix()}
 *         <CardHeaderIcon icon={InfoIcon} />
 *       {/snippet}
 *       {#snippet suffix()}
 *         <CardHeaderCounter value={12} />
 *       {/snippet}
 *     </CardHeaderLeading>
 *     <CardHeaderTrailing>
 *       {#snippet visual()}
 *         <CardHeaderBadge color="positive">NEW</CardHeaderBadge>
 *       {/snippet}
 *     </CardHeaderTrailing>
 *   </CardHeader>
 *   <CardBody>
 *     <Text>Card content here</Text>
 *   </CardBody>
 *   <CardFooter>
 *     <CardFooterLeading title="Footer Title" subtitle="Subtitle" />
 *     <CardFooterTrailing
 *       actions={{
 *         primary: { text: 'Accept', onClick: () => {} },
 *         secondary: { text: 'Cancel', onClick: () => {} },
 *       }}
 *     />
 *   </CardFooter>
 * </Card>
 * ```
 */

// Main Card
export { default as Card } from './Card.svelte';
export { default as CardBody } from './CardBody.svelte';

// Header
export { default as CardHeader } from './CardHeader.svelte';
export { default as CardHeaderLeading } from './CardHeaderLeading.svelte';
export { default as CardHeaderTrailing } from './CardHeaderTrailing.svelte';
export { default as CardHeaderIcon } from './CardHeaderIcon.svelte';
export { default as CardHeaderCounter } from './CardHeaderCounter.svelte';
export { default as CardHeaderBadge } from './CardHeaderBadge.svelte';
export { default as CardHeaderAmount } from './CardHeaderAmount.svelte';
export { default as CardHeaderText } from './CardHeaderText.svelte';
export { default as CardHeaderLink } from './CardHeaderLink.svelte';
export { default as CardHeaderIconButton } from './CardHeaderIconButton.svelte';

// Footer
export { default as CardFooter } from './CardFooter.svelte';
export { default as CardFooterLeading } from './CardFooterLeading.svelte';
export { default as CardFooterTrailing } from './CardFooterTrailing.svelte';

// Types
export type {
  CardProps,
  CardBodyProps,
  CardHeaderProps,
  CardHeaderLeadingProps,
  CardHeaderTrailingProps,
  CardHeaderIconButtonProps,
  CardFooterProps,
  CardFooterAction,
  CardFooterLeadingProps,
  CardFooterTrailingProps,
  CardSpacingValueType,
} from './types';
