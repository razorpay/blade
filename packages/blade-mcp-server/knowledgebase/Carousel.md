## Component Name

Carousel

## Description

The Carousel is a component that displays a collection of items in a horizontally scrollable container. It enables users to navigate through content items like images, cards, or promotional content with pagination indicators and navigation buttons. The Carousel supports various configurations including multiple visible items, autoplay, and different navigation styles.

## TypeScript Types

The following types represent the props that the Carousel component and its subcomponents accept. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Carousel component
 */
type CarouselProps = {
  /**
   * The content to be displayed inside the carousel
   */
  children: React.ReactNode;

  /**
   * Accessibility label for the carousel
   */
  accessibilityLabel?: string;

  /**
   * Whether to automatically play the carousel
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Alignment of carousel items
   * @default 'start'
   */
  carouselItemAlignment?:
    | 'normal'
    | 'stretch'
    | 'center'
    | 'end'
    | 'flex-end'
    | 'flex-start'
    | 'self-end'
    | 'self-start'
    | 'start';

  /**
   * Width of carousel items
   */
  carouselItemWidth?: string | ResponsiveValue<string>;

  /**
   * Position of navigation buttons
   * @default 'bottom'
   */
  navigationButtonPosition?: 'bottom' | 'side';

  /**
   * Variant of indicators
   * @default 'gray'
   */
  indicatorVariant?: 'gray' | 'white';

  /**
   * Variant of navigation buttons
   * @default 'filled'
   */
  navigationButtonVariant?: 'filled' | 'outlined';

  /**
   * Number of visible items
   * @default 1
   */
  visibleItems?: number | 'autofit';

  /**
   * Whether to add spacing at the start and end
   * @default false
   */
  shouldAddStartEndSpacing?: boolean;

  /**
   * Whether to show indicators
   * @default true
   */
  showIndicators?: boolean;

  /**
   * Color of scroll overlay
   */
  scrollOverlayColor?: string;

  /**
   * Currently active slide (controlled mode)
   */
  activeSlide?: number;

  /**
   * Default active slide (uncontrolled mode)
   */
  defaultActiveSlide?: number;

  /**
   * Callback when slide changes
   */
  onChange?: (index: number) => void;
} & StyledPropsBlade &
  TestID;

/**
 * Props for the CarouselItem component
 */
type CarouselItemProps = {
  /**
   * The content to be displayed inside the carousel item
   */
  children: React.ReactNode;
} & StyledPropsBlade;

/**
 * Type for responsive values
 */
type ResponsiveValue<T> = {
  base?: T;
  s?: T;
  m?: T;
  l?: T;
  xl?: T;
};
```

## Examples

### Basic Responsive Carousel

This example demonstrates a simple carousel with responsive item widths and bottom navigation.

```tsx
import React from 'react';
import {
  Carousel,
  CarouselItem,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Box,
  Text,
} from '@razorpay/blade/components';

