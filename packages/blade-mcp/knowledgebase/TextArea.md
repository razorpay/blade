## Component Name

TextArea

## Description

TextArea is a component for collecting multi-line text input from users. It supports features like validation states, character counting, and tagging functionality. TextArea is ideal for comments, descriptions, bio information, and other long-form text content where users need more space than a single-line input field.

## TypeScript Types

The following types define the props that the TextArea component accepts. These types are essential for proper usage of the component in TypeScript projects.

```typescript
type TextAreaSizes = 'medium' | 'large';

type TextAreaCommonProps = {
  label?: string;
  accessibilityLabel?: string;
  labelPosition?: 'top' | 'left';
  necessityIndicator?: 'optional' | 'required';
  validationState?: 'none' | 'error' | 'success';
  helpText?: string;
  errorText?: string;
  successText?: string;
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  onChange?: ({ name, value }: { name?: string; value?: string }) => void;
  onFocus?: ({ name, value }: { name?: string; value?: string }) => void;
  onBlur?: ({ name, value }: { name?: string; value?: string }) => void;
  onSubmit?: ({ name, value }: { name?: string; value?: string }) => void;
  value?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  maxCharacters?: number;
  autoFocus?: boolean;
  numberOfLines?: 1 | 2 | 3 | 4 | 5;
  testID?: string;
  size?: TextAreaSizes;
  showClearButton?: boolean;
  onClearButtonClick?: () => void;
  onKeyDown?: ({
    name,
    value,
    event,
  }: {
    name?: string;
    value: string;
    event: React.KeyboardEvent;
  }) => void;
  isTaggedInput?: boolean;
  tags?: string[];
  onTagChange?: ({ tags }: { tags: string[] }) => void;
} & DataAnalyticsAttribute &
  StyledPropsBlade;

type TextAreaPropsWithA11yLabel = {
  label?: undefined;
  accessibilityLabel: string;
} & TextAreaCommonProps;

type TextAreaPropsWithLabel = {
  label: string;
  accessibilityLabel?: string;
} & TextAreaCommonProps;

type TextAreaProps = TextAreaPropsWithA11yLabel | TextAreaPropsWithLabel;
```

## Example

### Basic TextArea with Validation

This example shows a TextArea component with validation, character limit, and help text. It demonstrates how to handle validation states and provide user feedback.

```jsx
import { useState } from 'react';
import { TextArea } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [validationState, setValidationState] = useState('none');

  const handleChange = ({ value }) => {
    setFeedback(value || '');

    if ((value || '').length < 10) {
      setValidationState('error');
    } else if ((value || '').length > 500) {
      setValidationState('error');
    } else {
      setValidationState('success');
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <TextArea
        label="Your Feedback"
        placeholder="Please share your thoughts about our service"
        name="feedback"
        value={feedback}
        onChange={handleChange}
        numberOfLines={3}
        maxCharacters={500}
        validationState={validationState}
        helpText="Your feedback helps us improve our services"
        errorText={
          feedback.length < 10
            ? 'Feedback must be at least 10 characters'
            : 'Feedback must be less than 500 characters'
        }
        successText="Thank you for your detailed feedback"
        showClearButton={true}
        size="medium"
        necessityIndicator="required"
        data-analytics-section="feedback-form"
        data-analytics-component="text-area"
        marginBottom="spacing.4"
      />
    </Box>
  );
}
```

### TextArea with Various Feature Combinations

This example demonstrates TextArea with different configurations including label position, disabled state, and custom styling.

```jsx
import { TextArea } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function ProductDescriptionEditor() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <TextArea
        label="Product Description"
        labelPosition="left"
        placeholder="Enter a detailed description of the product"
        name="description"
        defaultValue="This premium product offers high quality materials and exceptional durability."
        numberOfLines={4}
        maxCharacters={1000}
        showClearButton={true}
        size="large"
        marginBottom="spacing.3"
        data-analytics-field="product-description"
      />

      <TextArea
        label="Short Summary"
        placeholder="Enter a short summary (will appear in search results)"
        name="summary"
        maxCharacters={150}
        necessityIndicator="optional"
        helpText="Keep it concise and highlight key features"
        numberOfLines={2}
        marginBottom="spacing.3"
        data-analytics-field="product-summary"
      />

      <TextArea
        label="Internal Notes"
        placeholder="These notes are only visible to team members"
        name="internalNotes"
        isDisabled={true}
        defaultValue="This product is scheduled for a price adjustment next quarter."
        helpText="Disabled until approval process is complete"
        data-analytics-field="internal-notes"
      />
    </Box>
  );
}
```

### TextArea Without Visible Label

This example shows a TextArea without a visible label but with proper accessibility support using the accessibilityLabel prop.

```jsx
import { TextArea } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function SearchQueryBuilder() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="spacing.5"
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
    >
      <TextArea
        accessibilityLabel="Advanced Search Query"
        placeholder="Enter your search query using operators like AND, OR, NOT"
        name="searchQuery"
        numberOfLines={3}
        helpText="Example: payment AND (failed OR declined) NOT refunded"
        showClearButton={true}
        data-analytics-field="advanced-search"
        marginBottom="spacing.0"
      />
    </Box>
  );
}
```

### Tagged TextArea for Multiple Entries

This example demonstrates a TextArea with tagging functionality, allowing users to enter multiple distinct items.

```jsx
import { useState } from 'react';
import { TextArea } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';

function EmailInviter() {
  const [emails, setEmails] = useState(['john.doe@example.com']);

  const handleTagChange = ({ tags }) => {
    setEmails(tags);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Determine if all emails are valid
  const allEmailsValid = emails.every(isValidEmail);

  return (
    <Box width="100%">
      <TextArea
        label="Invite Team Members"
        placeholder="Type an email address and press Enter to add"
        name="teamEmails"
        isTaggedInput={true}
        tags={emails}
        onTagChange={handleTagChange}
        numberOfLines={3}
        helpText="Separate multiple email addresses with Enter"
        validationState={allEmailsValid ? 'success' : 'error'}
        errorText="Please enter valid email addresses"
        successText={`${emails.length} valid email${emails.length !== 1 ? 's' : ''} added`}
        showClearButton={true}
        data-analytics-section="team-invites"
        data-analytics-action="add-email"
        position="relative"
        zIndex={1}
      />
    </Box>
  );
}
```

### TextArea with Custom Key Handling

This example shows how to implement custom keyboard behavior, like submitting on Enter or formatting text.

```jsx
import { useState } from 'react';
import { TextArea } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { Button } from '@razorpay/blade/components';

function MessageComposer() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleChange = ({ value }) => {
    setMessage(value || '');
  };

  const handleKeyDown = ({ event, value }) => {
    // Submit on Shift+Enter, normal Enter creates a new line
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      if (value.trim()) {
        setMessages([...messages, value]);
        setMessage('');
      }
    }
  };

  const handleSubmit = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.2"
        padding="spacing.3"
        backgroundColor="surface.background.gray.subtle"
        borderRadius="medium"
        maxHeight="200px"
        overflow="auto"
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            padding="spacing.3"
            backgroundColor="surface.background.gray.intense"
            borderRadius="medium"
          >
            {msg}
          </Box>
        ))}
      </Box>

      <Box display="flex" gap="spacing.3" alignItems="flex-end">
        <Box flexGrow={1}>
          <TextArea
            label="Message"
            placeholder="Type your message (Shift+Enter to send)"
            name="message"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            numberOfLines={2}
            showClearButton={true}
            data-analytics-action="compose-message"
          />
        </Box>
        <Button onClick={handleSubmit}>Send</Button>
      </Box>
    </Box>
  );
}
```
