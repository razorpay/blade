## Component Name

Chip

## Description

Chip and ChipGroup components enable users to make selections, filter content, and trigger actions through selectable elements. ChipGroup manages collections of Chips that can be configured for single or multiple selection. Chips are compact, interactive elements that support icons, various colors, and sizes, making them ideal for selection interfaces and filters.

## Important Constraints

- `Chip` component can only be used within the context of a `ChipGroup` component
- `ChipGroup` component only accepts `Chip` components as children
- The `value` and `defaultValue` props must match the `selectionType` (string for "single", array for "multiple")

Make sure to only follow structure as given in the examples below. Fragments are also not allowed as children in these components.

## TypeScript Types

The following types represent the props that the Chip component and its subcomponents accept. These allow you to properly configure the components according to your needs.

```typescript
/**
 * Props for the Chip component
 */
type ChipProps = {
  /**
   * The content to display inside the chip
   */
  children?: React.ReactNode;

  /**
   * Sets the visual color of the chip, overriding the color set by parent ChipGroup
   * @default "primary"
   */
  color?: 'primary' | 'positive' | 'negative';

  /**
   * Icon to display within the chip
   */
  icon?: IconComponent;

  /**
   * Whether the chip is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Value associated with the chip, used for selection state
   */
  value: string;

  /**
   * Callback fired when chip is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the ChipGroup component
 */
type ChipGroupProps = {
  /**
   * Accessibility label describing the purpose of the chip group
   */
  accessibilityLabel: string;

  /**
   * Chips to be rendered within the group
   */
  children: React.ReactNode;

  /**
   * Sets the visual color that applies to all chips in the group (unless overridden)
   * @default "primary"
   */
  color?: 'primary' | 'positive' | 'negative';

  /**
   * Initial value(s) for uncontrolled usage
   */
  defaultValue?: string | string[];

  /**
   * Error text to display when validation state is error
   */
  errorText?: string;

  /**
   * Help text to display below the chip group
   */
  helpText?: string;

  /**
   * Whether the chip group is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the chip group is required
   * @default false
   */
  isRequired?: boolean;

  /**
   * Label for the chip group
   */
  label?: string;

  /**
   * Position of the label relative to the chip group
   * @default "top"
   */
  labelPosition?: 'top' | 'left';

  /**
   * Name of the chip group for form submission
   */
  name?: string;

  /**
   * Indicator for whether the chip group is required or optional
   * @default "none"
   */
  necessityIndicator?: 'none' | 'required' | 'optional';

  /**
   * Callback fired when selection changes
   */
  onChange?: (event: { name?: string; values: string[] }) => void;

  /**
   * Defines the selection behavior of the chip group
   * @default "single"
   */
  selectionType?: 'single' | 'multiple';

  /**
   * Size of all chips within the group
   * @default "medium"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * The validation state of the chip group
   * @default "none"
   */
  validationState?: 'error' | 'none';

  /**
   * Selected value(s) for controlled usage
   */
  value?: string | string[];
} & StyledPropsBlade &
  TestID;

/**
 * Type for Icon Component
 */
type IconComponent = React.ComponentType<IconProps>;
```

## Examples

### Independent Chips for Product Information

This example demonstrates using Chip components independently (without ChipGroup) to display product details. It showcases various chip features including different colors, disabled states, and icon-only variations.

