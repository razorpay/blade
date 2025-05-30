const InputGroupStoryCode = `import React, { useState } from 'react';
import {
  InputGroup,
  InputRow,
  TextInput,
  DatePicker,
  Button
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
      <InputGroup label="Payment Details" hintText="Enter your payment details">
        <InputRow gridTemplateColumns="1fr">
          <TextInput 
            placeholder="1234 5678 9012 3456" 
            label="Card Number"
            value={formData.cardNumber}
            onChange={({ value }) => handleInputChange('cardNumber', value)}
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr">
          <DatePicker 
            inputPlaceHolder="MM/YY" 
            label="Expiry Date"
            value={formData.expiryDate}
            onChange={({ value }) => handleInputChange('expiryDate', value)}
          />
        </InputRow>
        <InputRow gridTemplateColumns="1fr 1fr">
          <TextInput 
            placeholder="123" 
            label="CVV"
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
        <InputRow gridTemplateColumns="1fr">
          <Button onClick={handleSubmit} variant="primary">
            Submit Payment
          </Button>
        </InputRow>
      </InputGroup>
  );
};

export default InputGroupExample;
`;

export { InputGroupStoryCode };
