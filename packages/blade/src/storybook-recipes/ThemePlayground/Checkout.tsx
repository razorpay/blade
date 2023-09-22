import styled from 'styled-components';
import { Box, TextInput, Card, CardBody } from '../../components';
import { Checkbox } from '~components/Checkbox';
import { Heading, Text } from '~components/Typography';
import { PasswordInput } from '~components/Input/PasswordInput';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Amount } from '~components/Amount';

const StyledHeader = styled(BaseBox)({
  boxShadow: '0 4px 8px  rgba(23,26,30,.15)',
});

const StyledFooter = styled(BaseBox)(({ theme }) => ({
  boxShadow: `0 -2px 6px  rgba(23,26,30,.15)`,
  borderTop: `1px solid ${theme.colors.brand.gray[400].lowContrast}`,
  bottom: 0,
  left: 0,
  right: 0,
  position: 'absolute',
}));

const MerchantAvatar = styled.img(() => ({
  maxHeight: '46px',
  maxWidth: '46px',
}));

const Checkout = (): React.ReactElement => {
  return (
    <Box maxWidth="375px">
      <Card surfaceLevel={2} elevation="lowRaised" padding="spacing.0" height="600px">
        <CardBody>
          <Box overflow="hidden">
            <Box>
              <StyledHeader
                backgroundImage="linear-gradient(to bottom right,rgba(255,255,255,0.2),rgba(0,0,0,0.2))"
                height="80px"
                width="100%"
                backgroundColor="brand.primary.500"
                padding="spacing.4"
                borderTopLeftRadius="medium"
                borderTopRightRadius="medium"
                flexDirection="row"
                display="flex"
                gap="spacing.4"
                alignItems="center"
              >
                <MerchantAvatar src="https://i.imgur.com/n5tjHFD.png" />
                <Box>
                  <Heading color="action.text.primary.default">Merchant Name</Heading>
                  <Text size="small" color="action.text.primary.default">
                    Razorpay trusted business
                  </Text>
                </Box>
              </StyledHeader>
              <Box padding="spacing.4">
                <Heading marginTop="spacing.3">Add New Card</Heading>
                <Box display="flex" gap="spacing.6" marginTop="spacing.8">
                  <Box flex="2">
                    <TextInput label="Card Number" />
                  </Box>
                  <Box flex="1">
                    <TextInput label="Expiry" />
                  </Box>
                </Box>
                <Box display="flex" gap="spacing.6" marginTop="spacing.8">
                  <Box flex="2">
                    <TextInput label="Card Holder's Name" />
                  </Box>
                  <Box flex="1">
                    <PasswordInput label="CVV" />
                  </Box>
                </Box>
                <Box marginTop="spacing.10">
                  <Checkbox defaultChecked>Save card securely for future payments</Checkbox>
                </Box>
              </Box>
            </Box>
            <StyledFooter
              display="flex"
              marginTop="spacing.10"
              padding="spacing.4"
              alignItems="center"
            >
              <Box flex={1} flexDirection="column">
                <Amount value={5500} />
                <Text size="small" type="subdued">
                  View Details
                </Text>
              </Box>
              <Box flex={2}>
                <Button size="large" isFullWidth>
                  Pay Now
                </Button>
              </Box>
            </StyledFooter>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export { Checkout };