```tsx
import React from 'react';
import {
  Box,
  Chip,
  Heading,
  Text,
  TagIcon,
  StarIcon,
  CheckCircleIcon,
  BoxIcon,
  CreditCardIcon,
  OffersIcon,
  CalendarIcon,
  InfoIcon,
  ShieldIcon,
  RefreshIcon,
  CloseIcon,
} from '@razorpay/blade/components';

const ProductDetailsCard = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      padding="spacing.6"
      maxWidth="600px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.normal"
      borderRadius="medium"
    >
      <Heading size="large">Wireless Bluetooth Headphones</Heading>
      <Text size="large" weight="semibold">
        ₹2,499
      </Text>

      {/* Features with different colors and icons */}
      <Box>
        <Text size="medium" weight="semibold" marginBottom="spacing.2">
          Features
        </Text>
        <Box display="flex" gap="spacing.2" flexWrap="wrap">
          <Chip value="24hr-battery" icon={CheckCircleIcon} color="positive">
            24hr Battery
          </Chip>
          <Chip value="noise-cancelling" icon={CheckCircleIcon} color="positive">
            Noise Cancelling
          </Chip>
          <Chip value="voice-assistant" icon={CheckCircleIcon} color="primary">
            Voice Assistant
          </Chip>
          <Chip value="bluetooth" icon={CheckCircleIcon} color="primary">
            Bluetooth 5.0
          </Chip>
        </Box>
      </Box>

      {/* Payment options mixing regular, disabled and icon-only chips */}
      <Box>
        <Text size="medium" weight="semibold" marginBottom="spacing.2">
          Payment & Delivery
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          {/* Payment methods row */}
          <Box display="flex" gap="spacing.2" flexWrap="wrap">
            <Chip value="credit-card" icon={CreditCardIcon}>
              Credit Card
            </Chip>
            <Chip value="upi">UPI</Chip>
            <Chip value="emi" icon={CreditCardIcon}>
              EMI
            </Chip>
            <Chip value="cod" isDisabled>
              Cash on Delivery
            </Chip>
          </Box>

          {/* Delivery options row */}
          <Box display="flex" gap="spacing.2" flexWrap="wrap">
            <Chip value="free-shipping" icon={BoxIcon} color="positive">
              Free Shipping
            </Chip>
            <Chip value="express" icon={CalendarIcon}>
              Express (2-3 days)
            </Chip>
            <Chip value="discount" icon={OffersIcon} color="primary">
              10% Off
            </Chip>
            <Chip value="international" icon={BoxIcon} isDisabled>
              International
            </Chip>
          </Box>

          {/* Row with icon-only chips for simple status indicators */}
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Text size="small">Quick status:</Text>
            <Chip value="available" icon={CheckCircleIcon} color="positive" />
            <Chip value="warranty" icon={ShieldIcon} color="primary" />
            <Chip value="exchange" icon={RefreshIcon} />
            <Chip value="gift" icon={OffersIcon} isDisabled />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailsCard;
```

### Business Category Selection with ChipGroup

This example demonstrates a comprehensive form with different ChipGroup configurations, including single and multiple selection, various sizes, colors, icons, validation states, disabled groups, and icon-only chips.

```tsx
import React, { useState } from 'react';
import {
  Box,
  Chip,
  ChipGroup,
  Heading,
  Text,
  Button,
  AppStoreIcon,
  BuildingIcon,
  CreditCardIcon,
  WifiIcon,
  ShoppingBagIcon,
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  CloseIcon,
} from '@razorpay/blade/components';

const BusinessRegistrationForm = () => {
  // Form state for different ChipGroup components
  const [businessType, setBusinessType] = useState('small-business');
  const [industries, setIndustries] = useState(['retail']);
  const [paymentMethods, setPaymentMethods] = useState(['cards', 'upi']);
  const [feedback, setFeedback] = useState('');

  // Validation state
  const [showValidation, setShowValidation] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);

    if (businessType && industries.length > 0 && paymentMethods.length > 0) {
      console.log('Form submitted:', {
        businessType,
        industries,
        paymentMethods,
        feedback,
      });

      alert('Registration successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Heading size="large">Business Registration</Heading>

      {/* Single selection with label, default value, and different sizes */}
      <ChipGroup
        label="Business Type"
        accessibilityLabel="Select your business type from the options below"
        labelPosition="top"
        necessityIndicator="required"
        isRequired
        helpText="Select the type that best describes your business"
        value={businessType}
        onChange={({ values }) => setBusinessType(values[0])}
        selectionType="single"
        size="medium"
        validationState={showValidation && !businessType ? 'error' : 'none'}
        errorText="Business type is required"
      >
        <Chip value="proprietorship" icon={AppStoreIcon}>
          Proprietorship
        </Chip>
        <Chip value="small-business" icon={BuildingIcon}>
          Small Business
        </Chip>
        <Chip value="enterprise" icon={BuildingIcon}>
          Enterprise
        </Chip>
        <Chip value="partnership" icon={BuildingIcon}>
          Partnership
        </Chip>
      </ChipGroup>

      {/* Multiple selection with custom colors */}
      <ChipGroup
        label="Industry Categories"
        accessibilityLabel="Select all industries that apply to your business"
        labelPosition="left"
        helpText="You can select multiple industries"
        validationState={showValidation && industries.length === 0 ? 'error' : 'none'}
        errorText="At least one industry must be selected"
        necessityIndicator="required"
        isRequired
        value={industries}
        onChange={({ values }) => setIndustries(values)}
        selectionType="multiple"
        size="small"
      >
        <Chip value="retail" icon={ShoppingBagIcon}>
          Retail
        </Chip>
        <Chip value="finance" icon={CreditCardIcon} color="primary">
          Finance
        </Chip>
        <Chip value="technology" icon={WifiIcon} color="positive">
          Technology
        </Chip>
        <Chip value="hospitality" color="negative">
          Hospitality
        </Chip>
        <Chip value="education">Education</Chip>
      </ChipGroup>

      {/* Payment methods selection with disabled premium features */}
      <Box display="flex" flexDirection="column" gap="spacing.5">
        <ChipGroup
          label="Payment Methods"
          accessibilityLabel="Select payment methods you want to accept"
          helpText="Choose payment methods your business will accept"
          value={paymentMethods}
          onChange={({ values }) => setPaymentMethods(values)}
          selectionType="multiple"
          size="xsmall"
        >
          <Chip value="cards">Credit/Debit Cards</Chip>
          <Chip value="upi">UPI</Chip>
          <Chip value="netbanking">Netbanking</Chip>
          <Chip value="wallet">Wallets</Chip>
        </ChipGroup>

        <ChipGroup
          label="Premium Features (Available after approval)"
          accessibilityLabel="Premium features available after approval"
          helpText="These features will be available after your account is reviewed"
          isDisabled={true}
          selectionType="multiple"
          size="xsmall"
        >
          <Chip value="international">International Payments</Chip>
          <Chip value="subscription">Subscription Billing</Chip>
          <Chip value="analytics">Advanced Analytics</Chip>
        </ChipGroup>
      </Box>

      <Button type="submit" variant="primary" size="medium">
        Complete Registration
      </Button>
    </form>
  );
};

export default BusinessRegistrationForm;
```

