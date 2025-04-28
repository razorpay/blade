## Component Name

StepGroup

## Description

StepGroup visualizes sequential processes with a consistent structure. It can be interactive, guiding users through steps, or function as a timeline for reference. The component supports both vertical and horizontal orientations, customizable progress states, and nested structures for complex workflows.

## TypeScript Types

Below are the TypeScript types that define the props that StepGroup and its subcomponents accept:

````typescript
// Main component props
type StepGroupProps = {
  /**
   * size of step group
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * orientation of step group
   *
   * @default vertical
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * children slot for StepItem components
   */
  children: React.ReactElement | React.ReactElement[];

  /**
   * Width of StepGroup. By default it takes the width of its items.
   */
  width?: BoxProps['width'];

  /**
   * minWidth prop of StepGroup
   */
  minWidth?: BoxProps['minWidth'];

  /**
   * maxWidth prop of StepGroup
   *
   * @default 100%
   */
  maxWidth?: BoxProps['maxWidth'];
} & StyledPropsBlade &
  DataAnalyticsAttribute &
  TestID;

// StepItem component props
type StepItemProps = {
  /**
   * title of StepItem
   */
  title: string;

  /**
   * color of StepItem title
   */
  titleColor?: `feedback.text.${FeedbackColors}.intense` | `surface.text.primary.normal`;

  /**
   * A string that renders in italic font. Made for adding timestamp values.
   *
   * ```jsx
   * timestamp="Thu, 11th Oct23 | 12:00pm"
   * ```
   */
  timestamp?: string;

  /**
   * Description of StepItem
   */
  description?: string;

  /**
   * Progress line of step. When its start only starting part is highlighted and rest is kept dotted
   *
   * @default full
   */
  stepProgress?: 'start' | 'end' | 'full' | 'none';

  /**
   * marker JSX slot. It can be StepItemIndicator or StepItemIcon
   *
   * ```jsx
   * marker={<StepItemIndicator color="positive" />}
   * marker={<StepItemIcon icon={CheckIcon} color="positive" />}
   * ```
   */
  marker?: React.ReactElement;

  /**
   * trailing slot for StepItem. Mostly meant for Badge
   */
  trailing?: React.ReactElement;

  /**
   * Controlled state of selected item
   */
  isSelected?: boolean;

  /**
   * State for disabling the step item
   */
  isDisabled?: boolean;

  /**
   * Anchor tag's href value. Turns StepItem into interactive item and render it as `<a>` tag
   */
  href?: LinkProps['href'];

  /**
   * Anchjor tag's taget value. Meant to be used alongside `href` prop
   */
  target?: LinkProps['target'];

  /**
   * StepItem's click handler. Turns StepItem into interactive item and render it as button tag
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Children slot for adding additional custom elements to item
   */
  children?: React.ReactNode;
} & DataAnalyticsAttribute;
````

## Example

### Basic Vertical StepGroup

```jsx
import {
  StepGroup,
  StepItem,
  StepItemIcon,
  StepItemIndicator,
  Badge,
  FileIcon,
  UserIcon,
  BriefcaseIcon,
  ClockIcon,
  HeartIcon,
  Box,
} from '@razorpay/blade/components';

function MyStepGroup() {
  return (
    <StepGroup orientation="vertical" size="medium">
      <StepItem
        title="Introduction"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
        marker={<StepItemIcon icon={FileIcon} color="positive" />}
      />
      <StepItem
        title="Personal Details"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Your Personal Details for onboarding"
        stepProgress="full"
        marker={<StepItemIcon icon={UserIcon} color="positive" />}
      />
      <StepItem
        title="Business Details"
        trailing={
          <Badge color="positive" size="medium">
            Received by our team
          </Badge>
        }
        stepProgress="full"
        marker={<StepItemIcon icon={BriefcaseIcon} color="positive" />}
      />
      <StepItem
        title="Needs Response"
        titleColor="feedback.text.notice.intense"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
        marker={<StepItemIcon icon={ClockIcon} color="notice" />}
      />
      <StepItem
        title="Complete Onboarding"
        marker={<StepItemIcon icon={HeartIcon} color="neutral" />}
        trailing={
          <Badge color="neutral" size="medium">
            Pending
          </Badge>
        }
      />
    </StepGroup>
  );
}
```

### Interactive StepGroup with Click Handlers

