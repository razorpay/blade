const InputGroupStoryCode = `import React, { useState } from 'react';
import {
  InputGroup,
  InputRow,
  TextInput,
  DatePicker,
  Button,
  Box,
  PasswordInput
} from '@razorpay/blade/components';

const InputGroupExample = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <InputGroup label="Payment Details" hintText="Enter your payment details">
        <InputRow gridTemplateColumns="1fr">
          <TextInput 
            placeholder="1234 5678 9012 3456" 
            format="#### #### #### ####"
            label="Card Number"
            value={formData.cardNumber}
            onChange={({ value }) => handleInputChange('cardNumber', value)}
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr">
          <TextInput 
            placeholder="MM/YY" 
            format="##/##"
            label="Expiry Date"
            value={formData.expiryDate}
            onChange={({ value }) => handleInputChange('expiryDate', value)}
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr 1fr">
          <PasswordInput 
            placeholder="123" 
            label="CVV"
            maxCharacters={3}
            value={formData.cvv}
            onChange={({ value }) => handleInputChange('cvv', value)}
          />
          <TextInput 
            placeholder="John Doe" 
            label="Cardholder Name"
            value={formData.cardholderName}
            onChange={({ value }) => handleInputChange('cardholderName', value)}
          />
        </InputRow>
      </InputGroup>
      <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop="spacing.4">
        <Button onClick={handleSubmit} variant="primary">
          Submit Payment
        </Button>
      </Box>
    </>
  );
};

export default InputGroupExample;
`;

export { InputGroupStoryCode };
