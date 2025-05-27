import type { StoryFn, Meta } from '@storybook/react';
import type { InputGroupProps } from '../types';
import { InputGroup as InputGroupComponent } from '../InputGroup';
import { InputRow } from '../InputRow';
import { TextInput } from '~components/Input/TextInput';
import { DatePicker } from '~components/DatePicker';
import { Button } from '~components/Button';
import { Heading } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getBoxArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { InputGroupStoryCode } from './code';
import { Box } from '~components/Box';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList } from '~components/ActionList';
import { ActionListItem } from '~components/ActionList';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import React, { useState } from 'react';
import { useToast, ToastContainer } from '~components/Toast';

export default {
  title: 'Components/InputGroup',
  component: InputGroupComponent,
  tags: ['autodocs'],
  argTypes: getBoxArgTypes(),
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="InputGroup organizes related form inputs with consistent spacing and layout."
          componentName="InputGroup"
        >
          <Heading size="large">Usage</Heading>
          <Sandbox editorHeight={500}>{InputGroupStoryCode}</Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<InputGroupProps>;

const DefaultInputGroupTemplate: StoryFn<InputGroupProps> = (args) => (
  <InputGroupComponent {...args}>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Street Address" label="Street Address" />
    </InputRow>
    <InputRow templateColumns="2fr 1fr">
      <TextInput placeholder="City" label="City" />
      <TextInput placeholder="ZIP Code" label="ZIP Code" />
    </InputRow>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Country" label="Country" />
    </InputRow>
  </InputGroupComponent>
);

export const Default = DefaultInputGroupTemplate.bind({});
Default.args = {
  label: 'Shipping Address',
  helpText: 'Where should we deliver your order?',
};

const DetailedInputGroupTemplate: StoryFn<InputGroupProps> = (args) => (
  <InputGroupComponent {...args}>
    <InputRow templateColumns="1fr 1fr">
      <TextInput placeholder="First Name" label="First Name" />
      <TextInput placeholder="Last Name" label="Last Name" />
    </InputRow>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Street Address" label="Street Address" />
    </InputRow>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Street Address Line-2" label="Address Line 2" />
    </InputRow>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Apartment Name" label="Apartment Name" />
    </InputRow>
    <InputRow templateColumns="2fr 1fr 1fr">
      <TextInput placeholder="City" label="City" />
      <TextInput placeholder="State" label="State" />
      <TextInput placeholder="ZIP Code" label="ZIP Code" />
    </InputRow>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Country" label="Country" />
    </InputRow>
  </InputGroupComponent>
);

export const Detailed = DetailedInputGroupTemplate.bind({});
Detailed.args = {
  label: 'Billing Address',
  helpText: 'Complete address information required for billing',
};

const ComplexInputGroupTemplate: StoryFn<InputGroupProps> = (args) => (
  <Box>
    <InputGroupComponent {...args}>
      <InputRow templateColumns="1fr 1fr 1fr">
        <TextInput placeholder="First Name" label="First Name" />
        <TextInput placeholder="Middle Initial" label="Middle Initial" />
        <TextInput placeholder="Last Name" label="Last Name" />
      </InputRow>
      <InputRow templateColumns="2fr 1fr">
        <TextInput placeholder="Email Address" label="Email Address" />
        <TextInput placeholder="Phone" label="Phone" />
      </InputRow>
      <InputRow templateColumns="1fr">
        <DatePicker inputPlaceHolder="MM/DD/YYYY" label="Date of Birth" />
      </InputRow>
      <InputRow templateColumns="1fr">
        <TextInput placeholder="Street Address" label="Street Address" />
      </InputRow>
      <InputRow templateColumns="1fr">
        <TextInput placeholder="Address Line 2" label="Address Line 2" />
      </InputRow>
      <InputRow templateColumns="2fr 1fr 1fr">
        <TextInput placeholder="City" label="City" />
        <TextInput placeholder="State" label="State" />
        <TextInput placeholder="ZIP Code" label="ZIP Code" />
      </InputRow>
      <InputRow templateColumns="1fr 1fr">
        <TextInput placeholder="Role" label="Role" />
        <TextInput placeholder="Company" label="Company" />
      </InputRow>
      <InputRow templateColumns="1fr 1fr 1fr">
        <TextInput placeholder="University Name" label="University" />
        <TextInput placeholder="Degree" label="Degree" />
        <TextInput placeholder="Graduation Year" label="Graduation Year" />
      </InputRow>
      <InputRow templateColumns="1fr 1fr">
        <TextInput placeholder="Years of Experience" label="Experience (Years)" />
        <Dropdown selectionType="single">
          <SelectInput
            label="Employment Type"
            placeholder="Select Type"
            name="employment"
            onChange={({ name, values }) => {
              console.log({ name, values });
            }}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Full-time" value="fulltime" />
              <ActionListItem title="Part-time" value="parttime" />
              <ActionListItem title="Contract" value="contract" />
              <ActionListItem title="Freelance" value="freelance" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </InputRow>
      <InputRow templateColumns="1fr 1fr">
        <TextInput placeholder="Reference Name" label="Reference Name" />
        <TextInput placeholder="Reference Phone" label="Reference Phone" />
      </InputRow>
      <InputRow templateColumns="1fr">
        <TextInput placeholder="LinkedIn Profile URL" label="LinkedIn Profile" />
      </InputRow>
      <InputRow templateColumns="1fr">
        <TextInput
          placeholder="Additional skills, certifications, or notes"
          label="Additional Information"
        />
      </InputRow>
    </InputGroupComponent>
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box></Box>
      <Button variant="primary" marginTop="spacing.3">
        Submit Application
      </Button>
    </Box>
  </Box>
);

export const Complex = ComplexInputGroupTemplate.bind({});
Complex.args = {
  label: 'Job Application Form',
  helpText: 'Please fill out all required information',
};

const CompactInputGroupTemplate: StoryFn<InputGroupProps> = (args) => (
  <InputGroupComponent {...args}>
    <InputRow templateColumns="1fr 1fr 1fr 1fr 1fr">
      <TextInput placeholder="First Name" label="First Name" />
      <TextInput placeholder="Last Name" label="Last Name" />
      <TextInput placeholder="Age" label="Age" />
      <TextInput placeholder="Title" label="Title" />
      <Dropdown selectionType="single">
        <SelectInput
          label="Gender"
          placeholder="Select your Gender"
          name="action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Male" value="male" />
            <ActionListItem title="Female" value="female" />
            <ActionListItem title="Others" value="other" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </InputRow>
    <InputRow templateColumns="2fr 1fr 1fr">
      <TextInput placeholder="Email Address" label="Email Address" />
      <TextInput placeholder="Phone" label="Phone" />
      <TextInput placeholder="City" label="City" />
    </InputRow>
    <InputRow templateColumns="3fr 1fr">
      <TextInput placeholder="Street Address" label="Street Address" />
      <TextInput placeholder="ZIP Code" label="ZIP Code" />
    </InputRow>
    <InputRow templateColumns="1fr 1fr 1fr 1fr 1fr 1fr">
      <TextInput placeholder="Country" label="Country" />
      <TextInput placeholder="State" label="State" />
      <TextInput placeholder="Department" label="Department" />
      <TextInput placeholder="Employee ID" label="Employee ID" />
      <DatePicker inputPlaceHolder="MM/DD/YYYY" label="Start Date" />
      <Dropdown selectionType="single">
        <SelectInput
          label="Status"
          placeholder="Select Status"
          name="status"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Inactive" value="inactive" />
            <ActionListItem title="Pending" value="pending" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </InputRow>
  </InputGroupComponent>
);

export const Compact = CompactInputGroupTemplate.bind({});
Compact.args = {
  label: 'Quick Registration',
  helpText: 'Compact form for fast data entry',
};

const InputGroupWithValidationTemplate: StoryFn<InputGroupProps> = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    cardNumber: '1234 5678',
    expiryDate: null as Date | null,
    cvv: '12',
    cardholderName: 'John Doe',
    email: 'invalid-email',
  });

  const [errors, setErrors] = useState({
    cardNumber: true,
    expiryDate: true,
    cvv: true,
    cardholderName: false,
    email: true,
  });

  const validateField = () => {
    const newErrors: any = {};

    if (!formData.cardNumber) {
      newErrors.cardNumber = true;
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = true;
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = true;
    }

    if (!formData.cvv) {
      newErrors.cvv = true;
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = true;
    }

    if (!formData.cardholderName) {
      newErrors.cardholderName = true;
    }

    if (!formData.email) {
      newErrors.email = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = true;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === false);
  };

  const hasFormErrors = () => {
    return Object.values(errors).some((error) => error === true);
  };

  const handleInputChange = (name: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name as keyof typeof errors]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = () => {
    if (validateField()) {
      toast.show({
        content: 'Payment information saved successfully!',
        color: 'positive',
      });
    }
  };

  const getValidationState = (fieldName: string) => {
    if (errors[fieldName as keyof typeof errors]) return 'error';

    return 'none';
  };

  return (
    <Box>
      <ToastContainer />

      <InputGroupComponent
        label="Payment & Billing Information"
        helpText="Complete all fields to process your payment"
        validationState={hasFormErrors() ? 'error' : 'none'}
        errorText={hasFormErrors() ? 'Please fix all errors before submitting' : ''}
      >
        <InputRow templateColumns="1fr">
          <TextInput
            placeholder="Card Number"
            label="Card Number"
            value={formData.cardNumber}
            onChange={({ value }) => handleInputChange('cardNumber', value || '')}
            validationState={getValidationState('cardNumber')}
          />
        </InputRow>
        <InputRow templateColumns="1fr 1fr">
          <DatePicker
            inputPlaceHolder="Expiry Date"
            label="Expiry Date"
            selectionType="single"
            value={formData.expiryDate}
            onChange={(date) => handleInputChange('expiryDate', date)}
            validationState={getValidationState('expiryDate')}
          />
          <TextInput
            placeholder="CVV"
            label="CVV"
            value={formData.cvv}
            onChange={({ value }) => handleInputChange('cvv', value || '')}
            validationState={getValidationState('cvv')}
          />
        </InputRow>
        <InputRow templateColumns="1fr">
          <TextInput
            placeholder="Cardholder Name"
            label="Cardholder Name"
            value={formData.cardholderName}
            onChange={({ value }) => handleInputChange('cardholderName', value || '')}
            validationState={getValidationState('cardholderName')}
          />
        </InputRow>
        <InputRow templateColumns="1fr">
          <TextInput
            placeholder="Email Address"
            label="Email Address"
            value={formData.email}
            onChange={({ value }) => handleInputChange('email', value || '')}
            validationState={getValidationState('email')}
          />
        </InputRow>
      </InputGroupComponent>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="spacing.4">
        <Box></Box>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Payment
        </Button>
      </Box>
    </Box>
  );
};