const BasicCarouselExample = () => {
  const testimonials = [
    {
      id: '1',
      title: 'Increased Conversion Rate',
      quote: 'We saw a 35% increase in conversion after integrating Razorpay Checkout.',
      author: 'Priya Sharma',
      company: 'TechStart',
    },
    {
      id: '2',
      title: 'Seamless Integration',
      quote: 'The API was easy to integrate and the dashboard provides great insights.',
      author: 'Rahul Gupta',
      company: 'Shopify Plus',
    },
    {
      id: '3',
      title: 'Excellent Customer Support',
      quote: 'Whenever we faced any issues, the support team was quick to respond.',
      author: 'Anita Desai',
      company: 'StyleBazaar',
    },
    {
      id: '4',
      title: 'Simplified Refunds',
      quote: 'Processing refunds has become a breeze with the dashboard.',
      author: 'Vikram Singh',
      company: 'TravelEasy',
    },
  ];

  return (
    <Box padding="spacing.5">
      <Carousel
        accessibilityLabel="Customer testimonials"
        carouselItemWidth={{ base: '90%', m: '45%', l: '30%' }}
        visibleItems="autofit"
        navigationButtonPosition="bottom"
        indicatorVariant="gray"
        showIndicators={true}
        testID="testimonial-carousel"
      >
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id}>
            <Card height="100%" padding="spacing.4" elevation="lowRaised">
              <CardHeader>
                <CardHeaderLeading
                  title={testimonial.title}
                  subtitle={`${testimonial.author}, ${testimonial.company}`}
                />
              </CardHeader>
              <CardBody>
                <Text>{testimonial.quote}</Text>
              </CardBody>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default BasicCarouselExample;
```

### Carousel with AutoPlay and Side Navigation

This example shows a carousel with autoplay functionality, side navigation buttons, and custom styling.

```tsx
import React from 'react';
import {
  Carousel,
  CarouselItem,
  Card,
  CardBody,
  Box,
  Text,
  Heading,
} from '@razorpay/blade/components';

const AutoPlayCarouselExample = () => {
  const testimonials = [
    {
      id: '1',
      title: 'Increased Conversion Rate',
      quote: 'We saw a 35% increase in conversion after integrating Razorpay Checkout.',
      author: 'Priya Sharma',
      role: 'Product Manager',
      company: 'TechStart',
    },
    {
      id: '2',
      title: 'Seamless Integration',
      quote: 'The API was easy to integrate and the dashboard provides great insights.',
      author: 'Rahul Gupta',
      role: 'CTO',
      company: 'Shopify Plus',
    },
    {
      id: '3',
      title: 'Excellent Customer Support',
      quote: 'Whenever we faced any issues, the support team was quick to respond.',
      author: 'Anita Desai',
      role: 'Engineering Lead',
      company: 'StyleBazaar',
    },
  ];

  return (
    <Box backgroundColor="surface.background.gray.subtle" padding="spacing.5" borderRadius="medium">
      <Carousel
        accessibilityLabel="Featured testimonials"
        autoPlay={true}
        carouselItemWidth={{ base: '100%', m: '80%' }}
        visibleItems={1}
        navigationButtonPosition="side"
        navigationButtonVariant="filled"
        shouldAddStartEndSpacing={true}
        scrollOverlayColor="surface.background.gray.intense"
        indicatorVariant="gray"
        showIndicators={true}
        data-analytics="featured-testimonials"
      >
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id}>
            <Card
              height="100%"
              padding="spacing.5"
              elevation="raised"
              backgroundColor="surface.background.white.normal"
            >
              <CardBody>
                <Heading size="medium" marginBottom="spacing.3">
                  {testimonial.title}
                </Heading>
                <Text marginBottom="spacing.4" size="large">
                  "{testimonial.quote}"
                </Text>
                <Text weight="semibold">{testimonial.author}</Text>
                <Text size="small">
                  {testimonial.role}, {testimonial.company}
                </Text>
              </CardBody>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default AutoPlayCarouselExample;
```

### Controlled Carousel with Custom Navigation

This example demonstrates a controlled carousel with custom external navigation buttons.

```tsx
import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  Card,
  CardBody,
  CardFooter,
  Box,
  Text,
  Heading,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@razorpay/blade/components';

const ControlledCarouselExample = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      id: '1',
      title: 'Increased Conversion Rate',
      quote: 'We saw a 35% increase in conversion after integrating Razorpay Checkout.',
      author: 'Priya Sharma',
      role: 'Product Manager',
      company: 'TechStart',
    },
    {
      id: '2',
      title: 'Seamless Integration',
      quote: 'The API was easy to integrate and the dashboard provides great insights.',
      author: 'Rahul Gupta',
      role: 'CTO',
      company: 'Shopify Plus',
    },
    {
      id: '3',
      title: 'Excellent Customer Support',
      quote: 'Whenever we faced any issues, the support team was quick to respond.',
      author: 'Anita Desai',
      role: 'Engineering Lead',
      company: 'StyleBazaar',
    },
  ];

  return (
    <Box backgroundColor="surface.background.gray.normal" padding="spacing.5" borderRadius="medium">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.4"
      >
        <Heading size="medium">Customer Stories</Heading>
        <Box display="flex" gap="spacing.3">
          <Button
            variant="secondary"
            icon={ChevronLeftIcon}
            onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
            isDisabled={activeSlide === 0}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            icon={ChevronRightIcon}
            iconPosition="right"
            onClick={() => setActiveSlide((prev) => Math.min(testimonials.length - 1, prev + 1))}
            isDisabled={activeSlide === testimonials.length - 1}
          >
            Next
          </Button>
        </Box>
      </Box>

      <Carousel
        accessibilityLabel="Controlled testimonial carousel"
        activeSlide={activeSlide}
        onChange={setActiveSlide}
        visibleItems={1}
        showIndicators={true}
        navigationButtonPosition="bottom"
        carouselItemWidth="100%"
      >
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={testimonial.id}>
            <Card height="100%" padding="spacing.5" elevation="raised">
              <CardBody>
                <Heading size="medium" marginBottom="spacing.3">
                  {testimonial.title}
                </Heading>
                <Text marginBottom="spacing.4" size="large">
                  "{testimonial.quote}"
                </Text>
                <Text weight="semibold">{testimonial.author}</Text>
                <Text size="small">
                  {testimonial.role}, {testimonial.company}
                </Text>
              </CardBody>
              <CardFooter marginTop="spacing.4">
                <Text size="small" color="text.subtle">
                  Testimonial {index + 1} of {testimonials.length}
                </Text>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default ControlledCarouselExample;
```

### Multi-Item Selectable Carousel

This example shows a carousel with multiple visible items and selectable items.

```tsx
import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  Box,
  Text,
  Heading,
  Card,
  CardBody,
  CreditCardIcon,
  UpiIcon,
  WalletIcon,
  NetbankingIcon,
  EmiIcon,
  PayLaterIcon,
} from '@razorpay/blade/components';

