# EmptyState

## Description

EmptyState component provides a consistent way to display empty states across applications with optional visual assets, titles, descriptions, and action elements. It offers different size variants with appropriate spacing and typography scaling, making it suitable for various contexts from small cards to full-page empty states. The component supports custom illustrations, images, icons, and flexible content layouts while maintaining design consistency and accessibility standards.

## TypeScript Types

These are the props that the EmptyState component accepts:

````typescript
export type EmptyStateProps = {
  /**
   * Asset slot for custom illustrations, images, or any visual element.
   * Supports PNGs, custom brand illustrations, SVGs, animated gifs, lottie components etc.
   *
   * @example
   * ```jsx
   * // Custom image
   * <EmptyState asset={<img src="/custom-illustration.png" alt="No data" />} />
   *
   * // Custom component
   * <EmptyState asset={<CustomIllustration />} />
   * ```
   */
  asset?: React.ReactNode;

  /**
   * Primary heading text for the empty state
   */
  title?: string;

  /**
   * Supporting description text providing context and guidance
   */
  description?: string;

  /**
   * Children content for actions, links, or any custom content.
   */
  children?: React.ReactNode;

  /**
   * Size variant affecting the overall scale of the component
   * @default medium
   */
  size?: EmptyStateSize;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

export type EmptyStateSize = 'small' | 'medium' | 'large' | 'xlarge';
````

## Examples

### Complete EmptyState with Interactive Functionality

```tsx
import { useState } from 'react';
import { EmptyState } from '@razorpay/blade/components';
import { Button } from '@razorpay/blade/components';
import { Link } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

const ErrorEmptyState = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <EmptyState
      size="medium"
      asset={
        <img
          src="/network-error-illustration.png"
          alt="Failed to load data"
          width="90"
          height="90"
        />
      }
      title="Failed to load dashboard data"
      description="We couldn't retrieve your transaction data due to a network issue. Please check your connection and try again, or contact support if the problem persists."
      testID="dashboard-error-empty-state"
      data-analytics-section="dashboard"
      data-analytics-action="error-state-view"
    >
      <Box display="flex" flexDirection="column" gap="spacing.4" alignItems="center">
        <Box display="flex" flexDirection="row" gap="spacing.3">
          <Button onClick={handleRetry} isLoading={isRetrying}>
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Box>
        <Link href="/support" size="small">
          Contact Support
        </Link>
      </Box>
    </EmptyState>
  );
};
```

### Simple EmptyState with Blade Icon

```tsx
import { EmptyState } from '@razorpay/blade/components';
import { Button } from '@razorpay/blade/components';
import { EcommerceIcon } from '@razorpay/blade/components';

const SimpleEmptyState = () => {
  return (
    <EmptyState
      size="xlarge"
      asset={<EcommerceIcon size="2xlarge" color="surface.icon.gray.muted" />}
      title="Your cart is empty"
      description="Browse our products and add items you'd like to purchase."
      testID="cart-empty-state"
      data-analytics-section="shopping-cart"
    >
      <Button size="large" onClick={() => console.log('Navigate to products')}>
        Start Shopping
      </Button>
    </EmptyState>
  );
};
```
