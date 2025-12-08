import React from 'react';
import {
  Box,
  Text,
  Badge,
  Switch,
  Card,
  CardBody,
  SearchInput,
  Heading,
  Link,
  AnnouncementIcon,
  Dropdown,
  DropdownButton,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  ChevronDownIcon,
  Button,
  ExternalLinkIcon,
  Divider,
  Alert,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  PlusIcon,
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  FileUpload,
  ChipGroup,
  Chip,
} from '@razorpay/blade/components';

const DeveloperConsoleHeader = (): React.JSX.Element => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap="spacing.5"
      width="100%"
      paddingY="spacing.5"
      paddingX="spacing.7"
    >
      <Heading size="large" weight="semibold">
        Developer Controls
      </Heading>
      <Box display="flex" alignItems="center" gap="spacing.7">
        <SearchInput
          placeholder="Search"
          onChange={() => {
            console.log('Search');
          }}
          accessibilityLabel="Search developer controls"
        />
        <Link href="#" icon={AnnouncementIcon} accessibilityLabel="Notifications" />
        <Dropdown>
          <DropdownButton variant="tertiary" icon={ChevronDownIcon} iconPosition="right">
            New
          </DropdownButton>
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Admin Group" value="admin-group" />
              <ActionListItem title="Admin Rules" value="admin-rules" />
              <ActionListItem title="Add Users" value="add-users" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

const DashboardMode = (): React.JSX.Element => {
  return (
    <Card elevation="none">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Box display="flex" alignItems="center" justifyContent="space-between" gap="spacing.3">
            <Box display="flex" alignItems="center" gap="spacing.3">
              <Text size="large" weight="semibold">
                Dashboard Mode
              </Text>
              <Badge color="positive" emphasis="subtle">
                Live
              </Badge>
            </Box>
            <Box
              as="label"
              marginTop="spacing.2"
              display="flex"
              alignItems="center"
              gap="spacing.3"
            >
              <Text size="medium" weight="semibold" color="surface.text.gray.muted">
                Test Mode Disabled
              </Text>
              <Switch
                defaultChecked={true}
                accessibilityLabel="Toggle between Live and Test mode"
              />
            </Box>
          </Box>
          <Text variant="body" size="small" color="surface.text.gray.muted">
            Dashboard mode allows you to switch between Live and Test mode keys. Use test keys to
            check integration with your platform. Reintegrate with live keys to use live balance.
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};

const APIKeys = (): React.JSX.Element => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="spacing.3"
        padding="spacing.7"
      >
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Text size="large" weight="semibold" color="surface.text.gray.subtle">
            API Keys
          </Text>
          <Link href="#" icon={ExternalLinkIcon} accessibilityLabel="Regenerate Keys" />
        </Box>
        <Button variant="secondary">Regenerate Keys</Button>
      </Box>

      <Divider />

      <Box display="flex" flexDirection="column" gap="spacing.8" padding="spacing.7">
        <Box display="flex" flexDirection="column" gap="spacing.7" width="300px">
          <Box display="flex" alignItems="center" gap="spacing.6" justifyContent="space-between">
            <Text color="surface.text.gray.muted" size="medium" weight="regular">
              Key ID
            </Text>
            <Text color="surface.text.gray.subtle" size="medium" weight="medium">
              rzp_live_RZpOftjBbxjmbW
            </Text>
          </Box>

          <Box display="flex" alignItems="center" gap="spacing.6" justifyContent="space-between">
            <Text textAlign="right" color="surface.text.gray.muted" size="medium" weight="regular">
              Creation Date
            </Text>
            <Text color="surface.text.gray.subtle" size="medium" weight="medium">
              14th Nov, 2022 10:59 PM
            </Text>
          </Box>
        </Box>
        <Alert
          isFullWidth
          isDismissible={false}
          description="Key ID and Secret are shared across RazorpayX and Razorpay Payments dashboard"
          color="neutral"
          emphasis="subtle"
        />
      </Box>
    </Box>
  );
};

// Sample webhook data
const webhooks = [
  {
    id: '1',
    url: 'https://dashboard.razorpay.com/captcha?redirect=https%3...',
    status: 'Active',
    activeEvents: 1,
    creationDate: '14 Feb, 2025 03:45 PM',
  },
  {
    id: '2',
    url: 'https://dashboard.razorpay.com/captcha?redirect=https%3...',
    status: 'Inactive',
    activeEvents: 1,
    creationDate: '14 Feb, 2025 03:45 PM',
  },
  {
    id: '3',
    url: 'https://dashboard.razorpay.com/captcha?redirect=https%3...',
    status: 'Active',
    activeEvents: 1,
    creationDate: '14 Feb, 2025 03:45 PM',
  },
];

