# FormGroup

## Description

FormGroup is a pattern that provides a consistent way to build forms using Blade components. It offers structured layouts for form sections, proper spacing, validation handling, and responsive design. Use this pattern when you need to create forms with multiple input fields, validation states, different layouts (horizontal/vertical sections), and consistent spacing between form elements.

## Components Used

- Box
- TextInput
- TextArea
- PasswordInput
- SelectInput
- Dropdown
- DropdownOverlay
- ActionList
- ActionListItem
- Button
- Alert
- Toast
- ToastContainer
- Heading
- Text

## Example

### Simple Contact Form

A basic form with email and message fields, demonstrating the fundamental FormGroup structure with proper spacing and submission handling.

```tsx
import React, { useState } from 'react';
import {
  Box,
  TextInput,
  TextArea,
  Button,
  Heading,
  useToast,
  ToastContainer,
} from '@razorpay/blade/components';
import { ArrowRightIcon } from '@razorpay/blade/tokens';

const SimpleContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  });
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    toast.show({
      content: `Thanks for reaching out! Your message has been sent.`,
      color: 'positive',
      type: 'informational',
    });
    setFormData({ email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box padding="spacing.6" display="flex" flexDirection="column" gap="spacing.7">
        <ToastContainer />
        <Box>
          <Heading size="large">Contact Us</Heading>
          <Heading size="medium" weight="regular">
            We'd love to hear from you
          </Heading>
        </Box>

        <Box display="flex" flexDirection="column" gap="spacing.4">
          <TextInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={({ value }) => setFormData({ ...formData, email: value ?? '' })}
            placeholder="Enter your email"
          />

          <TextArea
            label="Message"
            name="message"
            value={formData.message}
            onChange={({ value }) => setFormData({ ...formData, message: value ?? '' })}
            numberOfLines={4}
            placeholder="Enter your message"
          />

          <Button isFullWidth type="submit" icon={ArrowRightIcon} iconPosition="right">
            Send Message
          </Button>
        </Box>
      </Box>
    </form>
  );
};
```

### Form with Validation and Error Handling

A comprehensive form demonstrating validation states, error messages, required fields, and both individual and grouped error handling approaches.

```tsx
import React, { useState } from 'react';
import { Box, TextInput, PasswordInput, Button, Alert, Heading } from '@razorpay/blade/components';
import { ArrowRightIcon } from '@razorpay/blade/tokens';

const ValidationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{
    type: 'positive' | 'negative';
    title: string;
    description: string;
  } | null>(null);

  const handleChange = (name: string, value: string | undefined): void => {
    setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    // Clear error when typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      setAlert({
        type: 'positive',
        title: 'Success!',
        description: 'Your form has been submitted successfully.',
      });
    } else {
      setAlert({
        type: 'negative',
        title: 'Form Submission Failed',
        description: 'Please fix the errors in the form and try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
        <Box>
          <Heading size="large">Welcome to Blade Example</Heading>
          <Heading size="medium" weight="regular">
            This is an example form built with Blade
          </Heading>
        </Box>

        {alert && (
          <Alert
            color={alert.type}
            title={alert.title}
            description={alert.description}
            emphasis="subtle"
            isDismissible
            onDismiss={() => setAlert(null)}
            isFullWidth
          />
        )}

        <Box display="flex" flexDirection="column" gap="spacing.4">
          <TextInput
            necessityIndicator="required"
            label="Email"
            name="email"
            value={formData.email}
            onChange={({ value }) => handleChange('email', value)}
            validationState={errors.email ? 'error' : 'none'}
            errorText={errors.email}
            placeholder="Enter your email"
          />
          <PasswordInput
            necessityIndicator="required"
            label="Password"
            name="password"
            value={formData.password}
            onChange={({ value }) => handleChange('password', value)}
            helpText="Should be more than 8 characters"
            validationState={errors.password ? 'error' : 'none'}
            errorText={errors.password}
            placeholder="Enter your password"
          />
          <Button isFullWidth type="submit" icon={ArrowRightIcon} iconPosition="right">
            Sign In
          </Button>
        </Box>
      </Box>
    </form>
  );
};
```

### Multi-Section Form with Layout Variants

A comprehensive form demonstrating horizontal and vertical section layouts, different label positions, density options, grid layouts, and dropdown integration.

