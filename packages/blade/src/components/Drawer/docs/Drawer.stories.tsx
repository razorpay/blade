import React from 'react';
import type { StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { DrawerProps } from '../';
import { Drawer, DrawerBody, DrawerHeader } from '../';
import { DrawerStackingStory } from './stories';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { AnnouncementIcon, DownloadIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/Input/TextInput';
import {
  Card,
  CardBody,
  CardFooter,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
} from '~components/Card';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Drawer"
      componentDescription="A drawer is a panel that slides in mostly from right side of the screen over the existing content in the viewport."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=78667-66659&t=YFTWKtgOioAyOKwG-1&scaling=min-zoom&page-id=77229%3A6461&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>{DrawerStackingStory}</Sandbox>
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
      <Drawer
        {...args}
        isOpen={args.isOpen ?? isDrawerOpen}
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

export const DrawerStacking = (args: DrawerProps): React.ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSecondDrawerOpen, setIsSecondDrawerOpen] = React.useState(false);
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

      <Drawer isOpen={isSecondDrawerOpen} onDismiss={() => setIsSecondDrawerOpen(false)}>
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
