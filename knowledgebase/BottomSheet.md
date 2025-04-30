## Component Name

BottomSheet

## Description

BottomSheet is a component commonly used in mobile applications to display additional information or actions without obstructing the main content of the screen. It slides up from the bottom of the viewport and can be configured with various heights through snap points. BottomSheet provides a structured layout with optional header, body, and footer sections, making it ideal for presenting forms, selection menus, and detailed information in a mobile-friendly interface.

## TypeScript Types

The following types represent the props that the BottomSheet component and its subcomponents accept. These types allow you to properly configure the bottom sheet according to your needs.

```typescript
/**
 * Props for the main BottomSheet component
 */
type BottomSheetProps = {
  /**
   * Controls whether the BottomSheet is opened
   */
  isOpen: boolean;

  /**
   * Callback function when the sheet is dismissed
   */
  onDismiss: () => void;

  /**
   * The content of the BottomSheet
   */
  children: React.ReactNode;

  /**
   * Array of numbers between 0 and 1 that define the height of the BottomSheet
   * Default is [0.35, 0.5, 0.85]
   */
  snapPoints?: number[];

  /**
   * Reference to the element that should receive focus when the BottomSheet opens
   * By default, focus is set to the close button
   */
  initialFocusRef?: React.RefObject<HTMLElement>;

  /**
   * The z-index value for the BottomSheet
   * @default 400
   */
  zIndex?: number;
} & TestID &
  DataAnalyticsAttribute;

/**
 * Props for the BottomSheetHeader component
 */
type BottomSheetHeaderProps = {
  /**
   * The title text of the BottomSheet
   */
  title?: string;

  /**
   * The subtitle text of the BottomSheet
   */
  subtitle?: string;

  /**
   * Element to be displayed next to the title
   * Accepts a Counter component
   */
  titleSuffix?: React.ReactNode;

  /**
   * Trailing element displayed on the right side of the header
   * Accepts one of Badge, Text, Button, Link
   */
  trailing?: React.ReactNode;

  /**
   * Whether to show a back button in the header
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Callback function when the back button is clicked
   */
  onBackButtonClick?: () => void;

  /**
   * Leading element displayed on the left side of the header
   */
  leading?: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

/**
 * Props for the BottomSheetBody component
 */
type BottomSheetBodyProps = {
  /**
   * The content of the BottomSheetBody
   */
  children: React.ReactNode;

  /**
   * Padding to be applied to the body
   * @default "spacing.5"
   */
  padding?: string;
} & TestID &
  DataAnalyticsAttribute;

/**
 * Props for the BottomSheetFooter component
 */
type BottomSheetFooterProps = {
  /**
   * The content of the BottomSheetFooter
   */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

/**
 * Type for data analytics attributes
 */
type DataAnalyticsAttribute = {
  /**
   * Data analytics attribute
   */
  'data-analytics'?: string;
};

/**
 * Type for test ID
 */
type TestID = {
  /**
   * ID used for testing
   */
  testID?: string;
};
```

## Example

Here are several examples demonstrating different uses of the BottomSheet component:

### Basic BottomSheet with Terms and Conditions

This example shows a basic BottomSheet with header, body, and footer sections used for displaying terms and conditions with an agreement checkbox.

```tsx
import React, { useState } from 'react';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Button,
  Box,
  Text,
  Checkbox,
} from '@razorpay/blade/components';

const TermsAndConditionsBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Terms & Conditions</Button>

      <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)} testID="terms-bottomsheet">
        <BottomSheetHeader title="Terms & Conditions" subtitle="Read carefully before accepting" />
        <BottomSheetBody>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas
            consequat, dolor vel lobortis ultrices, risus velit volutpat erat, ac pretium urna nibh
            sit amet magna. Donec tristique quam at lectus blandit, non eleifend dui dictum.
          </Text>
          <Text marginTop="spacing.3">
            Curabitur id neque vel metus tincidunt efficitur. Morbi vitae arcu lorem. Vivamus at
            tortor et metus placerat elementum vel ac neque. Nulla facilisi. Praesent vel dolor
            orci.
          </Text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Checkbox checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)}>
              I accept terms and conditions
            </Checkbox>
            <Button variant="primary" isDisabled={!termsAccepted} onClick={() => setIsOpen(false)}>
              Continue
            </Button>
          </Box>
        </BottomSheetFooter>
      </BottomSheet>
    </>
  );
};

export default TermsAndConditionsBottomSheet;
```

### Form with Custom Initial Focus

This example demonstrates a BottomSheet with form controls and custom initial focus reference, along with custom snap points.

