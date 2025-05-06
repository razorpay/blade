# ActionList

## Component Name

ActionList

## Description

ActionList contains a list of actionable items that can be used to perform particular actions. It can be used inside Dropdowns, BottomSheets, or as selectable items when combined with SelectInput. ActionList provides a consistent UI pattern for presenting a menu of options with optional icons, badges, and various customization options.

## TypeScript Types

Below are the props that the ActionList component and its subcomponents accept. These types define all possible properties you can use when implementing ActionList in your application.

```typescript
type ActionListProps = {
  /**
   * ActionList components (ActionListItem or ActionListSection)
   */
  children: React.ReactNode[];
  /**
   * Whether to use virtualized list rendering for performance with large lists
   */
  isVirtualized?: boolean;
} & TestID &
  DataAnalyticsAttribute;

type ActionListItemProps = {
  /**
   * Text to display for the item
   */
  title: string;
  /**
   * Additional information displayed below the title
   */
  description?: string;
  /**
   * Function called when item is clicked
   */
  onClick?: (clickProps: {
    name: string;
    value?: boolean;
    event: Platform.Select<{
      web: React.MouseEvent;
      native: React.TouchEvent<TouchableOpacity>;
    }>;
  }) => void;
  /**
   * Value that you get from `onChange` event on SelectInput or in form submissions
   */
  value: string;
  /**
   * Link to open when item is clicked
   */
  href?: string;
  /**
   * HTML target of the link
   */
  target?: string;
  /**
   * Item that goes on left-side of item.
   * Valid elements - `<ActionListItemIcon />`, `<ActionListItemAsset />`, `<ActionListItemAvatar />`
   */
  leading?: React.ReactNode;
  /**
   * Item that goes on right-side of item.
   * Valid elements - `<ActionListItemText />`, `<ActionListItemIcon />`
   */
  trailing?: React.ReactNode;
  /**
   * Item that goes immediately next to the title.
   * Valid elements - `<ActionListItemBadge />`, `<ActionListItemBadgeGroup />`
   */
  titleSuffix?: React.ReactElement;
  /**
   * Whether the item is disabled
   */
  isDisabled?: boolean;
  /**
   * Visual color style - currently only supports 'negative'
   */
  intent?: Extract<FeedbackColors, 'negative'>;
  /**
   * Whether the item is selected
   */
  isSelected?: boolean;
} & TestID &
  DataAnalyticsAttribute;

type ActionListSectionProps = {
  /**
   * Section title text
   */
  title: string;
  /**
   * ActionListItem components within this section
   */
  children: React.ReactNode[] | React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

type ActionListItemAssetProps = {
  /**
   * Source of the image
   */
  src: string;
  /**
   * Alt tag for the image
   */
  alt: string;
};
```

## Examples

### Basic ActionList

A simple example showing how to use ActionList with different types of items.

```tsx
import {
  Box,
  ActionList,
  ActionListItem,
  ActionListSection,
  ActionListItemIcon,
  ActionListItemAsset,
  ActionListItemText,
  ActionListItemBadge,
  ActionListItemBadgeGroup,
  ActionListItemAvatar,
  LogOutIcon,
  SettingsIcon,
  DownloadIcon,
  BankIcon,
  UserIcon,
  ActivityIcon,
  TransactionsIcon,
} from '@razorpay/blade/components';

const ActionListExample = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" maxWidth="300px">
      {/* Basic ActionList with simple items */}
      <ActionList>
        {/* Basic item with just title */}
        <ActionListItem title="Profile" value="profile" />

        {/* Section with title to group related items */}
        <ActionListSection title="Account Management">
          {/* Item with icon and disabled state */}
          <ActionListItem
            leading={<ActionListItemIcon icon={SettingsIcon} />}
            title="Settings"
            value="settings"
            isDisabled={true}
          />
          {/* Item with icon */}
          <ActionListItem
            leading={<ActionListItemIcon icon={DownloadIcon} />}
            title="Download"
            value="download"
          />
          {/* Item with description */}
          <ActionListItem
            title="Credit"
            value="credit"
            leading={<ActionListItemIcon icon={UserIcon} />}
            description="Check your credit here!"
          />
        </ActionListSection>
        {/* Item with image asset */}
        <ActionListItem
          leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="India" />}
          title="Pricing"
          value="pricing"
        />
        {/* Item with href for navigation */}
        <ActionListItem
          title="Go to Home"
          value="home"
          href="https://razorpay.com"
          target="_blank"
        />
        {/* Item with click handler */}
        <ActionListItem
          title="Alert user"
          value="alert_user"
          onClick={({ name, value, event }) => {
            alert('Alert user is clicked!');
          }}
        />
        {/* Item with badges */}
        <ActionListItem
          title="Systems"
          value="systems"
          href="https://razorpay.com/careers"
          target="_blank"
          titleSuffix={
            <ActionListItemBadgeGroup>
              <ActionListItemBadge icon={ActivityIcon} color="information">
                unstable
              </ActionListItemBadge>
              <ActionListItemBadge>last updated: 2hr ago</ActionListItemBadge>
            </ActionListItemBadgeGroup>
          }
        />
        {/* Item with trailing text */}
        <ActionListItem
          title="Bank Settings"
          value="bank_settings"
          trailing={<ActionListItemText>⌘ + B</ActionListItemText>}
        />
        {/* Item with avatar */}
        <ActionListItem
          title="Profile"
          value="profile"
          leading={<ActionListItemAvatar icon={UserIcon} color="primary" name="John Doe" />}
        />

        {/* Item with negative intent for destructive actions */}
        <ActionListItem
          leading={<ActionListItemIcon icon={LogOutIcon} />}
          title="Log Out"
          value="logout"
          intent="negative"
        />
      </ActionList>
    </Box>
  );
};
```

### ActionList with Virtualization

When dealing with large lists, you can use the virtualization feature for better performance.

```tsx
import { Box, ActionList, ActionListItem, ActionListSection } from '@razorpay/blade/components';

const LargeActionListExample = () => {
  // Generate a large list of items
  const generateItems = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <ActionListItem key={index} title={`Item ${index + 1}`} value={`item-${index + 1}`} />
    ));
  };

  return (
    <Box backgroundColor="surface.background.gray.intense" height="300px">
      <ActionList isVirtualized={true}>
        <ActionListSection title="Large List">{generateItems(100)}</ActionListSection>
      </ActionList>
    </Box>
  );
};
```

### ActionList in Different Contexts

ActionList can be used in different contexts like Dropdowns and BottomSheets.

```tsx
import {
  Box,
  Dropdown,
  DropdownOverlay,
  DropdownHeader,
  DropdownFooter,
  SelectInput,
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  Button,
  HomeIcon,
  UserIcon,
  SettingsIcon,
} from '@razorpay/blade/components';

const ActionListInContextExample = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {/* ActionList in a Dropdown */}
      <Dropdown>
        <SelectInput label="Select Action" />
        <DropdownOverlay>
          <DropdownHeader title="Available Actions" />
          <ActionList>
            <ActionListItem
              title="Home"
              value="home"
              leading={<ActionListItemIcon icon={HomeIcon} />}
            />
            <ActionListItem
              title="Profile"
              value="profile"
              leading={<ActionListItemIcon icon={UserIcon} />}
            />
            <ActionListItem
              title="Settings"
              value="settings"
              leading={<ActionListItemIcon icon={SettingsIcon} />}
            />
          </ActionList>
          <DropdownFooter>
            <Button>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};
```
