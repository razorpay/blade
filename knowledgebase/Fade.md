## Component Name
Fade

## Description
The Fade component is a motion preset that animates the opacity of its children, allowing them to smoothly appear or disappear. It provides seamless transitions that enhance the user experience by softening abrupt content changes. Fade can be triggered by various interactions such as mounting, visibility changes, or viewport entry, making it versatile for creating engaging interfaces.

## TypeScript Types
The following types represent the props that the Fade component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Fade component
 */
type FadeProps = {
  /**
   * Content to be animated with fade effect
   */
  children: React.ReactNode;

  /**
   * Controls whether the element is visible (for controlled usage)
   */
  isVisible?: boolean;

  /**
   * Type of fade animation
   * @default 'inout'
   */
  type?: 'in' | 'out' | 'inout';

  /**
   * Events that trigger the motion animation
   * @default []
   */
  motionTriggers?: MotionTrigger[];

  /**
   * Whether to unmount the children when hidden
   * @default false
   */
  shouldUnmountWhenHidden?: boolean;
} & StyledPropsBlade & TestID;

/**
 * Motion triggers for animation components
 */
type MotionTrigger = 
  | 'hover' 
  | 'focus' 
  | 'press' 
  | 'mount'
  | 'in-view'
  | 'on-animate-interactions';

```

## Examples

### Controlled Fade Animation

This example demonstrates the controlled usage of the Fade component with a toggle button to show/hide content.

```tsx
import React, { useState } from 'react';
import { 
  Fade, 
  Box, 
  Button, 
  Card, 
  CardBody, 
  Heading, 
  Text 
} from '@razorpay/blade/components';

const ControlledFadeExample = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.8"
      borderRadius="medium"
      minHeight="300px"
    >
      <Button 
        marginBottom="spacing.4" 
        onClick={() => setIsVisible(!isVisible)}
        variant="secondary"
      >
        {isVisible ? 'Hide Content' : 'Show Content'}
      </Button>
      
      <Fade 
        isVisible={isVisible} 
        type="inout" 
        shouldUnmountWhenHidden={false}
      >
        <Card>
          <CardBody>
            <Heading size="medium" marginBottom="spacing.3">
              Fade Animation Demo
            </Heading>
            <Text>
              This content fades in and out when the toggle button is clicked.
              The shouldUnmountWhenHidden prop is set to false, so the component
              remains in the DOM even when hidden.
            </Text>
          </CardBody>
        </Card>
      </Fade>
    </Box>
  );
};

export default ControlledFadeExample;
```

### Viewport-Triggered Fade Animation

This example shows how to trigger fade animations when elements enter the viewport, useful for creating scroll animations.

```tsx
import React from 'react';
import { 
  Fade, 
  Box, 
  Card, 
  CardBody, 
  Heading, 
  Text 
} from '@razorpay/blade/components';

const ViewportFadeExample = () => {
  return (
    <Box
      maxHeight="400px"
      overflow="auto"
      padding="spacing.6"
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
    >
      {/* Spacer to enable scrolling */}
      <Box height="700px" display="flex" alignItems="center" justifyContent="center">
        <Text size="large" weight="semibold">Scroll down to see the fade effect</Text>
      </Box>
      
      {/* Content that fades in when scrolled into view */}
      <Fade 
        motionTriggers={['in-view']} 
        type="in"
      >
        <Card>
          <CardBody>
            <Heading size="medium" marginBottom="spacing.3">
              Appears on Scroll
            </Heading>
            <Text>
              This card fades in when it enters the viewport as you scroll down.
              The 'in-view' motion trigger activates the animation when the element
              becomes visible in the viewport.
            </Text>
          </CardBody>
        </Card>
      </Fade>
      
      {/* Additional space after the content */}
      <Box height="200px" />
    </Box>
  );
};

export default ViewportFadeExample;
```

### Page Transition with Routing

This example demonstrates using Fade for smooth transitions between routes in a single-page application.

```tsx
import React from 'react';
import { 
  Fade, 
  Card, 
  CardBody, 
  CardHeader, 
  CardHeaderLeading, 
  Box,
  Text 
} from '@razorpay/blade/components';
import { Route, Switch, useLocation } from 'react-router-dom';

const PageTransitionExample = () => {
  // Access location object to trigger fade on route changes
  const location = useLocation();
  
  return (
    <Box padding="spacing.4">
      <Switch location={location}>
        <Route path="/dashboard">
          <Fade key="dashboard" motionTriggers={['mount']} type="in">
            <Card>
              <CardHeader>
                <CardHeaderLeading 
                  title="Dashboard" 
                  subtitle="View your account summary" 
                />
              </CardHeader>
              <CardBody>
                <Text>
                  This is the dashboard page that fades in when navigated to.
                  Each route uses a Fade component to create a smooth transition effect.
                </Text>
              </CardBody>
            </Card>
          </Fade>
        </Route>
        
        <Route path="/profile">
          <Fade key="profile" motionTriggers={['mount']} type="in">
            <Card>
              <CardHeader>
                <CardHeaderLeading 
                  title="User Profile" 
                  subtitle="Manage your personal information" 
                />
              </CardHeader>
              <CardBody>
                <Text>
                  This is the profile page that fades in when navigated to.
                  Using a unique key with the Fade component ensures the animation
                  plays for each route change.
                </Text>
              </CardBody>
            </Card>
          </Fade>
        </Route>
        
        <Route path="/">
          <Fade key="home" motionTriggers={['mount']} type="in">
            <Card>
              <CardHeader>
                <CardHeaderLeading 
                  title="Home" 
                  subtitle="Welcome to the application" 
                />
              </CardHeader>
              <CardBody>
                <Text>
                  This is the home page with a fade-in animation.
                  The mount trigger ensures the content fades in when the route loads.
                </Text>
              </CardBody>
            </Card>
          </Fade>
        </Route>
      </Switch>
    </Box>
  );
};

export default PageTransitionExample;
```

### Working with Refs

This example shows how to use the Fade component with refs to maintain functionality like auto-focusing elements that appear.

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Fade, 
  Box, 
  Button, 
  TextInput 
} from '@razorpay/blade/components';

const FadeWithRefExample = () => {
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input when it becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);
  
  return (
    <Box minHeight="200px" padding="spacing.6">
      <Button 
        marginBottom="spacing.4" 
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide Form' : 'Show Form'}
      </Button>
      
      <Fade 
        isVisible={isVisible} 
        type="inout"
        shouldUnmountWhenHidden={true}
      >
        <TextInput
          ref={inputRef}
          label="Email Address"
          placeholder="Enter your email"
          helpText="This input is auto-focused when it appears"
        />
      </Fade>
    </Box>
  );
};

export default FadeWithRefExample;
``` 