import React from 'react';
import {
  Box,
  Card,
  Heading,
  TextInput,
  PhoneNumberInput,
  DatePicker,
  PasswordInput,
  Button,
  CardBody,
} from '@razorpay/blade/components';

const Signup = (): React.ReactElement => {
  return (
    <Box display="flex" justifyContent="center" id="main-element">
      <Card width="632px">
        <CardBody>
          <Box padding="spacing.6">
            <Heading size="2xlarge" weight="semibold" marginBottom="spacing.6">
              Signup with Razorpay
            </Heading>
            <TextInput label="Name" placeholder="Enter your name" marginBottom="spacing.5" />
            <PhoneNumberInput
              label="Mobile Number"
              defaultCountry="IN"
              marginBottom="spacing.5"
              placeholder="98765 43210"
            />
            <DatePicker label="Select Date" marginBottom="spacing.5" />
            <PasswordInput
              label="Enter Password"
              placeholder="Enter your password"
              marginBottom="spacing.5"
            />
            <PasswordInput
              label="Re-enter Password"
              placeholder="Re-enter your password"
              marginBottom="spacing.6"
            />
            <Button variant="primary" isFullWidth marginBottom="spacing.4">
              Signup
            </Button>
            <Button variant="secondary" isFullWidth>
              Contact Us
            </Button>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Signup;
