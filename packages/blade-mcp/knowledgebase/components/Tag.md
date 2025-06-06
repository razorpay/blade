## Component Name

Tag

## Description

The Tag component displays interactive keywords that help organize and categorize objects. Tags can be added or removed from an object by users. They appear as small, dismissible pill-shaped elements with optional icons and are commonly used to represent selected items in interfaces.

## TypeScript Types

These types represent the props that the Tag component accepts.

```typescript
// Main Tag component props
type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * Leading icon for your Tag
   */
  icon?: IconComponent;

  /**
   * Callback when close icon on Tag is clicked
   */
  onDismiss: () => void;

  /**
   * Text that renders inside Tag
   */
  children: StringChildrenType;

  /**
   * Disable tag
   */
  isDisabled?: boolean;

  /**
   * Private property for Blade.
   *
   * Should not be used by consumers.
   *
   * Used for adding virtual focus on tag.
   *
   * @private
   */
  _isVirtuallyFocused?: boolean;

  /**
   * Private property for Blade.
   *
   * Should not be used by consumers.
   *
   * Is tag placed inside an input
   *
   * @private
   */
  _isTagInsideInput?: boolean;
} & StyledPropsBlade &
  DataAnalyticsAttribute &
  TestID;
```

## Example

### Basic Usage

This example shows the simplest implementation of a Tag component with an icon and dismiss functionality.

```tsx
import React from 'react';
import { Tag, FileTextIcon } from '@razorpay/blade/components';

function BasicTagExample() {
  const [isTagVisible, setIsTagVisible] = React.useState(true);

  return (
    <>
      {isTagVisible ? (
        <Tag
          icon={FileTextIcon}
          onDismiss={() => {
            console.log('Unpaid Tag dismissed');
            setIsTagVisible(false);
          }}
        >
          Unpaid
        </Tag>
      ) : null}
    </>
  );
}
```

### Disabled Tag

This example demonstrates a Tag in its disabled state, where the dismiss functionality is visually indicated as unavailable but still defined in the code.

```tsx
import React from 'react';
import { Tag, FileTextIcon } from '@razorpay/blade/components';

function DisabledTagExample() {
  const [isTagVisible, setIsTagVisible] = React.useState(true);

  return (
    <>
      {isTagVisible ? (
        <Tag
          icon={FileTextIcon}
          isDisabled={true}
          onDismiss={() => {
            console.log('Disabled Tag dismissed');
            setIsTagVisible(false);
          }}
        >
          Disabled Tag
        </Tag>
      ) : null}
    </>
  );
}
```

### Different Size Tags

This example shows both medium and large Tag sizes side by side for comparison, each with their own dismiss handlers.

```tsx
import React from 'react';
import { Tag, Box, FileTextIcon } from '@razorpay/blade/components';

function TagSizesExample() {
  const [mediumTagVisible, setMediumTagVisible] = React.useState(true);
  const [largeTagVisible, setLargeTagVisible] = React.useState(true);

  return (
    <Box display="flex" gap="spacing.4" alignItems="center">
      {mediumTagVisible ? (
        <Tag size="medium" icon={FileTextIcon} onDismiss={() => setMediumTagVisible(false)}>
          Medium Tag
        </Tag>
      ) : null}

      {largeTagVisible ? (
        <Tag size="large" icon={FileTextIcon} onDismiss={() => setLargeTagVisible(false)}>
          Large Tag
        </Tag>
      ) : null}
    </Box>
  );
}
```

### Tag Group with Input

This example demonstrates how to implement a tag input system where users can add new tags through a text input and remove existing tags by clicking their dismiss buttons.

