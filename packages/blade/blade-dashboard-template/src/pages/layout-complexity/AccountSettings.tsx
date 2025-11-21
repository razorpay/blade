import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  Text,
  Button,
  Heading,
  Card,
  CardBody,
  Link,
  EyeIcon,
  EditIcon,
  Badge,
  GlobeIcon,
  Divider,
  LockIcon,
  CheckIcon,
} from '@razorpay/blade/components';

const AccountSettings = (): React.ReactElement => {
  const [selectedTab, setSelectedTab] = useState('websites');

  return (
    <Box padding="spacing.6" id="main-element">
      <Box display="flex" gap="spacing.7">
        <Box flex={1}>
          <Tabs
            value={selectedTab}
            onChange={(value) => setSelectedTab(value)}
            variant="bordered"
            orientation="horizontal"
            size="medium"
          >
            <TabList>
              <TabItem value="websites">Websites & API keys</TabItem>
              <TabItem value="webhooks">Webhooks</TabItem>
            </TabList>

            <TabPanel value="websites">
              <Box width="100%" paddingTop="spacing.6">
                <Heading
                  size="medium"
                  weight="semibold"
                  color="surface.text.gray.normal"
                  marginBottom="spacing.3"
                >
                  Website/app details
                </Heading>

                <Text color="surface.text.gray.normal" marginBottom="spacing.6">
                  Submit the website/app where you want to collect payments. Verification takes 1-2
                  days.
                </Text>

                <Card elevation="none" marginBottom="spacing.6" borderRadius="medium">
                  <CardBody>
                    <Box display="flex" alignItems="center" marginBottom="spacing.4">
                      <Box
                        as="span"
                        borderRadius="medium"
                        backgroundColor="surface.background.gray.moderate"
                        width="40px"
                        height="40px"
                        marginRight="spacing.4"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        alignSelf="flex-start"
                      >
                        <GlobeIcon size="large" color="surface.icon.gray.muted" />
                      </Box>
                      <Box>
                        <Text weight="semibold">https://sugarandspice.com/</Text>
                        <Badge
                          icon={CheckIcon}
                          marginTop="spacing.3"
                          color="positive"
                          size="medium"
                        >
                          Approved
                        </Badge>
                      </Box>
                      <Box alignSelf="flex-start" marginLeft="auto" display="flex" gap="spacing.4">
                        <Link variant="button" size="small" icon={EyeIcon} iconPosition="left">
                          Policy pages
                        </Link>
                        <Link variant="button" size="small" icon={EditIcon} iconPosition="left">
                          Edit
                        </Link>
                      </Box>
                    </Box>

                    <Divider marginY="spacing.7" />

                    <Box>
                      <Box display="flex" alignItems="center" marginBottom="spacing.4">
                        <Box
                          as="span"
                          borderRadius="medium"
                          backgroundColor="surface.background.gray.moderate"
                          width="40px"
                          height="40px"
                          marginRight="spacing.4"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          alignSelf="flex-start"
                        >
                          <GlobeIcon size="large" color="surface.icon.gray.muted" />
                        </Box>
                        <Box>
                          <Text weight="semibold">https://sugarandspice.com/</Text>
                          <Badge marginTop="spacing.3" color="negative" size="medium">
                            Needs clarification
                          </Badge>
                          <Text
                            color="feedback.text.negative.intense"
                            size="medium"
                            marginTop="spacing.4"
                          >
                            We need a few more details to verify your website. Resolve now to get
                            access to API keys.
                          </Text>
                          <Button size="small" variant="primary" marginTop="spacing.4">
                            Resolve now
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </CardBody>
                </Card>

                <Heading
                  size="medium"
                  weight="semibold"
                  color="surface.text.gray.normal"
                  marginY="spacing.3"
                >
                  API keys & integration
                </Heading>

                <Text color="surface.text.gray.subtle" marginBottom="spacing.4">
                  Your API key allows your website to securely accept payments via Razorpay.
                </Text>

                <Text
                  color="surface.text.gray.subtle"
                  marginBottom="spacing.7"
                  size="large"
                  weight="regular"
                >
                  Follow the{' '}
                  <Link variant="button" size="large">
                    integration guide
                  </Link>{' '}
                  to set up payments.
                </Text>

                <Card elevation="none" marginBottom="spacing.6" borderRadius="medium">
                  <CardBody>
                    <Box display="flex" alignItems="center" marginBottom="spacing.4">
                      <Box
                        as="span"
                        borderRadius="medium"
                        backgroundColor="surface.background.gray.moderate"
                        width="40px"
                        height="40px"
                        marginRight="spacing.4"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        alignSelf="flex-start"
                      >
                        <LockIcon size="large" color="surface.icon.gray.muted" />
                      </Box>
                      <Box>
                        <Text color="surface.text.gray.normal" size="medium" weight="medium">
                          Rzp_HRsgN925Tvs&5Oks
                        </Text>
                        <Text color="surface.text.gray.normal" size="medium" weight="medium">
                          *******************
                        </Text>
                        <Text color="surface.text.gray.muted" size="medium">
                          Generated on Feb 11th, 2025 at 05:10 PM
                        </Text>

                        <Button size="small" variant="tertiary" marginTop="spacing.4">
                          Regenerate key
                        </Button>
                      </Box>
                    </Box>
                  </CardBody>
                </Card>
              </Box>
            </TabPanel>
            <TabPanel value="webhooks">
              <Box paddingTop="spacing.6">
                <Text>Webhooks content goes here</Text>
              </Box>
            </TabPanel>
          </Tabs>
        </Box>

        <Divider orientation="vertical" />

        <Box width="30%">
          <Box marginTop="spacing.8">
            <Text
              size="medium"
              weight="semibold"
              color="surface.text.gray.normal"
              marginBottom="spacing.4"
            >
              Can I collect payments on another website?
            </Text>
            <Text size="small" color="surface.text.gray.subtle">
              To add another website, your existing website must be live and fully functional, and
              the additional website must be related to your current business model.
            </Text>
            <Text size="small" color="surface.text.gray.subtle" marginTop="spacing.4">
              If you want to replace your existing website, use the edit option.
            </Text>
          </Box>

          <Box marginTop="spacing.8">
            <Text
              size="medium"
              weight="semibold"
              color="surface.text.gray.normal"
              marginBottom="spacing.4"
            >
              When should I regenerate API keys?
            </Text>
            <Text size="small" color="surface.text.gray.subtle">
              Regenerate API keys if you've lost access to them or suspect a security threat.
            </Text>
          </Box>

          <Box marginTop="spacing.8">
            <Text
              size="medium"
              weight="semibold"
              color="surface.text.gray.normal"
              marginBottom="spacing.4"
            >
              Can I use the same API key for all my websites?
            </Text>
            <Text size="small" color="surface.text.gray.subtle">
              API keys are universal, i.e, you can use the same API key across all your approved
              websites/apps
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSettings;
