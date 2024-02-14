const BasicDrawerStory = `
import React from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerHeader,
  DrawerHeaderBadge,
  DrawerBody,
  Heading,
  Badge,
  TextInput
} from "@razorpay/blade/components";

function App(): React.ReactElement {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<DrawerHeaderBadge color="positive">New</DrawerHeaderBadge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Box display="flex" alignItems="center">
            <Heading>Starters{"'"} CFP Private Limited </Heading>
            <Badge size="small" color="primary" marginLeft="spacing.3">
              Vendor
            </Badge>
          </Box>
          <Box marginTop="spacing.6" marginBottom="spacing.8">
            <TextInput label="Email" type="email" placeholder="Enter your email" />
            <TextInput
              marginTop="spacing.4"
              label="Phone Number"
              type="telephone"
              placeholder="Enter your phone number"
            />
          </Box>
          <Box>
            <Button>Payout</Button>{' '}
            <Button marginLeft="spacing.2" variant="tertiary">
              Invite Vendor
            </Button>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
}

export default App;
`;

export { BasicDrawerStory };
