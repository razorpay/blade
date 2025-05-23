## Component Name

Display

## Description

The Display component is designed for creating high-impact, eye-catching typography sections, particularly suited for landing pages. It renders with the largest text sizes in the typography system and automatically uses semantic h1 tags on web platforms. The component offers various sizes and weights with carefully crafted letter spacing, making it perfect for hero sections, banners, and other prominent content areas where visual impact is crucial.

## TypeScript Types

The following types define the props that the Display component accepts. These types help you understand what properties you can pass to customize the Display component's appearance and behavior.

```typescript
type DisplayProps = {
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * Overrides the color of the Display component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of title
   */
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  weight?: 'regular' | 'medium' | 'semibold';
  children: React.ReactNode;
  textAlign?: string;
  textDecorationLine?: string;
} & TestID &
  StyledPropsBlade;
```

## Example

Here's a comprehensive example showcasing the Display component's various features and props:

```tsx
import { Display, Box } from '@razorpay/blade/components';

function DisplayExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Hero section with largest display */}
      <Display
        size="xlarge"
        weight="semibold"
        color="surface.text.primary.normal"
        textAlign="center"
      >
        Transform Your Business
      </Display>

      {/* Feature highlight with mixed styles */}
      <Display size="large">
        Powerful{' '}
        <Display as="span" size="large" color="feedback.text.information.intense" weight="medium">
          Payment Solutions
        </Display>
      </Display>

      {/* Pricing section with emphasis */}
      <Display size="medium">
        Starting at just{' '}
        <Display as="span" size="medium" color="feedback.text.positive.intense">
          25% Off on Premium Plans
        </Display>
        <Display as="span" size="small" weight="regular">
          *
        </Display>
      </Display>

      {/* Call to action with custom alignment */}
      <Display size="small" weight="medium" textAlign="left" color="surface.text.primary.normal">
        Get Started Today
      </Display>

      {/* Multi-line display text with decoration */}
      <Display size="medium" textDecorationLine="underline" color="surface.text.gray.normal">
        Trusted by 10M+{' '}
        <Display as="span" size="medium" color="surface.text.primary.normal">
          Businesses
        </Display>
      </Display>
    </Box>
  );
}

export default DisplayExample;
```
