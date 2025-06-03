import React, { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { InputGroupProps } from '../types';
import { InputGroup as InputGroupComponent } from '../InputGroup';
import { InputRow } from '../InputRow';
import { InputGroupStoryCode } from './code';
import { TextInput } from '~components/Input/TextInput';
import { DatePicker } from '~components/DatePicker';
import { Button } from '~components/Button';
import { Heading } from '~components/Typography';
import { Box } from '~components/Box';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { useToast, ToastContainer } from '~components/Toast';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getBoxArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { useIsMobile } from '~utils/useIsMobile';

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
          figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=103885-35158&m=dev"
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
    <InputRow gridTemplateColumns="1fr">
      <TextInput placeholder="Street Address" label="Street Address" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr 1fr">
      <TextInput placeholder="City" label="City" />
      <TextInput placeholder="ZIP Code" label="ZIP Code" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr">
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
    <InputRow gridTemplateColumns="1fr 1fr">
      <TextInput placeholder="First Name" label="First Name" />
      <TextInput placeholder="Last Name" label="Last Name" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr">
      <TextInput placeholder="Street Address" label="Street Address" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr">
      <TextInput placeholder="Street Address Line-2" label="Address Line 2" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr">
      <TextInput placeholder="Apartment Name" label="Apartment Name" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr 1fr">
      <TextInput placeholder="City" label="City" />
      <TextInput placeholder="State" label="State" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr 1fr">
      <TextInput placeholder="ZIP Code" label="ZIP Code" />
      <TextInput placeholder="Country" label="Country" />
    </InputRow>
  </InputGroupComponent>
);

export const Detailed = DetailedInputGroupTemplate.bind({});
Detailed.args = {
  label: 'Billing Address',
  helpText: 'Complete address information required for billing',
};

const ResponsiveFormTemplate: StoryFn<InputGroupProps> = (args) => {
  const isMobile = useIsMobile();

  return (
    <Box>
      <InputGroupComponent {...args}>
        {isMobile ? (
          <>
            <InputRow gridTemplateColumns="1fr">
              <TextInput placeholder="Business Name" label="Business Name" />
            </InputRow>
            <InputRow gridTemplateColumns="1fr">
              <TextInput placeholder="Trading Name" label="Trading Name" />
            </InputRow>
          </>
        ) : (
          <InputRow gridTemplateColumns="1fr 1fr">
            <TextInput placeholder="Business Name" label="Business Name" />
            <TextInput placeholder="Trading Name" label="Trading Name" />
          </InputRow>
        )}
        <InputRow gridTemplateColumns="1fr">
          <TextInput placeholder="Business Email" label="Business Email" />
        </InputRow>
        {isMobile ? (
          <>
            <InputRow gridTemplateColumns="1fr">
              <TextInput placeholder="PAN Number" label="Business PAN" />
            </InputRow>
            <InputRow gridTemplateColumns="1fr">
              <TextInput placeholder="GST Number" label="GSTIN" />
            </InputRow>
          </>
        ) : (
          <InputRow gridTemplateColumns="1fr 1fr">
            <TextInput placeholder="PAN Number" label="Business PAN" />
            <TextInput placeholder="GST Number" label="GSTIN" />
          </InputRow>
        )}
        {isMobile ? (
          <>
            <InputRow gridTemplateColumns="1fr">
              <TextInput placeholder="Account Number" label="Bank Account Number" />
            </InputRow>
            <InputRow gridTemplateColumns="1fr">
              <TextInput placeholder="IFSC Code" label="IFSC Code" />
            </InputRow>
          </>
        ) : (
          <InputRow gridTemplateColumns="2fr 1fr">
            <TextInput placeholder="Account Number" label="Bank Account Number" />
            <TextInput placeholder="IFSC Code" label="IFSC Code" />
          </InputRow>
        )}
        <InputRow gridTemplateColumns="1fr">
          <Dropdown selectionType="single">
            <SelectInput
              label="Business Category"
              placeholder="Select Business Category"
              name="businessCategory"
              onChange={({ name, values }) => {
                console.log({ name, values });
              }}
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="E-commerce" value="ecommerce" />
                <ActionListItem title="Education" value="education" />
                <ActionListItem title="Healthcare" value="healthcare" />
                <ActionListItem title="Food & Beverage" value="food_beverage" />
                <ActionListItem title="Financial Services" value="financial" />
                <ActionListItem title="Others" value="others" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </InputRow>
      </InputGroupComponent>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box />
        <Button variant="primary" marginTop="spacing.3">
          Start Onboarding
        </Button>
      </Box>
    </Box>
  );
};

export const ResponsiveForm = ResponsiveFormTemplate.bind({});
ResponsiveForm.args = {
  label: 'Merchant Onboarding',
  helpText: 'Complete your business details to start accepting payments',
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

  const validateField = (): boolean => {
    const newErrors = {
      cardNumber: false,
      expiryDate: false,
      cvv: false,
      cardholderName: false,
      email: false,
    };

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

  const hasFormErrors = (): boolean => {
    return Object.values(errors).some((error) => error);
  };

  const handleInputChange = (name: string, value: string | Date | null): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name as keyof typeof errors]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (): void => {
    if (validateField()) {
      toast.show({
        content: 'Payment information saved successfully!',
        color: 'positive',
      });
    }
  };

  const getValidationState = (fieldName: string): 'error' | 'none' => {
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
        <InputRow gridTemplateColumns="1fr">
          <TextInput
            placeholder="Card Number"
            label="Card Number"
            value={formData.cardNumber}
            onChange={({ value }) => handleInputChange('cardNumber', value || '')}
            validationState={getValidationState('cardNumber')}
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr 1fr">
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
        <InputRow gridTemplateColumns="1fr">
          <TextInput
            placeholder="Cardholder Name"
            label="Cardholder Name"
            value={formData.cardholderName}
            onChange={({ value }) => handleInputChange('cardholderName', value || '')}
            validationState={getValidationState('cardholderName')}
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr">
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
        <Box />
        <Button variant="primary" onClick={handleSubmit}>
          Submit Payment
        </Button>
      </Box>
    </Box>
  );
};

export const WithValidation = InputGroupWithValidationTemplate.bind({});

const InputGroupVariantsTemplate: StoryFn<InputGroupProps> = (args) => {
  const sizes: InputGroupProps['size'][] = ['medium', 'large'];
  const labelPositions: InputGroupProps['labelPosition'][] = ['top', 'left'];
  return (
    <>
      {sizes.map((size, index) => (
        <Box key={index} marginBottom="spacing.8">
          <Heading marginBottom="spacing.3">
            Size: {size} & Label Position: {labelPositions[index]}
          </Heading>
          <Default {...args} size={size} labelPosition={labelPositions[index]} />
        </Box>
      ))}
    </>
  );
};

export const AllVariants = InputGroupVariantsTemplate.bind({});
AllVariants.args = {
  label: 'Shipping Address',
  helpText: 'Where should we deliver your order?',
};

const DisabledInputGroupTemplate: StoryFn<InputGroupProps> = (args) => (
  <InputGroupComponent {...args}>
    <InputRow gridTemplateColumns="1fr">
      <TextInput placeholder="Street Address" label="Street Address" value="123 Main Street" />
    </InputRow>
    <InputRow gridTemplateColumns="2fr 1fr">
      <TextInput placeholder="City" label="City" value="San Francisco" />
      <TextInput placeholder="ZIP Code" label="ZIP Code" value="94102" />
    </InputRow>
    <InputRow gridTemplateColumns="1fr">
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
