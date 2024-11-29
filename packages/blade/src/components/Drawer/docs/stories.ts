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

const DrawerStackingStory = `import React from 'react';
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
`;

const ScrollableContentStory = `import React from 'react';
  import {
    Drawer,
    DrawerHeader,
    DrawerBody,
    Box,
    Badge,
    Button,
    TextInput,
    DownloadIcon,
    TextArea,
    Radio,
    RadioGroup
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

  export default App;

`;

const DrawerWithTableStory = `import React, { useState } from 'react';
  import {
    Table,
    Code,
    Heading,
    Box,
    TableHeader,
    TableHeaderRow,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    Amount,
    Badge,
    Text,
    Drawer,
    DrawerHeader,
    TransactionsIcon,
    DrawerBody,
    Link,
    ArrowRightIcon,
    useTheme,
  } from '@razorpay/blade/components';
  import type { TableData } from '@razorpay/blade/components';

  type Item = {
    id: number;
    user: string;
    paymentId: string;
    amount: number;
    status: string;
  };

  const nodes: Item[] = [
    {
      id: 1,
      user: 'Anurag Hazra',
      paymentId: 'rzp1234',
      amount: 123,
      status: 'Failed',
    },
    {
      id: 2,
      user: 'Anurag Hazra',
      paymentId: 'rzp1224',
      amount: 123,
      status: 'Completed',
    },
    {
      id: 3,
      user: 'Saurabh Daware',
      paymentId: 'rzp6545',
      amount: 1,
      status: 'Failed',
    },
    {
      id: 4,
      user: 'The Webpack Guy',
      paymentId: 'rzp655',
      amount: 234532432,
      status: 'Completed',
    },
    {
      id: 5,
      user: 'The Webpack Guy',
      paymentId: 'rzp615',
      amount: 22223249854,
      status: 'Completed',
    },
    {
      id: 6,
      user: 'Chaitanya Deorukhkar',
      paymentId: 'rzp645',
      amount: 100000,
      status: 'Pending',
    },
  ];

  const data: TableData<Item> = {
    nodes,
  };

  const UserDetailsDrawer = ({
    paymentId,
    user,
    amount,
    status,
    showDrawer,
    setShowDrawer,
  }: {
    showDrawer: boolean;
    setShowDrawer: (showDrawer: boolean) => void;
  } & Partial<Item>) => {
    const [showUserDrawer, setShowUserDrawer] = React.useState(false);
    return (
      <>
        <Drawer
          showOverlay={false}
          isOpen={showDrawer}
          onDismiss={() => setShowDrawer(false)}
        >
          <DrawerHeader
            leading={<TransactionsIcon size="large" />}
            title="Transaction Details"
          />
          <DrawerBody>
            <Box display="flex" gap="spacing.3" alignItems="center">
              <Text size="large">{paymentId}</Text>
              {status ? (
                <Badge
                  size="medium"
                  color={
                    status === 'Completed'
                      ? 'positive'
                      : status === 'Pending'
                      ? 'notice'
                      : status === 'Failed'
                      ? 'negative'
                      : 'primary'
                  }
                >
                  {status}
                </Badge>
              ) : null}
            </Box>
            {amount ? (
              <Amount
                marginY="spacing.5"
                size="2xlarge"
                type="heading"
                value={amount}
              />
            ) : null}
            <Text
              marginBottom="spacing.3"
              color="surface.text.gray.subtle"
              size="small"
            >
              from {user}
            </Text>
            <Link
              display="block"
              icon={ArrowRightIcon}
              iconPosition="right"
              variant="button"
              onClick={() => {
                setShowUserDrawer(true);
              }}
            >
              User's Other Transactions
            </Link>
          </DrawerBody>
        </Drawer>
        <Drawer
          isOpen={showUserDrawer}
          onDismiss={() => setShowUserDrawer(false)}
        >
          <DrawerHeader title="User Details" />
          <DrawerBody>
            <Table
              showStripedRows={false}
              data={{ nodes: nodes.filter((node) => node.user === user) }}
            >
              {(tableData) => (
                <>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>ID</TableHeaderCell>
                      <TableHeaderCell>User</TableHeaderCell>
                      <TableHeaderCell>Transaction ID</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((tableItem, index) => (
                      <TableRow key={index} item={tableItem}>
                        <TableCell>
                          <Text>{tableItem.id}</Text>
                        </TableCell>
                        <TableCell>
                          <Text>{tableItem.user}</Text>
                        </TableCell>
                        <TableCell>
                          <Text>{tableItem.paymentId}</Text>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              )}
            </Table>
          </DrawerBody>
        </Drawer>
      </>
    );
  };

  function App() {
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
    const [showDrawer, setShowDrawer] = useState(false);
    const { theme } = useTheme();
    return (
      <Box
        backgroundColor="surface.background.gray.intense"
        padding="spacing.5"
        overflow="auto"
        minHeight="400px"
      >
        <Box paddingBottom="spacing.4">
          <Heading>Single Selectable Table</Heading>
        </Box>
        <Table
          data={data}
          selectionType="single"
          onSelectionChange={({ values }) => {
            if (values[0]) {
              setShowDrawer(true);
              setSelectedItem(values[0]);
            } else {
              setShowDrawer(false);
              // removing item from selected after Drawer close animation
              setTimeout(() => {
                setSelectedItem(values[0]);
              }, theme.motion.duration.xmoderate);
            }
          }}
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>User</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow key={index} item={tableItem}>
                    <TableCell>
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Text>{tableItem.user}</Text>
                    </TableCell>
                    <TableCell>
                      <Amount suffix="humanize" value={tableItem.amount} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        size="medium"
                        color={
                          tableItem.status === 'Completed'
                            ? 'positive'
                            : tableItem.status === 'Pending'
                            ? 'notice'
                            : tableItem.status === 'Failed'
                            ? 'negative'
                            : 'primary'
                        }
                      >
                        {tableItem.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
        <Box
          marginTop="spacing.3"
          display="flex"
          flexDirection="row"
          gap="spacing.2"
        >
          <Text weight="semibold">Selected Row ID:</Text>
          <Text>{selectedItem?.paymentId}</Text>
        </Box>
        <UserDetailsDrawer
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          {...selectedItem}
        />
      </Box>
    );
  }

  export default App;
`;

export { BasicDrawerStory, DrawerStackingStory, ScrollableContentStory, DrawerWithTableStory };
