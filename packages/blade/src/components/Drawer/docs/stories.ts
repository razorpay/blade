const BasicDrawerStory = `import React from 'react';
  import {
    Drawer,
    DrawerHeader,
    DrawerBody,
    Box,
    Badge,
    Button,
    Heading,
    TextInput,
    DownloadIcon,
  } from '@razorpay/blade/components';

  const App = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    return (
      <Box>
        <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          Toggle Drawer
        </Button>
        <Drawer isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
          <DrawerHeader
            title="Vendor Payment Details"
            titleSuffix={<Badge color="positive">New</Badge>}
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
              <TextInput
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
              <TextInput
                marginTop="spacing.4"
                label="Phone Number"
                type="telephone"
                placeholder="Enter your phone number"
              />
            </Box>
            <Button>Payout</Button>
          </DrawerBody>
        </Drawer>
      </Box>
    );
  };

  export default App;

`;

export { BasicDrawerStory };
