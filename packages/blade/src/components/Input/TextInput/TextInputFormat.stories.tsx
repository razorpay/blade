import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { TextInput as TextInputComponent } from './TextInput';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import {
  detectPaymentCardBrand,
  getPaymentCardBrandIcon,
  getPaymentCardNumberFormat,
} from '~utils/usePaymentCardDetection';
import type { PaymentCardBrand } from '~utils/usePaymentCardDetection';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const TextInputFormatMeta: Meta<typeof TextInputComponent> = {
  title: 'Components/Input/TextInput/Format',
  component: TextInputComponent,
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentName="TextInput"
          componentDescription="TextInput with format support for different input patterns like credit card numbers, phone numbers etc."
          figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=1234-5678"
        />
      ),
    },
  },
};

export default TextInputFormatMeta;

export const CardNumberFormat: StoryFn<typeof TextInputComponent> = () => {
  const [cardNumber, setCardNumber] = React.useState('');
  const [rawCardNumber, setRawCardNumber] = React.useState('');
  const [cardBrand, setCardBrand] = React.useState<PaymentCardBrand>('unknown');

  const handleCardNumberChange = ({
    value,
    rawValue,
  }: {
    value?: string;
    rawValue?: string;
  }): void => {
    setCardNumber(value ?? '');
    setRawCardNumber(rawValue ?? '');

    if (rawValue) {
      const brand = detectPaymentCardBrand(rawValue);
      setCardBrand(brand);
    }
  };

  return (
    <Box>
      <TextInputComponent
        label="Card Number"
        placeholder="Enter card number"
        value={cardNumber}
        format={getPaymentCardNumberFormat(cardBrand)}
        onChange={handleCardNumberChange}
        helpText="Try: 4111111111111111 (Visa), 5555555555554444 (Mastercard), 378282246310005 (Amex)"
        trailing={getPaymentCardBrandIcon(cardBrand)}
      />
      <Box
        backgroundColor="surface.background.gray.moderate"
        padding="spacing.4"
        borderRadius="medium"
        margin={['spacing.4', 'spacing.0']}
      >
        <Text>Formatted Value: {cardNumber}</Text>
      </Box>
      <Box
        backgroundColor="surface.background.gray.moderate"
        padding="spacing.4"
        borderRadius="medium"
      >
        <Text>Raw Value: {rawCardNumber}</Text>
      </Box>
    </Box>
  );
};
CardNumberFormat.storyName = 'Format Controlled';

export const DateFormat: StoryFn<typeof TextInputComponent> = () => {
  const [date, setDate] = React.useState('');
  const [rawDate, setRawDate] = React.useState('');

  return (
    <Box>
      <TextInputComponent
        label="Date"
        placeholder="Enter date"
        defaultValue=""
        format="##/##/####"
        onChange={({ value, rawValue }) => {
          setDate(value ?? '');
          setRawDate(rawValue ?? '');
        }}
        helpText="Enter date in DD/MM/YYYY format"
      />
      <Box
        backgroundColor="surface.background.gray.moderate"
        padding="spacing.4"
        borderRadius="medium"
        margin={['spacing.4', 'spacing.0']}
      >
        <Text>Formatted Value: {date}</Text>
      </Box>
      <Box
        backgroundColor="surface.background.gray.moderate"
        padding="spacing.4"
        borderRadius="medium"
      >
        <Text>Raw Value: {rawDate}</Text>
      </Box>
    </Box>
  );
};

DateFormat.storyName = 'Format Uncontrolled';

export const CustomFormat: StoryFn<typeof TextInputComponent> = () => {
  const [value, setValue] = React.useState('');
  const [rawValue, setRawValue] = React.useState('');
  const [pattern, setPattern] = React.useState('(####)-####-####');

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <TextInputComponent
        label="Format Pattern"
        placeholder="Enter format pattern (use # for input positions)"
        value={pattern}
        onChange={({ value }) => {
          setPattern(value ?? '');
          setValue('');
          setRawValue('');
        }}
        helpText="Example patterns: ####-####-####, (###) ###-####, ##/##/####"
      />
      <TextInputComponent
        label="Formatted Input"
        placeholder="Enter value"
        value={value}
        format={pattern}
        onChange={({ value, rawValue }) => {
          setValue(value ?? '');
          setRawValue(rawValue ?? '');
        }}
        helpText="Enter value to see it formatted according to the pattern above"
        showClearButton={true}
        onClearButtonClick={() => {
          setValue('');
          setRawValue('');
        }}
      />
      <Box
        backgroundColor="surface.background.gray.moderate"
        padding="spacing.4"
        borderRadius="medium"
      >
        <Text>Formatted Value: {value}</Text>
      </Box>
      <Box
        backgroundColor="surface.background.gray.moderate"
        padding="spacing.4"
        borderRadius="medium"
      >
        <Text>Raw Value: {rawValue}</Text>
      </Box>
    </Box>
  );
};
CustomFormat.storyName = 'Custom Format';

export const FormatPatterns: StoryFn<typeof TextInputComponent> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <TextInputComponent
        label="Aadhaar Number"
        placeholder="Enter Aadhaar"
        format="#### #### ####"
        helpText="Format: XXXX XXXX XXXX"
      />
      <TextInputComponent
        label="Time (24-hour)"
        placeholder="Enter time"
        format="##:##:##"
        helpText="Format: HH:MM:SS"
      />
      <TextInputComponent
        label="Postal Code"
        placeholder="Enter postal code"
        format="### ###"
        helpText="Format: XXX XXX"
      />
      <TextInputComponent
        label="PAN Number"
        placeholder="Enter PAN"
        format="##### #### #"
        helpText="Format: XXXXX XXXX X"
      />
      <TextInputComponent
        label="IP Address"
        placeholder="Enter IP address"
        format="###.###.###.###"
        helpText="Format: XXX.XXX.XXX.XXX"
      />
      <TextInputComponent
        label="License Plate"
        placeholder="Enter license plate"
        format="## ## ####"
        helpText="Format: AB 12 CDEF"
      />
      <TextInputComponent
        label="GST Number"
        placeholder="Enter GST"
        format="## #### #### #### #"
        helpText="Format: XX XXXX XXXX XXXX X"
      />
    </Box>
  );
};
FormatPatterns.storyName = 'Format Patterns';
