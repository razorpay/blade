## Component Name

Icons

## Description

Blade provides a collection of pre-designed icons that can be used throughout your application. Icons are available in 6 different sizes and can be customized with various colors to match your design requirements. They are primarily designed to be used within other components like Button or Badge, but can also be used standalone when needed.

## TypeScript Types

The following types represent the props that the Icon components accept. These allow you to properly configure the icons according to your needs.

```typescript
/**
 * Props for all Icon components
 */
type IconProps = {
  /**
   * The color of the icon
   * @default 'surface.icon.gray.normal'
   */
  color?: string;

  /**
   * The size of the icon
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
} & StyledPropsBlade &
  TestID;
```

## Examples

### Icon Usage

This example demonstrates comprehensive icon usage with all core props and integration with other components.

```tsx
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  TextInput,
  ArrowRightIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
  AlertTriangleIcon,
  PlusIcon,
  CreditCardIcon,
  SearchIcon,
  DownloadIcon,
  UserIcon,
} from '@razorpay/blade/components';

const IconsExample = () => {
  return (
    <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.6">
      {/* Different sizes with semantic colors */}
      <ArrowRightIcon size="small" color="surface.icon.primary.normal" />
      <CheckCircleIcon size="medium" color="surface.icon.success.normal" />
      <CloseIcon size="large" color="surface.icon.error.normal" />
      <InfoIcon size="xlarge" color="surface.icon.information.normal" />
      <AlertTriangleIcon size="2xlarge" color="surface.icon.warning.normal" />
    </Box>
  );
};

export default IconsExample;
```
