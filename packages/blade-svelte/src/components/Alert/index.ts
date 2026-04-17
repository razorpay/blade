/**
 * Alert component - communicates information to users about significant changes or explanations.
 *
 * @example
 * ```svelte
 * <script>
 *   import { Alert } from '@razorpay/blade-svelte';
 * </script>
 *
 * <Alert
 *   title="International Payments Only"
 *   description="Currently you can only accept payments in international currencies."
 *   color="information"
 *   actions={{
 *     primary: { text: 'Learn More', onClick: () => console.log('clicked') },
 *     secondary: { text: 'Razorpay', href: 'https://razorpay.com', target: '_blank' },
 *   }}
 * />
 * ```
 */
export { default as Alert } from './Alert.svelte';
export type { AlertProps, AlertActions, AlertColor, AlertEmphasis, PrimaryAction, SecondaryAction } from './types';
