## Component Name
Collapsible

## Description
Collapsible is a component that allows users to toggle the visibility of hidden content within a container. It provides an expandable/collapsible section that helps manage space efficiency in user interfaces. The component suite includes the main Collapsible container along with specialized trigger elements (CollapsibleButton, CollapsibleLink) and a content container (CollapsibleBody).

## TypeScript Types
The following types represent the props that the Collapsible component and its subcomponents accept. These allow you to properly configure the components according to your needs.

```typescript
/**
 * Props for the main Collapsible component
 */
type CollapsibleProps = {
  /**
   * Children of the Collapsible component should include a trigger element
   * (CollapsibleButton or CollapsibleLink) and a CollapsibleBody
   */
  children: React.ReactNode;

  /**
   * The default expanded state for uncontrolled usage
   * @default false
   */
  defaultIsExpanded?: boolean;

  /**
   * Direction in which the collapsible content expands
   * @default "bottom"
   */
  direction?: "top" | "bottom";

  /**
   * Whether the collapsible content is expanded (controlled mode)
   */
  isExpanded?: boolean;

  /**
   * Callback fired when the expanded state changes
   */
  onExpandChange?: (event: { isExpanded: boolean }) => void;
} & StyledPropsBlade & TestID;

/**
 * Props for the CollapsibleButton component
 */
type CollapsibleButtonProps = {
  /**
   * Content of the button
   */
  children: React.ReactNode;
} & StyledPropsBlade & TestID;

/**
 * Props for the CollapsibleLink component
 */
type CollapsibleLinkProps = {
  /**
   * Content of the link
   */
  children: React.ReactNode;
} & StyledPropsBlade & TestID;

/**
 * Props for the CollapsibleBody component
 */
type CollapsibleBodyProps = {
  /**
   * Content to be collapsed/expanded
   */
  children: React.ReactNode;
} & StyledPropsBlade & TestID;

/**
 * Type for test ID
 */
type TestID = {
  /**
   * ID used for testing
   */
  testID?: string;
};

/**
 * Styled props for blade components
 * Includes margin, padding, and other layout props
 */
type StyledPropsBlade = {
  // Various styling props like margin, padding, etc.
};
```

## Examples

### Basic Usage: Uncontrolled Collapsible with Button Trigger

```tsx
import React from 'react';
import {
  Collapsible,
  CollapsibleButton,
  CollapsibleBody,
  Text,
  Box
} from '@razorpay/blade/components';

const UncontrolledExample = () => {
  return (
    <Box maxWidth="500px">
      <Collapsible defaultIsExpanded={false}>
        <CollapsibleButton>
          Show More Information
        </CollapsibleButton>
        <CollapsibleBody>
          <Box padding="spacing.3">
            <Text>
              This is an uncontrolled Collapsible with a button trigger. 
              The component manages its own expanded state internally using defaultIsExpanded.
            </Text>
          </Box>
        </CollapsibleBody>
      </Collapsible>
    </Box>
  );
};

export default UncontrolledExample;
```

### Controlled Collapsible with Read More Pattern

```tsx
import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleLink,
  CollapsibleBody,
  Text,
  Box,
  Button
} from '@razorpay/blade/components';

const ControlledReadMoreExample = () => {
  // State for controlled collapsible
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  return (
    <Box maxWidth="500px">
      <Text marginBottom="spacing.3">
        Collapsible components are perfect for implementing the "Read more" pattern.
        This is useful for long text content where you want to show just a preview initially.
      </Text>
      
      <Collapsible 
        isExpanded={detailsExpanded} 
        onExpandChange={({ isExpanded }) => setDetailsExpanded(isExpanded)}
      >
        <CollapsibleLink>
          {detailsExpanded ? "Read less" : "Read more"}
        </CollapsibleLink>
        <CollapsibleBody>
          <Box padding="spacing.3">
            <Text>
              This is a controlled Collapsible with a link trigger. External state 
              management gives you complete control over the expanded state. Using 
              CollapsibleLink instead of CollapsibleButton gives a more natural
              link appearance that's appropriate for in-line text expansions. This pattern
              helps keep interfaces clean while still providing access to the full content
              when needed.
            </Text>
          </Box>
        </CollapsibleBody>
      </Collapsible>
    </Box>
  );
};

export default ControlledReadMoreExample;
```

### Direction Control: Top Expansion

```tsx
import React from 'react';
import {
  Collapsible,
  CollapsibleButton,
  CollapsibleBody,
  Text,
  Box
} from '@razorpay/blade/components';

const TopDirectionExample = () => {
  return (
    <Box 
      maxWidth="500px" 
      padding="spacing.4" 
      borderWidth="thin" 
      borderStyle="solid" 
      borderColor="border.normal"
    >
      <Text marginBottom="spacing.4">
        The content below will expand upward instead of downward.
      </Text>
      
      <Collapsible direction="top">
        <CollapsibleButton>
          Expand Upward
        </CollapsibleButton>
        <CollapsibleBody>
          <Box padding="spacing.3" marginBottom="spacing.3">
            <Text>
              This content expands upward using direction="top".
              Useful when you need to prevent pushing content below out of view.
            </Text>
          </Box>
        </CollapsibleBody>
      </Collapsible>
    </Box>
  );
};

export default TopDirectionExample;
```