```jsx
import {
  StepGroup,
  StepItem,
  StepItemIndicator,
  Button,
  Box
} from '@razorpay/blade/components';
import { useState } from 'react';

function InteractiveStepGroup() {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const stepItems = [
    {
      title: 'Introduction',
      timestamp: 'Mon, 15th Oct'23 | 12:00pm',
      description: 'Introduction to Razorpay Payment Gateway',
    },
    {
      title: 'Personal Details',
      timestamp: 'Mon, 16th Oct'23 | 12:00pm',
      description: 'Fill your Personal Details for onboarding',
    },
    {
      title: 'Business Details',
      timestamp: 'Mon, 17th Oct'23 | 12:00pm',
      description: 'Fill your Business Details for onboarding',
      isDisabled: true,
    },
    {
      title: 'Complete Onboarding',
      timestamp: 'Mon, 20th Oct'23 | 12:00pm',
      description: 'Complete your onboarding to start',
    },
  ];

  return (
    <Box>
      <StepGroup orientation="vertical" size="medium">
        {stepItems.map((stepInfo, index) => (
          <StepItem
            key={`${stepInfo.title}-${index}`}
            isSelected={selectedIndex === index}
            marker={<StepItemIndicator color={selectedIndex === index ? 'primary' : 'neutral'} />}
            onClick={() => setSelectedIndex(index)}
            stepProgress={index === selectedIndex ? 'start' : index < selectedIndex ? 'full' : 'none'}
            {...stepInfo}
          />
        ))}
      </StepGroup>

      {selectedIndex >= 0 && (
        <Box marginTop="spacing.8">
          <Button size="medium" variant="primary">
            Continue to Next Step
          </Button>
        </Box>
      )}
    </Box>
  );
}
```

### Nested StepGroup with Collapsible Sections

```jsx
import {
  StepGroup,
  StepItem,
  StepItemIcon,
  StepItemIndicator,
  Badge,
  Box,
  Button,
  Collapsible,
  CollapsibleBody,
  CollapsibleLink,
  RazorpayIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@razorpay/blade/components';
import { useState } from 'react';

function NestedStepGroup() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <StepGroup orientation="vertical" size="medium" width="100%" maxWidth="600px">
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Disputes Under Review"
        trailing={
          <Badge color="positive" size="medium">
            Received by our team
          </Badge>
        }
        stepProgress="full"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepGroup>
        <StepItem
          title="Review from Razorpay Team"
          timestamp="Fri, 12th Oct'23 | 12:00pm"
          description="The dispute is reviewed by Razorpay team"
          stepProgress="full"
          marker={<StepItemIcon icon={RazorpayIcon} color="positive" />}
        />
      </StepGroup>

      <StepItem
        title="Needs Response"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
        marker={<StepItemIndicator color="positive" />}
      />

      <Collapsible
        onExpandChange={({ isExpanded: newIsExpanded }) => setIsExpanded(newIsExpanded)}
        direction="top"
      >
        <CollapsibleLink>{isExpanded ? 'Hide Details' : 'Show Details'}</CollapsibleLink>
        <CollapsibleBody>
          <StepGroup>
            <StepItem
              title="Personal Documents Submission"
              marker={<StepItemIndicator color="positive" />}
              stepProgress="full"
            />
            <StepItem
              title="Company Documents Submission"
              titleColor="feedback.text.notice.intense"
              marker={<StepItemIndicator color="notice" />}
              stepProgress="start"
            >
              <Button size="medium" variant="secondary">
                Submit Documents
              </Button>
            </StepItem>
            <StepItem
              title="Documents Approval"
              trailing={
                <Badge color="neutral" size="medium">
                  Pending
                </Badge>
              }
            />
          </StepGroup>
        </CollapsibleBody>
      </Collapsible>

      <StepItem
        title="Decision from the Bank"
        trailing={
          <Badge color="neutral" size="medium">
            Pending
          </Badge>
        }
      />
    </StepGroup>
  );
}
```

### Horizontal StepGroup

```jsx
import { StepGroup, StepItem, StepItemIndicator, Box } from '@razorpay/blade/components';

function HorizontalStepGroup() {
  return (
    <Box width="100%">
      <StepGroup orientation="horizontal" size="medium">
        <StepItem
          title="Introduction"
          stepProgress="full"
          marker={<StepItemIndicator color="positive" />}
        />
        <StepItem
          title="Personal Details"
          stepProgress="full"
          marker={<StepItemIndicator color="positive" />}
        />
        <StepItem
          title="Business Details"
          stepProgress="start"
          marker={<StepItemIndicator color="primary" />}
          isSelected={true}
        />
        <StepItem title="Document Verification" marker={<StepItemIndicator color="neutral" />} />
        <StepItem title="Complete Onboarding" marker={<StepItemIndicator color="neutral" />} />
      </StepGroup>
    </Box>
  );
}
```