```tsx
import React, { useRef, useState } from 'react';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Button,
  Box,
  Text,
  TextInput,
  ActionList,
  ActionListItem,
  ActionListItemIcon,
} from '@razorpay/blade/components';
import { CustomersIcon } from '@razorpay/blade/components';

const SearchUsersBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Search Users</Button>

      <BottomSheet
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        initialFocusRef={searchInputRef}
        snapPoints={[0.4, 0.7, 0.95]} // Custom snap points
      >
        <BottomSheetHeader
          title="Search Users"
          showBackButton
          onBackButtonClick={() => setIsOpen(false)}
        />
        <BottomSheetBody>
          <TextInput
            label="Search for users"
            placeholder="Type a name or email"
            ref={searchInputRef}
            marginBottom="spacing.5"
          />

          <Text
            variant="body"
            size="small"
            color="surface.text.gray.muted"
            marginBottom="spacing.3"
          >
            Recently viewed users
          </Text>

          <ActionList>
            <ActionListItem
              title="Anurag Hazra"
              value="user1"
              leading={<ActionListItemIcon icon={CustomersIcon} />}
            />
            <ActionListItem
              title="Kamlesh Chandnani"
              value="user2"
              leading={<ActionListItemIcon icon={CustomersIcon} />}
            />
            <ActionListItem
              title="Divyanshu Maithani"
              value="user3"
              leading={<ActionListItemIcon icon={CustomersIcon} />}
            />
          </ActionList>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </BottomSheetFooter>
      </BottomSheet>
    </>
  );
};

export default SearchUsersBottomSheet;
```

### Header Variants and Radio Selection

This example shows all possible header variants with title, subtitle, titleSuffix, trailing, and back button, along with radio button selection.

```tsx
import React, { useState } from 'react';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Button,
  Badge,
  Counter,
  Radio,
  RadioGroup,
} from '@razorpay/blade/components';

const AddressSelectionBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Select Address</Button>

      <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <BottomSheetHeader
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          titleSuffix={<Counter value={3} color="positive" />}
          trailing={<Badge color="positive">Action Needed</Badge>}
          showBackButton
          onBackButtonClick={() => setIsOpen(false)}
        />
        <BottomSheetBody>
          <RadioGroup
            label="Addresses"
            value={selectedAddress}
            onChange={({ value }) => setSelectedAddress(value)}
          >
            <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
            <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth variant="tertiary" marginBottom="spacing.3">
            Remove address
          </Button>
          <Button isFullWidth onClick={() => setIsOpen(false)}>
            Add address
          </Button>
        </BottomSheetFooter>
      </BottomSheet>
    </>
  );
};

export default AddressSelectionBottomSheet;
```

### Phone Verification Form with Validation

This example demonstrates a BottomSheet with form validation and error handling.

```tsx
import React, { useState } from 'react';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Button,
  Box,
  Text,
  TextInput,
  Link,
} from '@razorpay/blade/components';
import { ArrowRightIcon } from '@razorpay/blade/components';

const PhoneVerificationBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const handleVerify = () => {
    if (!phoneNumber) {
      setVerificationError('Please enter a phone number');
      return;
    }
    setVerificationError('');
    setIsOpen(false);
    // Handle verification logic here
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Verify Phone Number</Button>

      <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <BottomSheetHeader
          title="Verify Phone Number"
          showBackButton
          onBackButtonClick={() => setIsOpen(false)}
        />
        <BottomSheetBody>
          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            errorText={verificationError}
            validationState={verificationError ? 'error' : 'none'}
            marginBottom="spacing.5"
          />

          <Text variant="body" size="small" textAlign="center">
            By continuing, you agree to our <Link href="#">Terms of Service</Link> and{' '}
            <Link href="#">Privacy Policy</Link>
          </Text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Button isFullWidth icon={ArrowRightIcon} iconPosition="right" onClick={handleVerify}>
              Verify
            </Button>
            <Button isFullWidth variant="tertiary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Box>
        </BottomSheetFooter>
      </BottomSheet>
    </>
  );
};

export default PhoneVerificationBottomSheet;
```

### Integration with Dropdown

This example shows how to use BottomSheet with the Dropdown component.

```tsx
import React from 'react';
import {
  Dropdown,
  SelectInput,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  ActionList,
  ActionListItem,
  ActionListItemIcon,
} from '@razorpay/blade/components';
import { CustomersIcon, ClockIcon, ThumbsUpIcon } from '@razorpay/blade/components';

const DropdownWithBottomSheet = () => {
  return (
    <Dropdown selectionType="single">
      <SelectInput label="Sort Items" />
      <BottomSheet>
        <BottomSheetHeader title="Sort By" />
        <BottomSheetBody>
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={CustomersIcon} />}
              title="Relevance (Default)"
              value="relevance"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ClockIcon} />}
              title="Delivery Time"
              value="delivery-time"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ThumbsUpIcon} />}
              title="Rating"
              value="rating"
            />
          </ActionList>
        </BottomSheetBody>
      </BottomSheet>
    </Dropdown>
  );
};

export default DropdownWithBottomSheet;
```

