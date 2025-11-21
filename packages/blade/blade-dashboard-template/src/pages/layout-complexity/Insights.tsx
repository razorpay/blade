import React from 'react';
import {
  Box,
  Heading,
  Badge,
  Link,
  Card,
  CardBody,
  Text,
  Button,
  ArrowRightIcon,
  AlertTriangleIcon,
  BankIcon,
  DollarIcon,
  InfoIcon,
  MapPinIcon,
  CornerUpRightIcon,
  SelectInput,
  Tooltip,
  Amount,
  CalendarIcon,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  ArrowDownIcon,
  Divider,
  RayIcon,
  BladeProvider,
  ArrowUpRightIcon,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

const CriticalActions = (): React.ReactElement => {
  return (
    <Box padding="spacing.5">
      <Box
        display="flex"
        justifyContent="space-between"
        marginBottom="spacing.5"
        alignItems="center"
      >
        <Heading size="large" weight="semibold">
          Critical actions for you
        </Heading>
        <Box marginLeft="spacing.7" display="flex" alignItems="center">
          <Badge color="primary" size="large" emphasis="subtle" marginRight="spacing.3">
            All • 3
          </Badge>
          <Badge
            color="neutral"
            size="large"
            emphasis="subtle"
            icon={DollarIcon}
            marginRight="spacing.3"
          >
            Payments • 2
          </Badge>
          <Badge color="neutral" size="large" emphasis="subtle" icon={BankIcon}>
            Banking • 1
          </Badge>
        </Box>
        <Link marginLeft="auto" href="#" size="large" icon={ArrowRightIcon} iconPosition="right">
          Show all
        </Link>
      </Box>

      <Box display="flex" justifyContent="space-between" gap="spacing.5" alignItems="stretch">
        <Box flex={1}>
          <Card elevation="none" padding="spacing.5" height="100%">
            <CardBody height="100%">
              <Box display="flex" alignItems="start" gap="spacing.5" height="100%">
                <Box flexShrink={0} marginTop="spacing.2">
                  <AlertTriangleIcon color="feedback.icon.negative.intense" size="large" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text size="large" weight="semibold">
                    Your settlements are on hold.
                  </Text>
                  <Text
                    size="medium"
                    weight="medium"
                    marginBottom="spacing.4"
                    color="surface.text.gray.muted"
                  >
                    Your bank account details need to be updated to receive settlement money in your
                    bank account.
                  </Text>
                  <Box marginTop="spacing.4">
                    <Button variant="secondary" size="small">
                      Update bank account
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
        <Box flex={1}>
          <Card elevation="none" padding="spacing.5" height="100%">
            <CardBody height="100%">
              <Box display="flex" alignItems="start" gap="spacing.5" height="100%">
                <Box flexShrink={0} marginTop="spacing.2">
                  <AlertTriangleIcon color="feedback.icon.negative.intense" size="large" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text size="large" weight="semibold">
                    You have 10 overdue invoices.
                  </Text>
                  <Text
                    size="medium"
                    weight="medium"
                    marginBottom="spacing.4"
                    color="surface.text.gray.muted"
                  >
                    Pay your overdue invoices immediately to avoid any resultant penalties.
                  </Text>
                  <Box marginTop="spacing.4">
                    <Button variant="secondary" size="small">
                      View overdue invoices
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
        <Box flex={1}>
          <Card elevation="none" padding="spacing.5" height="100%">
            <CardBody height="100%">
              <Box display="flex" alignItems="start" gap="spacing.5" height="100%">
                <Box flexShrink={0} marginTop="spacing.2">
                  <AlertTriangleIcon color="feedback.icon.negative.intense" size="large" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text size="large" weight="semibold">
                    Success rate down to 75% since yesterday
                  </Text>
                  <Text
                    size="medium"
                    weight="medium"
                    marginBottom="spacing.4"
                    color="surface.text.gray.muted"
                  >
                    Your success rates have dropped. Razorpay can help you find solutions to
                    increase it.
                  </Text>
                  <Box marginTop="spacing.4">
                    <Button variant="secondary" size="small">
                      View success rate boosters
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const PaymentInsights = (): React.ReactElement => {
  return (
    <Box padding="spacing.5">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.5"
      >
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Heading size="large" weight="semibold">
            Payment weekly insights
          </Heading>
          <Badge icon={CalendarIcon} color="neutral" size="medium" emphasis="subtle">
            1-7 Nov '24
          </Badge>
          <Badge color="neutral" size="medium" emphasis="subtle">
            updated every week
          </Badge>
        </Box>
        <Box display="flex" alignItems="center" gap="spacing.5">
          <Dropdown>
            <SelectInput size="medium" accessibilityLabel="Select a week" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="This week" value="this_week" />
                <ActionListItem title="Last week" value="last_week" />
                <ActionListItem title="This month" value="this_month" />
                <ActionListItem title="Last month" value="last_month" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
          <Button variant="secondary" size="medium" icon={ArrowRightIcon} iconPosition="right">
            See detailed payment insights
          </Button>
        </Box>
      </Box>

      {/* Metrics Grid */}
      <Box display="flex" gap="spacing.5" marginBottom="spacing.5">
        {/* Payments Collected Card */}
        <Box height="auto">
          <Card elevation="none" padding="spacing.5" height="100%">
            <CardBody height="100%">
              <Box display="flex" flexDirection="column" gap="spacing.3" height="100%">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="large" weight="semibold" color="surface.text.gray.muted">
                    Payments collected
                  </Text>
                  <Tooltip content="This rate is defined by [number of successful transactions/attempted transactions]">
                    <InfoIcon size="small" color="surface.icon.gray.muted" />
                  </Tooltip>
                </Box>
                <Box display="flex" alignItems="center" gap="spacing.7">
                  <Amount
                    type="heading"
                    size="xlarge"
                    value={20600000}
                    currency="INR"
                    suffix="humanize"
                    weight="semibold"
                    isAffixSubtle={true}
                  />
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <ArrowDownIcon size="small" color="feedback.icon.negative.intense" />
                    <Text color="feedback.text.negative.intense" size="medium" weight="semibold">
                      7.09% vs last week
                    </Text>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap="spacing.3" marginTop="spacing.5">
                  <Badge color="neutral" size="medium" emphasis="subtle" icon={RayIcon}>
                    Insight by RAY
                  </Badge>
                  <Divider variant="subtle" />
                </Box>

                <Box display="flex" gap="spacing.5" marginTop="spacing.5">
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box
                      flexShrink={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="48px"
                      height="48px"
                      backgroundColor="surface.background.gray.subtle"
                      borderRadius="max"
                    >
                      <MapPinIcon size="medium" color="surface.icon.gray.normal" />
                    </Box>
                    <Text as="span" size="large" weight="semibold">
                      Karnataka{' '}
                      <Text as="span" size="large" color="surface.text.gray.muted" weight="regular">
                        tops Maharashtra in revenue collection.
                      </Text>
                    </Text>
                    <Text size="large" color="surface.text.gray.muted" weight="regular">
                      It's collection: ₹45.16L
                    </Text>
                  </Box>
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box
                      flexShrink={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="48px"
                      height="48px"
                      backgroundColor="surface.background.gray.subtle"
                      borderRadius="max"
                    >
                      <DollarIcon size="medium" color="surface.icon.gray.normal" />
                    </Box>
                    <Text as="span" size="large" weight="semibold">
                      UPI{' '}
                      <Text as="span" size="large" color="surface.text.gray.muted" weight="regular">
                        remains the top payment method.
                      </Text>
                    </Text>
                    <Text size="large" color="surface.text.gray.muted" weight="regular">
                      Its usage surged to 46% this week, up from 43%.
                    </Text>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>

        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box display="flex" flexDirection="row" gap="spacing.5">
            {/* Success Rate Card */}
            <Card elevation="none" padding="spacing.5">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.3">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Text size="large" weight="semibold" color="surface.text.gray.muted">
                      Success rate
                    </Text>
                    <Tooltip content="This rate is defined by [number of successful transactions/attempted transactions]">
                      <InfoIcon size="small" color="surface.icon.gray.muted" />
                    </Tooltip>
                  </Box>
                  <Box display="flex" alignItems="center" gap="spacing.7">
                    <Heading size="2xlarge" weight="semibold">
                      91.2%
                    </Heading>
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <ArrowDownIcon size="small" color="feedback.icon.negative.intense" />
                      <Text color="feedback.text.negative.intense" size="medium" weight="semibold">
                        7.09% vs last week
                      </Text>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap="spacing.3" marginTop="spacing.5">
                    <Badge color="neutral" size="medium" emphasis="subtle" icon={RayIcon}>
                      RAY recommended
                    </Badge>
                    <Divider variant="subtle" />
                  </Box>

                  <Box display="flex" gap="spacing.5" marginTop="spacing.5">
                    <Box display="flex" alignItems="flex-start" gap="spacing.3">
                      <Box
                        flexShrink={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width="48px"
                        height="48px"
                        backgroundColor="surface.background.gray.subtle"
                        borderRadius="max"
                      >
                        <BankIcon size="medium" color="surface.icon.gray.normal" />
                      </Box>
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium">
                          Switching Netbanking to Billdesk and Razorpay will boost success by 1.2%.
                        </Text>
                        <Link href="#" size="medium">
                          CTA text
                        </Link>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardBody>
            </Card>

            {/* Expected Seasonal Trends Card */}
            <BladeProvider colorScheme="dark" themeTokens={bladeTheme}>
              <Box
                elevation="none"
                padding="spacing.5"
                borderRadius="medium"
                backgroundColor="surface.background.cloud.subtle"
              >
                <Box display="flex" flexDirection="column" gap="spacing.3">
                  <Text size="medium" color="surface.text.gray.muted" weight="semibold">
                    Expected seasonal trends
                  </Text>
                  <Heading size="xlarge" weight="semibold" color="surface.text.gray.normal">
                    12L additional revenue & 30% increase in sales
                  </Heading>
                  <Heading size="small" color="surface.text.gray.muted">
                    during the Diwali month.
                  </Heading>
                </Box>
              </Box>
            </BladeProvider>
          </Box>

          {/* Refunds Section */}
          <Box>
            <Card elevation="none" padding="spacing.5">
              <CardBody>
                <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center">
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Text size="large" weight="semibold" color="surface.text.gray.muted">
                        Refunds
                      </Text>
                      <Tooltip content="Total amount refunded to customers">
                        <InfoIcon size="small" color="surface.icon.gray.muted" />
                      </Tooltip>
                    </Box>

                    <Box display="flex" alignItems="center" gap="spacing.7">
                      <Amount
                        type="heading"
                        size="xlarge"
                        value={2811000}
                        currency="INR"
                        suffix="humanize"
                        weight="semibold"
                        isAffixSubtle={true}
                      />
                      <Box display="flex" alignItems="center" gap="spacing.2">
                        <ArrowDownIcon size="small" color="feedback.icon.negative.intense" />
                        <Text
                          color="feedback.text.negative.intense"
                          size="medium"
                          weight="semibold"
                        >
                          7.09% vs last week
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Badge color="neutral" size="medium" emphasis="subtle" icon={RayIcon}>
                        Insight by RAY
                      </Badge>
                      <Divider variant="subtle" />
                    </Box>

                    <Box display="flex" alignItems="center" gap="spacing.3" marginTop="spacing.5">
                      <Box
                        flexShrink={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width="48px"
                        height="48px"
                        backgroundColor="surface.background.gray.subtle"
                        borderRadius="max"
                      >
                        <CornerUpRightIcon size="medium" color="surface.icon.gray.normal" />
                      </Box>
                      <Text size="medium" color="surface.text.gray.muted">
                        RTO requests from Delhi surged by 15% last week
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const OtherweeklyInsights = (): React.ReactElement => {
  return (
    <Box padding="spacing.5">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.5"
      >
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Heading size="large" weight="semibold">
            Other weekly insights
          </Heading>
          <Badge icon={CalendarIcon} color="neutral" size="medium" emphasis="subtle">
            1-7 Nov '24
          </Badge>
          <Badge color="neutral" size="medium" emphasis="subtle">
            updated every week
          </Badge>
        </Box>
        <Box>
          <Dropdown>
            <SelectInput
              size="medium"
              accessibilityLabel="Select a week"
              defaultValue="this_week"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="This week" value="this_week" />
                <ActionListItem title="Last week" value="last_week" />
                <ActionListItem title="This month" value="this_month" />
                <ActionListItem title="Last month" value="last_month" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      <Box display="flex" gap="spacing.5">
        {/* Payouts Card */}
        <Box flex={1}>
          <Card elevation="none" padding="spacing.5">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.3">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="large" weight="semibold" color="surface.text.gray.muted">
                    Payouts
                  </Text>
                  <Tooltip content="Total amount paid out to merchants">
                    <InfoIcon size="small" color="surface.icon.gray.muted" />
                  </Tooltip>
                </Box>
                <Box display="flex" alignItems="center" gap="spacing.7">
                  <Amount
                    type="heading"
                    size="xlarge"
                    value={4012000}
                    currency="INR"
                    suffix="humanize"
                    weight="semibold"
                    isAffixSubtle={true}
                  />
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <ArrowDownIcon size="small" color="feedback.icon.negative.intense" />
                    <Text color="feedback.text.negative.intense" size="medium" weight="semibold">
                      7.09% vs last week
                    </Text>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap="spacing.3" marginTop="spacing.5">
                  <Badge color="neutral" size="medium" emphasis="subtle" icon={RayIcon}>
                    Insight by RAY
                  </Badge>
                  <Divider variant="subtle" />
                </Box>

                <Box display="flex" gap="spacing.5" marginTop="spacing.5">
                  <Box display="flex" alignItems="flex-start" gap="spacing.3">
                    <Box
                      flexShrink={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="48px"
                      height="48px"
                      backgroundColor="surface.background.gray.subtle"
                      borderRadius="max"
                    >
                      <BankIcon size="medium" color="surface.icon.gray.normal" />
                    </Box>
                    <Box display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="medium">
                        Atlassian was your biggest expense last week, amounting to ₹2.49L.
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Employees and Payroll Card */}
        <Box flex={1}>
          <Card elevation="none" padding="spacing.5" height="100%">
            <CardBody height="100%">
              <Box display="flex" flexDirection="column" gap="spacing.3" height="100%">
                <Text size="large" weight="semibold" color="surface.text.gray.muted">
                  Employees and payroll
                </Text>
                <Heading size="xlarge" weight="semibold">
                  Run payroll through Razorpay
                </Heading>
                <Box marginTop="auto">
                  <Button
                    variant="secondary"
                    size="small"
                    icon={ArrowUpRightIcon}
                    iconPosition="right"
                  >
                    Get started
                  </Button>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Marketing Stack Card */}
        <Box flex={1}>
          <Card elevation="none" padding="spacing.5" height="100%">
            <CardBody height="100%">
              <Box display="flex" flexDirection="column" gap="spacing.3" height="100%">
                <Text size="large" weight="semibold" color="surface.text.gray.muted">
                  Customers
                </Text>
                <Heading size="xlarge" weight="semibold">
                  Marketing stack coming soon
                </Heading>
                <Box marginTop="auto">
                  <Button variant="secondary" size="small">
                    Join the waitlist
                  </Button>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const Insights = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5" id="main-element">
      <CriticalActions />
      <PaymentInsights />
      <OtherweeklyInsights />
    </Box>
  );
};

export default Insights;