const tableData = {
  nodes: webhooks.map((webhook) => ({
    ...webhook,
    id: webhook.id,
  })),
};

const Webhooks = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = React.useState('webhooks');

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
    >
      <Tabs variant="borderless" value={activeTab} onChange={setActiveTab}>
        <Box display="flex" alignItems="center" justifyContent="space-between" paddingX="spacing.6">
          <TabList>
            <TabItem value="webhooks">Webhooks</TabItem>
            <TabItem value="subscriptions">Subscriptions</TabItem>
          </TabList>
          <Button variant="secondary" icon={PlusIcon} iconPosition="left">
            Add Webhook
          </Button>
        </Box>
        <Divider />

        <TabPanel value="webhooks">
          <Table data={tableData} isHeaderSticky showBorderedCells rowDensity="normal">
            {(data) => (
              <>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>URL</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Active Events</TableHeaderCell>
                    <TableHeaderCell>Creation Date</TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>

                <TableBody>
                  {data.map((webhook, index) => (
                    <TableRow
                      key={index}
                      item={webhook}
                      onClick={({ item }) => console.log('Row clicked:', item.id)}
                      onHover={({ item }) => console.log('Row hovered:', item.id)}
                    >
                      <TableCell>
                        <Text>{webhook.url}</Text>
                      </TableCell>
                      <TableCell>
                        <Badge
                          color={webhook.status === 'Active' ? 'positive' : 'negative'}
                          emphasis="subtle"
                        >
                          {webhook.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{webhook.activeEvents}</TableCell>
                      <TableCell>{webhook.creationDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </TabPanel>
        <TabPanel value="subscriptions">
          <Box paddingTop="spacing.4">
            <Text>Subscriptions Panel Content</Text>
          </Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
};

const IpAddressWhitelist = (): React.JSX.Element => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
    >
      <Accordion maxWidth="100%" defaultExpandedIndex={0}>
        <AccordionItem>
          <AccordionItemHeader
            title="IP Address Whitelisting"
            subtitle="Whitelist IP addresses here"
            titleSuffix={
              <Badge color="notice" emphasis="subtle">
                Mandatory for API Payouts
              </Badge>
            }
            trailing={<Link href="#">How to find out your IP Address?</Link>}
          />
          <AccordionItemBody>
            <Box display="flex" flexDirection="column" gap="spacing.6">
              <Text size="medium" color="surface.text.gray.subtle">
                You have whitelisted 5 IP addresses.
              </Text>

              <ChipGroup accessibilityLabel="Whitelisted IP addresses" selectionType="multiple">
                <Chip value="192.90.62.182">192.90.62.182</Chip>
                <Chip value="192.91.62.182">192.91.62.182</Chip>
                <Chip value="192.92.62.182">192.92.62.182</Chip>
                <Chip value="192.93.62.182">192.93.62.182</Chip>
                <Chip value="192.94.62.182">192.94.62.182</Chip>
              </ChipGroup>

              <Box marginTop="spacing.4">
                <FileUpload
                  label="  Upload IP Address CSV"
                  accessibilityLabel="Upload IP Address CSV"
                  uploadType="single"
                  helpText="You can upload upto 5 files. Max size 5MB."
                  accept=".csv"
                  maxSize={5 * 1024 * 1024}
                  size="medium"
                />
              </Box>

              <Box marginTop="spacing.4">
                <Button variant="secondary">Edit Whitelist</Button>
              </Box>
            </Box>
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

const DeveloperConsole = (): React.JSX.Element => {
  return (
    <Box padding="spacing.6" id="main-element">
      <Box display="flex" flexDirection="column" gap="spacing.6" width="100%">
        <DeveloperConsoleHeader />
        <Box
          paddingX="spacing.7"
          paddingY="spacing.5"
          display="flex"
          flexDirection="column"
          gap="spacing.6"
        >
          <DashboardMode />
          <APIKeys />
          <Webhooks />
          <IpAddressWhitelist />
        </Box>
      </Box>
    </Box>
  );
};

export default DeveloperConsole;