### Interactive Product Filter with State Management

This example demonstrates a controlled ChipGroup implementation for an e-commerce product filter, showcasing a different layout and interaction pattern.

```tsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Chip,
  ChipGroup,
  Heading,
  Text,
  Button,
  TagIcon,
  FilterIcon,
  CloseIcon,
} from '@razorpay/blade/components';

const ProductFilterInterface = () => {
  // State for filters
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('recommended');

  // Ref for focusing a chip
  const newArrivalsRef = useRef<HTMLDivElement>(null);

  // Reset all filters
  const clearAllFilters = () => {
    setCategories([]);
    setPriceRanges('');
    setAvailability('');
    setSortOrder('recommended');
  };

  // Focus on a specific filter option
  const focusNewArrivals = () => {
    if (newArrivalsRef.current) {
      newArrivalsRef.current.focus();
      setAvailability('new-arrivals');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.6"
      padding="spacing.6"
      maxWidth="800px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.normal"
      borderRadius="medium"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="medium">Product Filters</Heading>

        <Button variant="secondary" size="small" icon={CloseIcon} onClick={clearAllFilters}>
          Clear All
        </Button>
      </Box>

      {/* Categories - Multiple selection with color and status indicator */}
      <ChipGroup
        label="Categories"
        accessibilityLabel="Filter products by category"
        value={categories}
        onChange={({ values }) => setCategories(values)}
        selectionType="multiple"
        helpText={
          categories.length
            ? `${categories.length} categories selected`
            : 'Select categories to filter products'
        }
        size="small"
      >
        <Box display="flex" flexWrap="wrap" gap="spacing.3">
          <Chip value="electronics">Electronics</Chip>
          <Chip value="clothing">Clothing</Chip>
          <Chip value="home-decor">Home Decor</Chip>
          <Chip value="kitchen">Kitchen</Chip>
          <Chip value="books">Books</Chip>
          <Chip value="sports">Sports</Chip>
          <Chip value="beauty">Beauty</Chip>
          <Chip value="toys">Toys</Chip>
        </Box>
      </ChipGroup>

      {/* Price Range - Single selection with horizontal layout */}
      <ChipGroup
        label="Price Range"
        accessibilityLabel="Filter products by price range"
        value={priceRanges}
        onChange={({ values }) => setPriceRanges(values[0])}
        selectionType="single"
        size="xsmall"
        helpText="Select a price range to filter products"
        color="primary"
      >
        <Box display="flex" gap="spacing.2" flexWrap="wrap">
          <Chip value="under-500">Under ₹500</Chip>
          <Chip value="500-1000">₹500 - ₹1000</Chip>
          <Chip value="1000-5000">₹1000 - ₹5000</Chip>
          <Chip value="5000-10000">₹5000 - ₹10000</Chip>
          <Chip value="over-10000">Over ₹10000</Chip>
        </Box>
      </ChipGroup>

      {/* Availability - Single selection with ref for focus */}
      <ChipGroup
        label="Availability"
        accessibilityLabel="Filter products by availability"
        value={availability}
        onChange={({ values }) => setAvailability(values[0])}
        selectionType="single"
        size="medium"
      >
        <Chip value="in-stock">In Stock</Chip>
        <Chip value="on-sale" color="positive">
          On Sale
        </Chip>
        <Chip ref={newArrivalsRef} value="new-arrivals">
          New Arrivals
        </Chip>
        <Chip value="pre-order">Pre-Order</Chip>
      </ChipGroup>
    </Box>
  );
};

export default ProductFilterInterface;
```