```tsx
import React, { useState } from 'react';
import {
  Box,
  TextInput,
  TextArea,
  SelectInput,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  Button,
  Heading,
  Text,
  useToast,
  ToastContainer,
} from '@razorpay/blade/components';

const CITY_OPTIONS = [
  { title: 'Mumbai', value: 'mumbai' },
  { title: 'Pune', value: 'pune' },
  { title: 'Bangalore', value: 'bangalore' },
  { title: 'Mysore', value: 'mysore' },
];

const MultiSectionForm = () => {
  const [bankData, setBankData] = useState({
    bankName: '',
    branchName: '',
    branchNumber: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
    city: '',
    additionalInformation: '',
  });

  const toast = useToast();

  const handleChange = (field: string, value: string): void => {
    setBankData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    toast.show({
      content: 'Thanks for reaching out! Your form has been submitted successfully.',
      color: 'positive',
      type: 'informational',
    });
    setBankData({
      bankName: '',
      branchName: '',
      branchNumber: '',
      addressLine1: '',
      addressLine2: '',
      pinCode: '',
      city: '',
      additionalInformation: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap="spacing.8">
        <ToastContainer />
        <Box>
          <Heading size="large" weight="semibold">
            Bank Branch Form
          </Heading>
          <Text weight="regular" color="surface.text.gray.muted">
            Fill the following information to add a new branch of the bank
          </Text>
        </Box>

        <Box display="flex" flexDirection="column" gap="spacing.8">
          {/* General Details Section */}
          <Box display="flex" flexDirection="row" gap="spacing.5">
            <Box>
              <Heading size="medium">General Details</Heading>
              <Text weight="regular" color="surface.text.gray.muted">
                This is general subtext for a section
              </Text>
            </Box>

            <Box width="100%" display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Bank Name"
                name="bankName"
                value={bankData.bankName}
                onChange={({ value }) => handleChange('bankName', value ?? '')}
                labelPosition="top"
                helpText="Full name of the registered national bank"
                placeholder="State Bank of India"
              />
              <Box width="100%" display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.5">
                <TextInput
                  label="Branch Name"
                  name="branchName"
                  value={bankData.branchName}
                  onChange={({ value }) => handleChange('branchName', value ?? '')}
                  labelPosition="top"
                  helpText="Generally, it is location of your branch"
                  placeholder="A1 Block, Janakpuri"
                />

                <TextInput
                  label="Branch Number"
                  name="branchNumber"
                  value={bankData.branchNumber}
                  onChange={({ value }) => handleChange('branchNumber', value ?? '')}
                  labelPosition="top"
                  helpText="The 5-digit number, you can find it on your bank's cheque book"
                  placeholder="SBIN0011315"
                />
              </Box>
            </Box>
          </Box>

          {/* Address Details Section */}
          <Box display="flex" flexDirection="row" gap="spacing.5">
            <Box>
              <Heading size="medium">Address Details</Heading>
              <Text weight="regular" color="surface.text.gray.muted">
                This is general subtext for a section
              </Text>
            </Box>
            <Box width="100%" display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Address Line 1"
                name="addressLine1"
                value={bankData.addressLine1}
                onChange={({ value }) => handleChange('addressLine1', value ?? '')}
                labelPosition="top"
                placeholder="A1-240, Titan Towers, State Bank of India"
              />

              <TextInput
                label="Address Line 2"
                name="addressLine2"
                value={bankData.addressLine2}
                onChange={({ value }) => handleChange('addressLine2', value ?? '')}
                labelPosition="top"
                placeholder="A1 Janakpuri, Opposite Community Hall"
              />

              <Box width="100%" display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.5">
                <TextInput
                  label="Pin Code"
                  name="pinCode"
                  value={bankData.pinCode}
                  onChange={({ value }) => handleChange('pinCode', value ?? '')}
                  labelPosition="top"
                  placeholder="110018"
                />

                <Dropdown selectionType="single">
                  <SelectInput
                    label="City"
                    placeholder="Select City"
                    name="city"
                    onChange={({ values }) => handleChange('city', values[0] ?? '')}
                    labelPosition="top"
                  />
                  <DropdownOverlay>
                    <ActionList>
                      {CITY_OPTIONS.map((city) => (
                        <ActionListItem key={city.value} title={city.title} value={city.value} />
                      ))}
                    </ActionList>
                  </DropdownOverlay>
                </Dropdown>
              </Box>
            </Box>
          </Box>

          <TextArea
            label="Additional Information"
            name="additionalInformation"
            value={bankData.additionalInformation}
            onChange={({ value }) => handleChange('additionalInformation', value ?? '')}
            numberOfLines={4}
            placeholder="Enter any additional information"
          />
        </Box>

        <Box display="flex" gap="spacing.4" justifyContent="flex-end">
          <Button variant="tertiary" color="primary" size="medium">
            Discard
          </Button>
          <Button type="submit" variant="primary" color="primary" size="medium">
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};
```

### Form with Fixed Footer

A long form demonstrating fixed footer positioning with action buttons that remain visible during scrolling.

```tsx
import React, { useState } from 'react';
import {
  Box,
  TextInput,
  TextArea,
  Button,
  Heading,
  Text,
  useToast,
  ToastContainer,
} from '@razorpay/blade/components';

const LongFormWithFixedFooter = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
  });

  const toast = useToast();

  const handleChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    toast.show({
      content: 'Document has been saved successfully.',
      color: 'positive',
      type: 'informational',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap="spacing.8" paddingBottom="spacing.11">
        <ToastContainer />
        <Box>
          <Heading size="large" weight="semibold">
            Create Document
          </Heading>
          <Text weight="regular" color="surface.text.gray.muted">
            Fill out the form below to create a new document
          </Text>
        </Box>

        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInput
            label="Document Title"
            name="title"
            value={formData.title}
            onChange={({ value }) => handleChange('title', value ?? '')}
            placeholder="Enter document title"
          />

          <TextInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={({ value }) => handleChange('description', value ?? '')}
            placeholder="Enter a brief description"
          />

          <TextArea
            label="Content"
            name="content"
            value={formData.content}
            onChange={({ value }) => handleChange('content', value ?? '')}
            numberOfLines={15}
            placeholder="Enter the main content of your document"
          />
        </Box>

        <Box
          display="flex"
          gap="spacing.4"
          justifyContent="flex-end"
          backgroundColor="surface.background.gray.moderate"
          padding="spacing.4"
          position="fixed"
          bottom="spacing.0"
          right="spacing.4"
          width="100%"
          borderColor="surface.border.gray.muted"
          borderWidth="thin"
        >
          <Button variant="tertiary" color="primary" size="medium">
            Discard
          </Button>
          <Button type="submit" variant="primary" color="primary" size="medium">
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};
```
