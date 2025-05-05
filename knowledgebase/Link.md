## Component Name
Link

## Description
The Link component is used for navigating between pages or triggering in-page actions. It supports both anchor-style links for navigation and button-style links for actions. Links can be customized with different sizes, colors, and icon positions to match your design requirements, and they can be used standalone or inline within text content.

## TypeScript Types
The following types represent the props that the Link component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Link component
 */
type LinkProps = {
  /**
   * Content to be displayed in the link
   */
  children?: React.ReactNode;

  /**
   * URL that the link points to
   */
  href?: string;

  /**
   * Visual style of the link
   * @default 'anchor'
   */
  variant?: 'anchor' | 'button';

  /**
   * URL target attribute
   */
  target?: string;

  /**
   * URL rel attribute
   */
  rel?: string;

  /**
   * Color scheme for the link
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'neutral' | 'negative' | 'positive';

  /**
   * Size of the link text
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Icon to display with the link
   */
  icon?: React.ComponentType<IconProps>;

  /**
   * Position of the icon relative to text
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Whether the link is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Function called when the link is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
} & StyledPropsBlade & TestID;

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
};

```

## Examples

### Standard Link Usage

```tsx
import React from 'react';
import { 
  Box, 
  Heading, 
  Link, 
  InfoIcon, 
  DownloadIcon, 
  ArrowRightIcon
} from '@razorpay/blade/components';

const StandardLinkExample = () => {
  return (
    <Box padding="spacing.5">
      <Heading size="medium" marginBottom="spacing.5">Link Component</Heading>
      
      <Box display="flex" gap="spacing.4" flexWrap="wrap" alignItems="center">
        <Link 
          href="https://razorpay.com" 
          target="_blank" 
          rel="noopener noreferrer"
          icon={ArrowRightIcon}
          iconPosition="right"
          color="primary"
          size="medium"
          aria-label="Visit Razorpay website"
        >
          Razorpay Website
        </Link>

        <Link 
          href="#" 
          color="negative" 
          size="small"
          icon={InfoIcon}
          iconPosition="left"
        >
          Important Notice
        </Link>

        <Link 
          href="#" 
          variant="button" 
          icon={DownloadIcon}
          iconPosition="left"
          onClick={() => console.log('Download clicked')}
          size="large"
        >
          Download Report
        </Link>

        <Link 
          variant="button" 
          isDisabled={true}
          color="neutral"
          onClick={() => console.log('This will not be called')}
        >
          Unavailable Action
        </Link>
        
        <Link href="#" color="positive">Positive Link</Link>
        
        <Box 
          backgroundColor="surface.background.cloud.intense" 
          padding="spacing.3" 
          borderRadius="border.radius.4"
        >
          <Link href="#" color="white">White Link</Link>
        </Box>
        
        <Link 
          variant="button" 
          icon={InfoIcon}
          aria-label="Get more information"
          onClick={() => console.log('Info clicked')}
        />
        
        <Link 
          href="#"
          variant="anchor" 
          icon={DownloadIcon}
          aria-label="Download resources"
        />
      </Box>
    </Box>
  );
};

export default StandardLinkExample;
```

### Inline Link Usage

```tsx
import React from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  Link
} from '@razorpay/blade/components';

const InlineLinkExample = () => {
  return (
    <Box padding="spacing.5">
      <Heading size="medium" marginBottom="spacing.5">Inline Link Usage</Heading>
      
      <Box>
        <Text marginBottom="spacing.3">
          Read our <Link href="/terms" color="primary">Terms of Service</Link> and 
          <Link href="/privacy" color="primary" marginLeft="spacing.1">Privacy Policy</Link> for more information.
        </Text>
        
        <Text>
          Forgot your password? <Link variant="button" size="small">Reset it here</Link>
        </Text>
        
        <Text marginTop="spacing.3">
          For more details, please visit our <Link href="/help" icon={ArrowRightIcon} iconPosition="right">Help Center</Link> 
          or contact our <Link href="/support" variant="button" size="small" color="primary">Support Team</Link>.
        </Text>
      </Box>
    </Box>
  );
};

export default InlineLinkExample; 