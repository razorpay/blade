import React from 'react';
import {
  Box,
  Badge,
  Amount,
  Text,
  Button,
  Alert,
  StepGroup,
  StepItem,
  StepItemIndicator,
  Heading,
  Link,
  Card,
  CardBody,
  InfoIcon,
  UpiIcon,
  IconButton,
  MoreHorizontalIcon,
  CloseIcon,
  PlusIcon,
} from '@razorpay/blade/components';

const TransactionCard = (): React.ReactElement => {
  return (
    <Box
      padding="spacing.4"
      display="flex"
      flexDirection="column"
      gap="spacing.3"
      width="420px"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
      id="main-element"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" gap="spacing.3">
          <Badge color="notice" size="medium" emphasis="subtle" icon={InfoIcon}>
            Debit
          </Badge>
          <Badge color="information" size="medium" emphasis="subtle">
            In-progress
          </Badge>
        </Box>
        <Box display="flex" gap="spacing.3">
          <IconButton
            accessibilityLabel="More options"
            icon={MoreHorizontalIcon}
            size="medium"
            onClick={() => {
             console.log('More options');
            }}
          />
          <IconButton
            accessibilityLabel="Close"
            icon={CloseIcon}
            size="medium"
            onClick={() => {
              console.log('Close');
            }}
          />
        </Box>
      </Box>
      <Amount
        value={1000.0}
        type="heading"
        size="xlarge"
        weight="semibold"
        currency="INR"
        isAffixSubtle
      />
      <Text as="span" variant="body" size="small" weight="regular" color="surface.text.gray.muted">
        Closing balance <Amount value={999.32} currency="INR" size="small" weight="regular" />
      </Text>
      <Text variant="body" size="small" weight="regular" color="surface.text.gray.muted">
        on Wed, 30 Oct 2024 • 4:40pm
      </Text>
      <Text variant="body" size="small" weight="regular" color="surface.text.gray.muted">
        Acme Corp • Invoice #BH980
      </Text>
      <Box display="flex" gap="spacing.3" marginBottom="spacing.5" marginTop="spacing.5">
        <Button variant="primary" color="primary" size="small" isFullWidth>
          Approve
        </Button>
        <Button variant="secondary" color="negative" size="small" isFullWidth>
          Reject
        </Button>
      </Box>
      <Alert
        description="The expiry for this invoice is near. Please take action before 24th Dec 2024."
        color="notice"
        emphasis="subtle"
        isFullWidth
        isDismissible={false}
      />
      <Box marginTop="spacing.5" marginBottom="spacing.2">
        <Heading size="small" weight="semibold" textAlign="left">
          Transaction history
        </Heading>
      </Box>
      <StepGroup orientation="vertical" size="medium">
        <StepItem
          title="Added on"
          timestamp="Wed, 27th Mar'24 | 12:00pm"
          stepProgress="full"
          marker={<StepItemIndicator color="information" />}
        />
        <StepItem
          title="In approval"
          timestamp="Wed, 27th Mar'24 | 12:00pm"
          stepProgress="full"
          marker={<StepItemIndicator color="notice" />}
        />
        <StepItem
          title="Issued on"
          timestamp="Wed, 27th Mar'24 | 12:00pm"
          stepProgress="end"
          marker={<StepItemIndicator color="positive" />}
        />
      </StepGroup>
      <Box padding="spacing.5">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="spacing.5"
        >
          <Heading size="small" weight="semibold">
            Payment Methods
          </Heading>
          <Link href="#" size="medium" icon={PlusIcon}>
            Add fund account
          </Link>
        </Box>
        <Card elevation="none" backgroundColor="surface.background.gray.moderate">
          <CardBody>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="spacing.4"
            >
              <Box display="flex" alignItems="center">
                <UpiIcon size="medium" />
                <Text size="large" weight="semibold" marginLeft="spacing.3">
                  UPI
                </Text>
              </Box>
              <Badge color="positive" size="medium">
                Active
              </Badge>
            </Box>
            <Box marginBottom="spacing.4">
              <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
                <Text size="medium" weight="regular">
                  VPA ID
                </Text>
                <Text size="medium" weight="regular" color="surface.text.gray.subtle">
                  example@ybl
                </Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="medium" weight="regular">
                  Transaction ID
                </Text>
                <Text size="medium" weight="regular" color="surface.text.gray.subtle">
                  fa_PEisj2647UW
                </Text>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" gap="spacing.4">
              <Button size="xsmall" variant="primary" isFullWidth>
                Payout
              </Button>
              <Button size="xsmall" variant="tertiary" isFullWidth>
                Mark as inactive
              </Button>
            </Box>
          </CardBody>
        </Card>
        <Box marginTop="spacing.5">
          <Button size="small" variant="tertiary" isFullWidth icon={PlusIcon}>
            Add fund account
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionCard;