const MultiItemSelectableCarouselExample = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon },
    { id: 'upi', name: 'UPI', icon: UpiIcon },
    { id: 'wallet', name: 'Wallet', icon: WalletIcon },
    { id: 'netbanking', name: 'Netbanking', icon: NetbankingIcon },
    { id: 'emi', name: 'EMI', icon: EmiIcon },
    { id: 'paylater', name: 'Pay Later', icon: PayLaterIcon },
  ];

  const handleSelect = (id: string) => {
    setSelectedPayment(id === selectedPayment ? null : id);
  };

  return (
    <Box padding="spacing.5">
      <Heading size="medium" marginBottom="spacing.5">
        Payment Methods
      </Heading>

      <Carousel
        accessibilityLabel="Payment methods carousel"
        visibleItems={{ base: 1, s: 2, m: 3, l: 4 }}
        navigationButtonPosition="side"
        navigationButtonVariant="outlined"
        indicatorVariant="gray"
        carouselItemWidth={{ base: '80%', s: '45%', m: '30%', l: '22%' }}
        shouldAddStartEndSpacing={false}
        data-analytics="payment-methods-carousel"
      >
        {paymentMethods.map((method) => {
          const isSelected = selectedPayment === method.id;
          const Icon = method.icon;

          return (
            <CarouselItem key={method.id}>
              <Card
                height="100%"
                padding="spacing.4"
                elevation={isSelected ? 'raised' : 'lowRaised'}
                backgroundColor={
                  isSelected
                    ? 'surface.background.primary.subtle'
                    : 'surface.background.white.normal'
                }
                borderWidth="thin"
                borderStyle="solid"
                borderColor={isSelected ? 'border.primary' : 'border.secondary'}
                cursor="pointer"
                onClick={() => handleSelect(method.id)}
              >
                <CardBody>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    padding="spacing.3"
                    gap="spacing.3"
                  >
                    <Icon
                      size="large"
                      color={isSelected ? 'interactive.icon.primary.normal' : undefined}
                    />
                    <Text
                      weight={isSelected ? 'semibold' : 'normal'}
                      color={isSelected ? 'interactive.text.primary.normal' : undefined}
                    >
                      {method.name}
                    </Text>
                  </Box>
                </CardBody>
              </Card>
            </CarouselItem>
          );
        })}
      </Carousel>

      {selectedPayment && (
        <Box
          padding="spacing.4"
          backgroundColor="surface.background.gray.subtle"
          borderRadius="medium"
          marginTop="spacing.4"
        >
          <Text>
            Selected payment method: {paymentMethods.find((m) => m.id === selectedPayment)?.name}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default MultiItemSelectableCarouselExample;
```

### Auto-Playing Product Carousel

This example demonstrates an auto-playing carousel with custom styling and responsive sizing.

```tsx
import React from 'react';
import { Carousel, CarouselItem, Box, Text, Card, CardBody } from '@razorpay/blade/components';

const AutoPlayProductCarouselExample = () => {
  const products = [
    { id: 1, name: 'Premium Plan', description: 'Our most popular plan' },
    { id: 2, name: 'Enterprise Solution', description: 'For large organizations' },
    { id: 3, name: 'Starter Package', description: 'Perfect for small businesses' },
    { id: 4, name: 'Custom Solution', description: 'Tailored to your needs' },
    { id: 5, name: 'Mobile Package', description: 'Optimize for mobile payments' },
  ];

  return (
    <Box padding="spacing.5">
      <Carousel
        accessibilityLabel="Featured products"
        autoPlay={true}
        carouselItemWidth={{ base: '85%', m: '40%', l: '30%' }}
        visibleItems="autofit"
        shouldAddStartEndSpacing={true}
        navigationButtonPosition="bottom"
        showIndicators={true}
      >
        {products.map((product, index) => (
          <CarouselItem key={product.id}>
            <Card
              height="180px"
              backgroundColor={
                index % 2 === 0
                  ? 'surface.background.primary.subtle'
                  : 'surface.background.gray.normal'
              }
            >
              <CardBody>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Text weight="semibold" size="large">
                    {product.name}
                  </Text>
                  <Text marginTop="spacing.2">{product.description}</Text>
                </Box>
              </CardBody>
            </Card>
          </CarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default AutoPlayProductCarouselExample;
```
