import React, { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { FormGroupStoryCode } from './code';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Button } from '~components/Button';
import { TextInput } from '~components/Input/TextInput';
import { TextArea } from '~components/Input/TextArea';
import { ArrowRightIcon } from '~components/Icons';
import { Sandbox } from '~utils/storybook/Sandbox';
import type { BoxProps } from '~components/Box';
import { getBoxArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Alert } from '~components/Alert';
import { PasswordInput } from '~components/Input/PasswordInput';
import { useToast, ToastContainer } from '~components/Toast';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { SelectInput } from '~components/Input/DropdownInputTriggers/SelectInput';
import type { SpacingValueType } from '~components/Box/BaseBox';
import { useIsMobile } from '~utils/useIsMobile';

export default {
  title: 'Patterns/FormGroup',
  component: Box,
  args: {},
  tags: ['autodocs'],
  argTypes: getBoxArgTypes(),
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="FormGroup is a pattern that provides a consistent way to build forms using Blade components."
          componentName="FormGroup"
        >
          <Heading size="large">Usage</Heading>
          <Sandbox editorHeight={500}>{FormGroupStoryCode}</Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<BoxProps>;

const SimpleFormTemplate: StoryFn<typeof Box> = ({ ...args }): JSX.Element => {
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
      <Box padding="spacing.6" display="flex" flexDirection="column" gap="spacing.7" {...args}>
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

export const SimpleForm = SimpleFormTemplate.bind({});

const ValidationFormTemplate: StoryFn<{
  errorState?: 'individual' | 'grouped';
  initialErrors?: boolean;
}> = (props): JSX.Element => {
  const { errorState = 'grouped', initialErrors = false } = props;
  const [formData, setFormData] = React.useState({
    email: initialErrors ? 'invalid-email' : '',
    password: initialErrors ? 'short' : '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>(
    initialErrors
      ? {
          email: 'Invalid email format',
          password: 'Password must be at least 8 characters',
        }
      : {},
  );
  const [alert, setAlert] = React.useState<{
    type: 'positive' | 'negative';
    title: string;
    description: string;
  } | null>(
    initialErrors && errorState === 'grouped'
      ? {
          type: 'negative',
          title: 'Form Submission Failed',
          description: 'Please fix the errors in the form and try again.',
        }
      : null,
  );

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

        {errorState === 'grouped' && alert && (
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

export const WithValidation = ValidationFormTemplate.bind({});

const getSpacing = (
  density: 'normal' | 'comfortable',
  normal: SpacingValueType,
  comfortable: SpacingValueType,
): SpacingValueType => (density === 'comfortable' ? comfortable : normal);

const CITY_OPTIONS = [
  { title: 'Mumbai', value: 'mumbai' },
  { title: 'Pune', value: 'pune' },
  { title: 'Bangalore', value: 'bangalore' },
  { title: 'Mysore', value: 'mysore' },
];

type LayoutProps = BoxProps & {
  sectionsLayout?: 'horizontal' | 'vertical';
  labelPosition?: 'top' | 'left';
  density?: 'normal' | 'comfortable';
  longForm?: boolean;
};

const LayoutVariantsTemplate: StoryFn<LayoutProps> = (props: LayoutProps): JSX.Element => {
  const {
    sectionsLayout = 'vertical',
    labelPosition = 'top',
    density = 'normal',
    longForm = false,
  } = props;

  const initialBankData = {
    bankName: '',
    branchName: '',
    branchNumber: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
    city: '',
    additionalInformation: '',
  };

  const [bankData, setBankData] = useState(initialBankData);
  const isMobile = useIsMobile();
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

    setBankData(initialBankData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        gap={getSpacing(density, 'spacing.8', 'spacing.9')}
        paddingBottom={longForm ? 'spacing.11' : 'spacing.0'}
      >
        <ToastContainer />
        <Box>
          <Heading size="large" weight="semibold">
            Bank Branch Form
          </Heading>
          <Text weight="regular" color="surface.text.gray.muted">
            Fill the following information to add a new branch of the bank
          </Text>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap={getSpacing(density, 'spacing.8', 'spacing.9')}
        >
          {/* General Details Section */}
          <Box
            display="flex"
            flexDirection={sectionsLayout === 'horizontal' ? 'row' : 'column'}
            gap={getSpacing(density, 'spacing.5', 'spacing.6')}
          >
            <Box>
              <Heading size="medium">General Details</Heading>
              <Text weight="regular" color="surface.text.gray.muted">
                This is general subtext for a section
              </Text>
            </Box>

            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              gap={getSpacing(density, 'spacing.5', 'spacing.6')}
            >
              <TextInput
                label="Bank Name"
                name="bankName"
                value={bankData.bankName}
                onChange={({ value }) => handleChange('bankName', value ?? '')}
                labelPosition={labelPosition}
                helpText="Full name of the registered national bank"
                placeholder="State Bank of India"
              />
              <Box
                width="100%"
                display="grid"
                gridTemplateColumns={isMobile ? '1fr' : '1fr 1fr'}
                gap={getSpacing(density, 'spacing.5', 'spacing.6')}
              >
                <TextInput
                  label="Branch Name"
                  name="branchName"
                  value={bankData.branchName}
                  onChange={({ value }) => handleChange('branchName', value ?? '')}
                  labelPosition={labelPosition}
                  helpText="Generally, it is location of your branch"
                  placeholder="A1 Block, Janakpuri"
                />

                <TextInput
                  label="Branch Number"
                  name="branchNumber"
                  value={bankData.branchNumber}
                  onChange={({ value }) => handleChange('branchNumber', value ?? '')}
                  labelPosition={labelPosition}
                  helpText="The 5-digit number, you can find it on your bank's cheque book"
                  placeholder="SBIN0011315"
                />
              </Box>
            </Box>
          </Box>

          {/* Address Details Section */}
          <Box
            display="flex"
            flexDirection={sectionsLayout === 'horizontal' ? 'row' : 'column'}
            gap={getSpacing(density, 'spacing.5', 'spacing.6')}
          >
            <Box>
              <Heading size="medium">Address Details</Heading>
              <Text weight="regular" color="surface.text.gray.muted">
                This is general subtext for a section
              </Text>
            </Box>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              gap={getSpacing(density, 'spacing.5', 'spacing.6')}
            >
              <TextInput
                label="Address Line 1"
                name="addressLine1"
                value={bankData.addressLine1}
                onChange={({ value }) => handleChange('addressLine1', value ?? '')}
                labelPosition={labelPosition}
                placeholder="A1-240, Titan Towers, State Bank of India"
              />

              <TextInput
                label="Address Line 2"
                name="addressLine2"
                value={bankData.addressLine2}
                onChange={({ value }) => handleChange('addressLine2', value ?? '')}
                labelPosition={labelPosition}
                placeholder="A1 Janakpuri, Opposite Community Hall"
              />

              <Box
                width="100%"
                display="grid"
                gridTemplateColumns={isMobile ? '1fr' : '1fr 1fr'}
                gap={getSpacing(density, 'spacing.5', 'spacing.6')}
              >
                <TextInput
                  label="Pin Code"
                  name="pinCode"
                  value={bankData.pinCode}
                  onChange={({ value }) => handleChange('pinCode', value ?? '')}
                  labelPosition={labelPosition}
                  placeholder="110018"
                />

                <Dropdown selectionType="single">
                  <SelectInput
                    label="City"
                    placeholder="Select City"
                    name="action"
                    onChange={({ values }) => handleChange('city', values[0] ?? '')}
                    labelPosition={labelPosition}
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
          {longForm && (
            <TextArea
              label="Additional Information"
              name="additionalInformation"
              value={bankData.additionalInformation}
              onChange={({ value }) => handleChange('additionalInformation', value ?? '')}
              // @ts-expect-error - Using higher numberOfLines for scrolling behavior
              numberOfLines={15}
            />
          )}
        </Box>

        <Box
          display="flex"
          gap="spacing.4"
          justifyContent="flex-end"
          backgroundColor={longForm ? 'surface.background.gray.moderate' : 'transparent'}
          padding={longForm ? 'spacing.4' : 'spacing.0'}
          position={longForm ? 'fixed' : 'static'}
          bottom="spacing.0"
          right="spacing.4"
          width="100%"
          borderColor="surface.border.gray.muted"
          borderWidth={longForm ? 'thin' : 'none'}
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

// Layout variants
export const WithHorizontalSectionsTopLabel = LayoutVariantsTemplate.bind({});
WithHorizontalSectionsTopLabel.args = {
  sectionsLayout: 'horizontal',
  labelPosition: 'top',
};

export const WithVerticalSectionsTopLabel = LayoutVariantsTemplate.bind({});
WithVerticalSectionsTopLabel.args = {
  sectionsLayout: 'vertical',
  labelPosition: 'top',
};

export const WithVerticalSectionsLeftLabel = LayoutVariantsTemplate.bind({});
WithVerticalSectionsLeftLabel.args = {
  sectionsLayout: 'vertical',
  labelPosition: 'left',
};

// Spacers variants
export const WithNormalDensity = LayoutVariantsTemplate.bind({});
WithNormalDensity.args = {
  density: 'normal',
};

export const WithComfortableDensity = LayoutVariantsTemplate.bind({});
WithComfortableDensity.args = {
  density: 'comfortable',
};

// Error states
export const WithIndividualError = ValidationFormTemplate.bind({});
WithIndividualError.args = {
  errorState: 'individual',
  initialErrors: true,
};

export const WithGroupedError = ValidationFormTemplate.bind({});
WithGroupedError.args = {
  errorState: 'grouped',
  initialErrors: true,
};

// Long form Fixed footer
export const WithFixedFooter = LayoutVariantsTemplate.bind({});
WithFixedFooter.args = {
  longForm: true,
};