### Stacked BottomSheets

This example demonstrates how to implement a multi-step flow using stacked BottomSheets.

```tsx
import React, { useState } from 'react';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Button,
  Box,
  ActionList,
  ActionListItem,
  ActionListSection,
  ActionListItemIcon,
} from '@razorpay/blade/components';
import {
  CustomersIcon,
  ClockIcon,
  ThumbsUpIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@razorpay/blade/components';

const StackedBottomSheets = () => {
  const [isFirstSheetOpen, setIsFirstSheetOpen] = useState(false);
  const [isSecondSheetOpen, setIsSecondSheetOpen] = useState(false);

  const openSecondSheet = () => {
    setIsFirstSheetOpen(false);
    setIsSecondSheetOpen(true);
  };

  const backToFirstSheet = () => {
    setIsSecondSheetOpen(false);
    setIsFirstSheetOpen(true);
  };

  return (
    <>
      <Button onClick={() => setIsFirstSheetOpen(true)}>Open Multi-step Flow</Button>

      {/* First sheet with sort options */}
      <BottomSheet isOpen={isFirstSheetOpen} onDismiss={() => setIsFirstSheetOpen(false)}>
        <BottomSheetHeader title="Sort Options" subtitle="Choose how to organize your data" />
        <BottomSheetBody>
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={CustomersIcon} />}
              title="Relevance (Default)"
              value="relevance"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ClockIcon} />}
              title="Delivery Time"
              value="delivery-time"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ThumbsUpIcon} />}
              title="Rating"
              value="rating"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={TrendingUpIcon} />}
              title="Cost: Low to High"
              value="cost-low-high"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={TrendingDownIcon} />}
              title="Cost: High to Low"
              value="cost-high-low"
            />
          </ActionList>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth onClick={openSecondSheet}>
            Next: Filter Options
          </Button>
        </BottomSheetFooter>
      </BottomSheet>

      {/* Second sheet with filter options */}
      <BottomSheet isOpen={isSecondSheetOpen} onDismiss={() => setIsSecondSheetOpen(false)}>
        <BottomSheetHeader title="Filter By Cuisines" />
        <BottomSheetBody>
          <ActionList>
            <ActionListSection title="Asia">
              <ActionListItem title="Chinese" value="Chinese" />
              <ActionListItem title="Indian" value="Indian" />
              <ActionListItem title="Thai" value="Thai" />
              <ActionListItem title="Japanese" value="Japanese" />
            </ActionListSection>

            <ActionListSection title="Europe">
              <ActionListItem title="Italian" value="Italian" />
              <ActionListItem title="French" value="French" />
              <ActionListItem title="Spanish" value="Spanish" />
            </ActionListSection>
          </ActionList>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Button isFullWidth onClick={() => setIsSecondSheetOpen(false)}>
              Apply Filters
            </Button>
            <Button isFullWidth variant="tertiary" onClick={backToFirstSheet}>
              Back to Sort Options
            </Button>
          </Box>
        </BottomSheetFooter>
      </BottomSheet>
    </>
  );
};

export default StackedBottomSheets;
```

### BottomSheet with Zero Padding

This example shows how to create a BottomSheet with zero padding for full-width content like images or banners.

```tsx
import React, { useState } from 'react';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Button,
  Box,
  Text,
  Heading,
} from '@razorpay/blade/components';

const ZeroPaddingBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Full-Width Content</Button>

      <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <BottomSheetHeader />
        <BottomSheetBody padding="spacing.0">
          <Box>
            {/* Full-width banner/image container */}
            <Box
              position="relative"
              height="200px"
              backgroundColor="surface.background.cloud.subtle"
              display="flex"
              alignItems="flex-end"
              padding="spacing.5"
            >
              <Heading size="large" color="surface.text.gray.normal">
                All-in-one Management Platform
              </Heading>
            </Box>

            {/* Content with padding */}
            <Box padding="spacing.5">
              <Text>
                We bring together all services in ONE place to deliver a seamless user experience
                for you. Work with our experts to ensure your transfers are always compliant, safe &
                effortless.
              </Text>
              <Text marginTop="spacing.3" color="surface.text.gray.muted">
                100% secure | Instant payouts | Unbeatable pricing
              </Text>
            </Box>
          </Box>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth>Talk To Our Experts</Button>
        </BottomSheetFooter>
      </BottomSheet>
    </>
  );
};

export default ZeroPaddingBottomSheet;
```
