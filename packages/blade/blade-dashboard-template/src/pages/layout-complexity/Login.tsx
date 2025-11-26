import React from 'react';
import {
  Box,
  Heading,
  Text,
  TextInput,
  Button,
  Divider,
  CheckCircleIcon,
  LogOutIcon,
  Link,
  Card,
  CardBody,
} from '@razorpay/blade/components';

const Login = (): React.ReactElement => {
  return (
    <Box display="flex" minHeight="100vh" flexGrow={1} id="main-element">
      <Box flex={1} backgroundColor="surface.background.primary.intense" padding="spacing.10">
        <Box display="flex" height="100%">
          <Box marginBottom="spacing.10" marginTop="auto">
            <Heading size="large" color="surface.text.staticWhite.normal" weight="regular">
              Join{' '}
              <Heading as="span" size="large" weight="regular" color="surface.text.onSea.onIntense">
                8 Million
              </Heading>{' '}
              Businesses that Trust Razorpay to Supercharge their Business
            </Heading>
            <Box display="flex" gap="spacing.7" marginTop="spacing.7">
              <Heading color="surface.text.staticWhite.normal" size="small" weight="regular">
                <CheckCircleIcon color="surface.icon.staticWhite.normal" /> 100+ Payment Methods
              </Heading>
              <Heading color="surface.text.staticWhite.normal" size="small" weight="regular">
                <CheckCircleIcon color="surface.icon.staticWhite.normal" /> Easy Integration
              </Heading>
              <Heading color="surface.text.staticWhite.normal" size="small" weight="regular">
                <CheckCircleIcon color="surface.icon.staticWhite.normal" /> Powerful Dashboard
              </Heading>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box flex={1} maxWidth="430px">
        <Card height="100%">
          <CardBody height="100%">
            <Box display="flex" height="100%">
              <Box width="100%" height="max-content" margin="auto">
                <Heading
                  size="large"
                  weight="regular"
                  color="surface.text.gray.muted"
                  marginBottom="spacing.4"
                >
                  Welcome to Razorpay Payments
                </Heading>
                <Heading
                  size="medium"
                  weight="regular"
                  color="surface.text.gray.normal"
                  marginBottom="spacing.7"
                >
                  Get started with your email or phone number
                </Heading>
                <TextInput
                  accessibilityLabel="Email or Phone Number"
                  placeholder="Email or Phone Number"
                  type="text"
                  marginBottom="spacing.7"
                />
                <Button variant="primary" isFullWidth isDisabled size="small">
                  Continue
                </Button>
                <Divider marginY="spacing.7" />
                <Button
                  variant="secondary"
                  isFullWidth
                  icon={LogOutIcon}
                  iconPosition="left"
                  marginBottom="spacing.8"
                  size="small"
                >
                  Continue with Google
                </Button>
                <Text size="small" color="surface.text.gray.muted" textAlign="center">
                  By continuing you agree to our{' '}
                  <Link size="small" href="#">
                    privacy policy
                  </Link>{' '}
                  and{' '}
                  <Link size="small" href="#">
                    terms of use
                  </Link>
                  .
                </Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
