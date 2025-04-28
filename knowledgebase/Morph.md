## Component Name

Morph

## Description

The Morph component provides smooth animations for transitioning between different UI states. It's an abstraction of Framer Motion's layout animations, allowing elements to morph seamlessly from one state to another. This is particularly useful for creating fluid user experiences when elements need to change position, size, or appearance. Morph works best when animating between similar components or position changes, though complex transformations may sometimes cause distortions. It should be used inside framer-motion's AnimatePresence

## TypeScript Types

These types represent the props that the component accepts. When using the Morph component, you'll need to understand these types to properly configure the animation behavior.

```typescript
type MorphProps = {
  /**
   * The React element to be morphed.
   * This should be a single React element that will animate to/from another element with the same layoutId.
   */
  children: React.ReactElement;

  /**
   * A unique identifier to connect elements that should morph between each other.
   * Elements with the same layoutId will smoothly animate from one to the other when one is removed and the other is added.
   */
  layoutId: string;
};
```

## Example

### Basic Transformation Example

```tsx
import { Morph } from '@razorpay/blade/components';
import { Button, TextInput, Box, Link } from '@razorpay/blade/components';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

function ButtonToInputMorphExample() {
  const [showNameInput, setShowNameInput] = useState(false);

  return (
    <Box minHeight="100px">
      <AnimatePresence>
        {!showNameInput ? (
          <Morph layoutId="button-to-input-morph">
            <Button onClick={() => setShowNameInput(true)}>Click to Enter Name</Button>
          </Morph>
        ) : (
          <Morph layoutId="button-to-input-morph">
            <Box display="block" width="240px">
              <TextInput
                autoFocus
                accessibilityLabel="Name"
                placeholder="Enter your Name"
                trailingButton={
                  <Link onClick={() => setShowNameInput(false)} variant="button">
                    Submit
                  </Link>
                }
              />
            </Box>
          </Morph>
        )}
      </AnimatePresence>
    </Box>
  );
}
```

### Shape and Style Morphing

```tsx
import { Morph } from '@razorpay/blade/components';
import { Box, Button } from '@razorpay/blade/components';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

function ShapeMorphExample() {
  const [isCircle, setIsCircle] = useState(true);

  return (
    <Box>
      <Button marginBottom="spacing.4" onClick={() => setIsCircle(!isCircle)}>
        Toggle Shape
      </Button>

      <AnimatePresence>
        {isCircle ? (
          <Morph layoutId="shape-morph">
            <Box
              height="200px"
              width="200px"
              borderRadius="round"
              backgroundColor="surface.background.primary.intense"
            />
          </Morph>
        ) : (
          <Morph layoutId="shape-morph">
            <Box
              height="200px"
              width="200px"
              borderRadius="none"
              borderWidth="thick"
              borderColor="surface.border.gray.muted"
            />
          </Morph>
        )}
      </AnimatePresence>
    </Box>
  );
}
```

### Interactive Button State Change

```tsx
import { Morph } from '@razorpay/blade/components';
import { Button, Box } from '@razorpay/blade/components';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

function DangerousButtonMorphExample() {
  const [shouldConfirm, setShouldConfirm] = useState(false);

  return (
    <Box>
      <AnimatePresence>
        {shouldConfirm ? (
          <Morph layoutId="button-morph">
            <Button color="negative" onClick={() => setShouldConfirm(false)}>
              Confirm Deletion
            </Button>
          </Morph>
        ) : (
          <Morph layoutId="button-morph">
            <Button variant="secondary" onClick={() => setShouldConfirm(true)}>
              Delete This
            </Button>
          </Morph>
        )}
      </AnimatePresence>
    </Box>
  );
}
```
