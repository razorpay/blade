import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Skeleton, Skeleton as SkeletonComponent } from './Skeleton';
import type { SkeletonProps } from './Skeleton';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderBadge,
  CardHeaderLeading,
  CardHeaderTrailing,
} from '~components/Card';
import { Box } from '~components/Box';
import { Divider } from '~components/BaseHeaderFooter/Divider.web';
import { Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Button } from '~components/Button';
import { Alert } from '~components/Alert';

export default {
  title: 'Components/Skeleton',
  component: SkeletonComponent,
  argTypes: {},
} as Meta<SkeletonProps>;

const SkeletonTemplate: ComponentStory<typeof SkeletonComponent> = () => {
  return (
    <Card>
      <CardBody>
        <SkeletonComponent
          marginBottom="spacing.3"
          borderRadius="medium"
          width="100%"
          height="30px"
        />
        <SkeletonComponent
          marginBottom="spacing.3"
          borderRadius="medium"
          width="100%"
          height="30px"
        />
        <SkeletonComponent
          marginBottom="spacing.3"
          borderRadius="medium"
          width="100%"
          height="30px"
        />
      </CardBody>
    </Card>
  );
};

export const Default = SkeletonTemplate.bind({});

const LoadableCard = ({ isLoading }: { isLoading: boolean }): React.ReactElement => {
  return (
    <Card padding="spacing.7">
      <CardBody>
        {isLoading ? (
          <Box
            display="flex"
            flexDirection="column"
            gap="spacing.3"
            backgroundColor="surface.background.level2.lowContrast"
          >
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Skeleton type="heading-medium" width="50%" borderRadius="medium" />
              <Skeleton type="title-medium" width="30%" borderRadius="medium" />
              <Skeleton type="body-medium" width="50%" borderRadius="medium" />
            </Box>
            <Skeleton height="60px" borderRadius="medium" />
            <Box marginTop="spacing.3" />
            <Divider />
            <Box marginBottom="spacing.3" />
            <Skeleton type="body-medium" height="20px" numberOfLines={2} borderRadius="medium" />
            <Skeleton type="body-medium" height="20px" numberOfLines={2} borderRadius="medium" />
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap="spacing.3"
            backgroundColor="surface.background.level2.lowContrast"
          >
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="medium">Total Repayable Amount</Heading>
              <Amount size="title-medium" value={160000} />
              <Text>
                Principal:{' '}
                <Text as="span" weight="bold">
                  ₹16000
                </Text>{' '}
                Interest:{' '}
                <Text as="span" weight="bold">
                  ₹450
                </Text>
              </Text>
            </Box>
            <Alert
              isFullWidth
              intent="information"
              description="The interest charged will be deposited back to your bank account within a day of payment"
            />
            <Box marginTop="spacing.3" />
            <Divider />
            <Box marginBottom="spacing.3" />
            <Text>
              The amount will be deducted in 3 installments from your settlement balance between Feb
              18-20 on daily basis
            </Text>
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

const SkeletonComplexTemplate: ComponentStory<typeof SkeletonComponent> = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      <Button onClick={() => setIsLoading((prev) => !prev)}>Toggle Loading</Button>
      <Box marginY="spacing.4" display="flex" flexDirection="row" gap="spacing.4">
        <LoadableCard isLoading={isLoading} />
        <LoadableCard isLoading={isLoading} />
      </Box>
    </>
  );
};

export const Complex = SkeletonComplexTemplate.bind({});

const SkeletonCardTemplate: ComponentStory<typeof SkeletonComponent> = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  // Expose elevation prop on Box
  return (
    <>
      <Button
        onClick={() => {
          setIsLoading((prev) => !prev);
        }}
      >
        Toggle
      </Button>
      <Box width="300px" margin="spacing.4">
        {isLoading ? (
          <Box>
            <Box
              padding="spacing.5"
              display="flex"
              gap="spacing.2"
              flexDirection="column"
              backgroundColor="surface.background.level2.lowContrast"
            >
              <Box marginBottom="spacing.5" display="flex" flexDirection="column" gap="spacing.2">
                <Skeleton width="100%" height="30px" />
                <Skeleton width="100%" height="20px" />
              </Box>
              <Divider />
              <Skeleton marginTop="spacing.5" width="100%" height="100px" />
            </Box>
          </Box>
        ) : (
          <Card>
            <CardHeader>
              <CardHeaderLeading title="Payment options" subtitle="2% additional expense" />
              <CardHeaderTrailing
                visual={<CardHeaderBadge variant="neutral">NEW</CardHeaderBadge>}
              />
            </CardHeader>
            <CardBody>
              <Text>
                Similar to Amount component we can expose a type prop which will have predefined
                sizes & we also expose numberOfLines prop which will dictate how many skeletons it
                will map to.
              </Text>
            </CardBody>
          </Card>
        )}
      </Box>
    </>
  );
};

export const CardExample = SkeletonCardTemplate.bind({});
