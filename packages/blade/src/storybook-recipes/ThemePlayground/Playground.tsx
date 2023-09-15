import { Box, TextInput, Card, CardBody, CardFooter, CardFooterTrailing } from '../../components';
import { Checkbox } from '~components/Checkbox';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Text } from '~components/Typography';
import { Switch } from '~components/Switch';
import { Chip, ChipGroup } from '~components/Chip';
import { CardHeader, CardHeaderIcon, CardHeaderLeading } from '~components/Card';
import { RazorpayIcon } from '~components/Icons';

const Playground = (): React.ReactElement => {
  return (
    <Box>
      <Card elevation="none">
        <CardHeader>
          <CardHeaderLeading
            title="Razorpay Signup"
            prefix={<CardHeaderIcon icon={RazorpayIcon} />}
          />
        </CardHeader>
        <CardBody>
          <Box minWidth="300px">
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <TextInput
                label="Name"
                isRequired
                necessityIndicator="required"
                placeholder="Enter your name"
              />
              <TextInput
                label="Email"
                isRequired
                necessityIndicator="required"
                placeholder="Enter your email"
              />
            </Box>
            <Box marginTop="spacing.5" />
            <Dropdown selectionType="multiple">
              <SelectInput label="Select Features" placeholder="Features" name="feature" />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="Payment Gateway" value="Payment Gateway" />
                  <ActionListItem title="Payment Links" value="Payment Links" />
                  <ActionListItem title="Payment Pages" value="Payment Pages" />
                  <ActionListItem title="Corporate Card" value="Corporate Card" />
                  <ActionListItem title="Business Banking" value="Business Banking" />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <Box marginTop="spacing.5">
              <Text type="subdued" weight="bold" size="small">
                Select Department
              </Text>
              <ChipGroup accessibilityLabel="Select department" defaultValue="engineering">
                <Chip value="engineering">Engineering</Chip>
                <Chip value="design">Design</Chip>
                <Chip value="product">Product</Chip>
              </ChipGroup>
            </Box>
            <Box marginTop="spacing.5" />
            <Box as="label" display="flex" alignItems="center" gap="spacing.2">
              <Text>Enable 2-Factor Authentication:</Text>
              <Switch defaultChecked accessibilityLabel="Enable 2FA" />
            </Box>
            <Box marginTop="spacing.5" />
            <Checkbox value="Yes" defaultChecked>
              I agree to receive frequent communication updates
            </Checkbox>
            <Box marginTop="spacing.5" />
          </Box>
        </CardBody>
        <CardFooter>
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Signup',
                onClick: () => console.log('Saved'),
              },
              secondary: {
                text: 'Cancel',
                onClick: () => console.log('Reset'),
              },
            }}
          />
        </CardFooter>
      </Card>
    </Box>
  );
};

export { Playground };
