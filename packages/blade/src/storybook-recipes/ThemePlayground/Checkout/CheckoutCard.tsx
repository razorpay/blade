import { Box, Checkbox, Heading } from '../../../components';
import { CheckoutShell } from './CheckoutShell';
import { PasswordInput } from '~components/Input/PasswordInput';
import { TextInput } from '~components/Input/TextInput';

const CheckoutCard = (): React.ReactElement => {
  return (
    <CheckoutShell>
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
    </CheckoutShell>
  );
};

export { CheckoutCard };