export const WithValidation = InputGroupWithValidationTemplate.bind({});

const InputGroupSizesTemplate: StoryFn<InputGroupProps> = (args) => {
  const sizes: InputGroupProps['size'][] = ['medium', 'large'];
  return (
    <>
      {sizes.map((size) => (
        <Box marginBottom="spacing.8">
          <Heading marginBottom="spacing.3">{size}</Heading>
          <Default {...args} size={size} />
        </Box>
      ))}
    </>
  );
};

export const AllSizes = InputGroupSizesTemplate.bind({});

const DisabledInputGroupTemplate: StoryFn<InputGroupProps> = (args) => (
  <InputGroupComponent {...args}>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Street Address" label="Street Address" value="123 Main Street" />
    </InputRow>
    <InputRow templateColumns="2fr 1fr">
      <TextInput placeholder="City" label="City" value="San Francisco" />
      <TextInput placeholder="ZIP Code" label="ZIP Code" value="94102" />
    </InputRow>
    <InputRow templateColumns="1fr">
      <TextInput placeholder="Country" label="Country" value="United States" />
    </InputRow>
  </InputGroupComponent>
);

export const Disabled = DisabledInputGroupTemplate.bind({});
Disabled.args = {
  label: 'Shipping Address (Read Only)',
  helpText: 'This address cannot be modified',
  isDisabled: true,
};
