import { useState } from 'react';
import { Box, Card, CardBody } from '../../components';
import { Heading, Text } from '~components/Typography';
import { Chip, ChipGroup } from '~components/Chip';
import { InfoIcon, RazorpayIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import { Button } from '~components/Button';

const PhantomUI = (): React.ReactElement => {
  const [selectedBusinessType, setSelectedBusinessType] = useState('Individual');
  return (
    <Box maxWidth="375px">
      <Card elevation="lowRaised">
        <CardBody>
          <Box>
            <Heading size="large">What's your business type?</Heading>
            <Text size="medium">Pick only one that applies to your business</Text>
          </Box>
          <Box marginTop="spacing.10">
            <Box display="flex" flexDirection="row" gap="spacing.2">
              <Text size="medium">NOT REGISTERED</Text>
              <IconButton
                icon={InfoIcon}
                onClick={() => {
                  console.log('first icon clicked');
                }}
                accessibilityLabel="Click to know more"
              />
            </Box>
            <ChipGroup
              accessibilityLabel="Select business type"
              selectionType="single"
              value={selectedBusinessType}
              onChange={({ values }) => setSelectedBusinessType(values[0])}
              marginTop="spacing.4"
            >
              <Chip value="Individual">Individual</Chip>
              <Chip value="SmallBusiness">Small Business</Chip>
            </ChipGroup>
          </Box>
          <Box marginTop="spacing.8">
            <Box display="flex" flexDirection="row" gap="spacing.2">
              <Text size="medium">REGISTERED</Text>
              <IconButton
                icon={InfoIcon}
                onClick={() => {
                  console.log('first icon clicked');
                }}
                accessibilityLabel="Click to know more"
              />
            </Box>
            <ChipGroup
              accessibilityLabel="Select business type"
              selectionType="single"
              value={selectedBusinessType}
              onChange={({ values }) => setSelectedBusinessType(values[0])}
              marginTop="spacing.4"
            >
              <Chip value="proprietorship">Proprietorship</Chip>
              <Chip value="Partnership">Partnership</Chip>
              <Chip value="LLP">LLP</Chip>
              <Chip value="PrivateLimited">Private limited</Chip>
              <Chip value="PublicLimited">Public limited</Chip>
              <Chip value="Society">Society</Chip>
              <Chip value="HUF">HUF</Chip>
            </ChipGroup>
          </Box>
          <Box
            marginLeft="spacing.3"
            marginRight="spacing.3"
            marginTop="spacing.8"
            textAlign="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Button size="large" isFullWidth>
              Continue
            </Button>
            <Box display="flex" flexDirection="row" marginTop="spacing.3" alignItems="center">
              <RazorpayIcon
                color="interactive.icon.gray.normal"
                size="medium"
                marginRight="spacing.2"
              />
              <Text>Powered by Razorpay</Text>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export { PhantomUI };
