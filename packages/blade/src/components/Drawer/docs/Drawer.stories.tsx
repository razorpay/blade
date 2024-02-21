import React from 'react';
import type { StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { DrawerProps } from '../';
import { Drawer, DrawerBody, DrawerHeader } from '../';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { DownloadIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Heading } from '~components/Typography';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';
import { TextArea } from '~components/Input/TextArea';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Drawer"
      componentDescription="A drawer is a panel that slides in mostly from right side of the screen over the existing content in the viewport."
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=78667%3A66659&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import React from 'react';
        import {
          Drawer,
          DrawerHeader,
          DrawerBody,
          Box,
          Badge,
          Button,
          Card,
          CardBody,
          Heading,
          TextInput,
          DownloadIcon,
          AnnouncementIcon,
          CardHeader,
          CardHeaderLeading,
          Text,
          CardFooter,
          CardFooterTrailing,
        } from '@razorpay/blade/components';
        
        const App = () => {
          const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
          const [isSecondDrawerOpen, setIsSecondDrawerOpen] = React.useState(false);
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
                  <Box>
                    <Button
                      onClick={() => {
                        setIsSecondDrawerOpen(true);
                      }}
                    >
                      Next Drawer
                    </Button>
                  </Box>
                </DrawerBody>
              </Drawer>
        
              <Drawer
                isOpen={isSecondDrawerOpen}
                onDismiss={() => setIsSecondDrawerOpen(false)}
              >
                <DrawerHeader
                  leading={<AnnouncementIcon size="large" />}
                  title="Announcements"
                  subtitle="This is second drawer"
                />
                <DrawerBody>
                  <Card
                    backgroundColor="surface.background.gray.intense"
                    elevation="none"
                    padding="spacing.3"
                  >
                    <CardHeader>
                      <CardHeaderLeading title="Razorpay FTX" subtitle="Check out our yearly event" />
                    </CardHeader>
                    <CardBody>
                      <Box padding="spacing.4">
                        <Text>Book Your Tickets for Razorpay FTX</Text>
                      </Box>
                    </CardBody>
                    <CardFooter>
                      <CardFooterTrailing
                        actions={{
                          primary: { text: 'Book Now' },
                          secondary: { text: 'Visit Website' },
                        }}
                      />
                    </CardFooter>
                  </Card>
                </DrawerBody>
              </Drawer>
            </Box>
          );
        };
        
        export default App;        
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Drawer',
  component: Drawer,
  subcomponents: { Drawer, DrawerHeader, DrawerBody },
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const DrawerTemplate: StoryFn<typeof Drawer> = (args) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer {...args} isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
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
};

export const SimpleDrawer = DrawerTemplate.bind({});

export const NoOverlay = DrawerTemplate.bind({});
NoOverlay.args = {
  showOverlay: false,
};

export const InitialFocus = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const drawerInitialFocusRef = React.useRef(null);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer
        initialFocusRef={drawerInitialFocusRef}
        {...args}
        isOpen={isDrawerOpen}
        onDismiss={() => setIsDrawerOpen(false)}
      >
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
            <TextInput label="Email" type="email" placeholder="Enter your email" />
            <TextInput
              marginTop="spacing.4"
              label="Phone Number"
              type="telephone"
              placeholder="Enter your phone number"
            />
          </Box>
          <Box>
            <Button ref={drawerInitialFocusRef}>Payout</Button>{' '}
            <Button marginLeft="spacing.2" variant="tertiary">
              Invite Vendor
            </Button>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const ScrollableContent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>

      <Drawer isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          title="Vendor Payment Details"
          titleSuffix={<Badge color="positive">New</Badge>}
          subtitle="See your payment details here"
          trailing={<Button icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Box>
            <TextInput label="First Name" placeholder="John" marginBottom="spacing.3" />
            <TextInput label="Last Name" placeholder="Doe" marginBottom="spacing.3" />
            <TextInput label="Email" placeholder="john.doe@gmail.com" marginBottom="spacing.3" />
            <TextInput label="Phone Number" placeholder="+1 234 567 890" marginBottom="spacing.3" />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
          <Box>
            <TextInput label="First Name" placeholder="John" marginBottom="spacing.3" />
            <TextInput label="Last Name" placeholder="Doe" marginBottom="spacing.3" />
            <TextInput label="Email" placeholder="john.doe@gmail.com" marginBottom="spacing.3" />
            <TextInput label="Phone Number" placeholder="+1 234 567 890" marginBottom="spacing.3" />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station Fin</Radio>
            </RadioGroup>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};