```tsx
import React from 'react';
import { Tag, Box, TextInput, Button, PlusIcon } from '@razorpay/blade/components';

function TagInputExample() {
  const [inputValue, setInputValue] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const addTag = (): void => {
    // Add input value to tags and clear the input value
    if (inputValue) {
      setTags([...tags, inputValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagName: string): void => {
    setTags(tags.filter((tagNameValue) => tagNameValue !== tagName));
  };

  return (
    <Box>
      <Box paddingY="spacing.4">
        {tags.map((tagName) => (
          <Tag key={tagName} marginRight="spacing.2" onDismiss={() => removeTag(tagName)}>
            {tagName}
          </Tag>
        ))}
      </Box>

      <Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTag();
          }}
        >
          <TextInput
            label="Tag Label"
            value={inputValue}
            onChange={({ value }) => setInputValue(value ?? '')}
          />
          <Button
            icon={PlusIcon}
            iconPosition="right"
            variant="secondary"
            marginTop="spacing.2"
            type="submit"
          >
            Create Tag
          </Button>
        </form>
      </Box>
    </Box>
  );
}
```

### Comprehensive Example

This advanced example shows a complete tag management system with different tag states, icons, and interactive features including adding new tags, toggling disabled states, and random tag removal.

```tsx
import React from 'react';
import {
  Tag,
  Box,
  Text,
  TextInput,
  Button,
  PlusIcon,
  FileTextIcon,
  TagIcon,
  CalendarIcon,
  BellIcon,
} from '@razorpay/blade/components';

function ComprehensiveTagExample() {
  // State for managing tags
  const [tags, setTags] = React.useState<
    Array<{
      id: string;
      text: string;
      icon?: React.ComponentType<any>;
      isDisabled?: boolean;
    }>
  >([
    { id: '1', text: 'Unpaid', icon: FileTextIcon },
    { id: '2', text: 'Pending', icon: TagIcon },
    { id: '3', text: 'Completed', icon: CalendarIcon },
    { id: '4', text: 'Disabled', icon: BellIcon, isDisabled: true },
  ]);

  // State for adding new tags
  const [inputValue, setInputValue] = React.useState('');

  // Add a new tag
  const addTag = (): void => {
    if (inputValue) {
      setTags([
        ...tags,
        {
          id: String(Date.now()),
          text: inputValue,
        },
      ]);
      setInputValue('');
    }
  };

  // Remove a tag
  const removeTag = (tagId: string): void => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  // Toggle tag disabled state
  const toggleTagDisabled = (tagId: string): void => {
    setTags(tags.map((tag) => (tag.id === tagId ? { ...tag, isDisabled: !tag.isDisabled } : tag)));
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <Text size="medium" weight="semibold">
        Tag Management Example
      </Text>

      {/* Display all tags */}
      <Box display="flex" flexWrap="wrap" gap="spacing.3" alignItems="center">
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            icon={tag.icon}
            size="medium"
            isDisabled={tag.isDisabled}
            onDismiss={() => removeTag(tag.id)}
          >
            {tag.text}
          </Tag>
        ))}
      </Box>

      {/* Form to add new tags */}
      <Box marginTop="spacing.2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTag();
          }}
        >
          <TextInput
            label="Add New Tag"
            value={inputValue}
            onChange={({ value }) => setInputValue(value ?? '')}
            placeholder="Enter tag name"
          />
          <Button
            icon={PlusIcon}
            iconPosition="right"
            variant="secondary"
            marginTop="spacing.3"
            type="submit"
          >
            Add Tag
          </Button>
        </form>
      </Box>

      {/* Actions for existing tags */}
      {tags.length > 0 && (
        <Box marginTop="spacing.2">
          <Text size="small" marginBottom="spacing.3">
            Actions for selected tag:
          </Text>
          <Box display="flex" gap="spacing.3">
            <Button
              variant="tertiary"
              onClick={() => {
                if (tags.length > 0) {
                  const randomIndex = Math.floor(Math.random() * tags.length);
                  toggleTagDisabled(tags[randomIndex].id);
                }
              }}
            >
              Toggle Random Tag State
            </Button>

            <Button
              variant="tertiary"
              color="negative"
              onClick={() => {
                if (tags.length > 0) {
                  const randomIndex = Math.floor(Math.random() * tags.length);
                  removeTag(tags[randomIndex].id);
                }
              }}
            >
              Remove Random Tag
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
```
