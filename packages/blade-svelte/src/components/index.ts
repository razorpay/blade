// Re-export Base components with their original names to ensure they're available
// when other components reference them at runtime
export { default as BaseText } from './Typography/BaseText/BaseText.svelte';
export { default as BaseButton } from './Button/BaseButton/BaseButton.svelte';
export { default as BaseSpinner } from './Spinner/BaseSpinner/BaseSpinner.svelte';
export { default as BaseAmount } from './Amount/BaseAmount/BaseAmount.svelte';
export { default as BaseLink } from './Link/BaseLink/BaseLink.svelte';

// Typography
export { default as Text } from './Typography/Text/Text.svelte';
export { default as Heading } from './Typography/Heading/Heading.svelte';
export { default as Code } from './Typography/Code/Code.svelte';

// Button
export { default as Button } from './Button/Button.svelte';

// Link
export { default as Link } from './Link/Link.svelte';

// Spinner (alias to BaseSpinner for backward compatibility)
export { default as Spinner } from './Spinner/BaseSpinner/BaseSpinner.svelte';

// Amount
export { default as Amount } from './Amount/Amount.svelte';

// Badge
export { default as Badge } from './Badge/Badge.svelte';

// Counter
export { default as Counter } from './Counter/Counter.svelte';

// Alert
export { default as Alert } from './Alert/Alert.svelte';

// Card
export {
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardFooter,
  CardFooterLeading,
  CardFooterTrailing,
} from './Card';
export type {
  CardProps,
  CardBodyProps,
  CardHeaderProps,
  CardHeaderLeadingProps,
  CardHeaderTrailingProps,
  CardFooterProps,
  CardFooterLeadingProps,
  CardFooterTrailingProps,
  CardFooterAction,
} from './Card';

// BladeProvider
export * from './BladeProvider';
