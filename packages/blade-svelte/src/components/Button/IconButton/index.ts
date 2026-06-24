/**
 * IconButton — a clickable icon with a transparent background.
 *
 * Useful for making clickable icons, eg. close buttons for modals, inputs, etc.
 * For other cases prefer the `Button` component with its `icon` prop.
 *
 * @example
 * ```svelte
 * <script>
 *   import { IconButton, CloseIcon } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <IconButton
 *   icon={CloseIcon}
 *   accessibilityLabel="Close"
 *   onClick={() => console.log('Clicked')}
 * />
 * ```
 */
export { default as IconButton } from './IconButton.svelte';
export type { IconButtonProps, IconButtonEmphasis, IconButtonSize } from './types';
export { BaseIconButton } from './BaseIconButton';
export type { BaseIconButtonProps } from './BaseIconButton';
