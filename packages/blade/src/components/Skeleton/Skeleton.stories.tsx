import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { SkeletonProps } from './';
import { Skeleton, Skeleton as SkeletonComponent } from './';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderBadge,
  CardHeaderLeading,
  CardHeaderTrailing,
} from '~components/Card';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Button } from '~components/Button';
import { Alert } from '~components/Alert';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Divider } from '~components/Divider';
import { announce } from '~components/LiveAnnouncer';
import { List, ListItem, ListItemCode } from '~components/List';
import { isReactNative } from '~utils';
import { motion } from '~tokens/global';
import { kebabCase } from '~utils/lodashButBetter/kebabCase';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Skeleton"
      componentDescription="Skeleton Loader is a static / animated placeholder for the information that is still loading. It mimic the structure and look of the entire view."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85414&t=R6i97c0Mf28p8ZvY-1&scaling=min-zoom&page-id=16498%3A256331&mode=design"
    >
      <Heading size="large">Usage</Heading>{' '}
      <Sandbox>
        {`
        import { Skeleton } from '@razorpay/blade/components';
        
        function App() {
          return (
            <Skeleton width="100%" height="50px" margin="spacing.4" />
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const STYLED_PROP_CATEGORY = 'StyledProps';
const propertiesToOverride = [
  'width',
  'height',
  'minWidth',
  'minHeight',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginX',
  'marginY',
  'top',
  'left',
  'bottom',
  'right',
  'maxHeight',
  'maxWidth',
  'gap',
  'flex',
  'columnGap',
  'rowGap',
];

const argTypes = propertiesToOverride.reduce((prev, curr) => {
  return {
    ...prev,
    [curr]: {
      description: `**CSS property \`${curr}\`**\n\n\n\n<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/${kebabCase(
        curr,
      )}">MDN Docs for ${kebabCase(curr)}</a><br/><br/>`,
      table: {
        category: STYLED_PROP_CATEGORY,
        type: {
          summary: `MakeValueResponsive<CSSObject['${curr}']>`,
        },
      },
      name: curr,
    },
  };
}, {});

export default {
  title: 'Components/Skeleton',
  component: SkeletonComponent,
  tags: ['autodocs'],
  argTypes: {
    ...argTypes,
    borderRadius: {
      table: {
        category: STYLED_PROP_CATEGORY,
      },
    },
    __brand__: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    width: '100%',
    height: '50px',
    borderRadius: 'medium',
  },
  parameters: {
    chromatic: { delay: motion.duration['2xgentle'] },
    docs: {
      page: Page,
    },
  },
} as Meta<SkeletonProps>;

const SkeletonTemplate: StoryFn<typeof SkeletonComponent> = (args) => {
  return (
    <Box padding="spacing.3" display="flex" gap="spacing.3" flexWrap="wrap">
      <Skeleton width="50%" height="50px" borderRadius="medium" {...args} />
    </Box>
  );
};

export const Default = SkeletonTemplate.bind({});

const BasicSkeleton = (): React.ReactElement => {
  // Not using gaps because RN
  return (
    <Box
      flex={isReactNative() ? undefined : 1}
      flexDirection="column"
      width="100%"
      padding="spacing.5"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <SkeletonComponent
          width="60px"
          height="60px"
          borderRadius="max"
          flexShrink={0}
          marginRight="spacing.3"
        />
        <Box width="100%" display="flex" flexDirection="column">
          <SkeletonComponent
            borderRadius="medium"
            width="50%"
            height="30px"
            marginBottom="spacing.3"
          />
          <SkeletonComponent borderRadius="medium" width="70%" height="20px" />
        </Box>
      </Box>

      <Box marginTop="spacing.4" display="flex" flexDirection="column">
        <SkeletonComponent
          borderRadius="medium"
          width="100%"
          height="20px"
          marginBottom="spacing.3"
        />
        <SkeletonComponent
          borderRadius="medium"
          width="100%"
          height="20px"
          marginBottom="spacing.3"
        />
        <SkeletonComponent borderRadius="medium" width="90%" height="20px" />
      </Box>
    </Box>
  );
};

const BasicTemplate: StoryFn<typeof SkeletonComponent> = () => {
  return (
    <Box padding="spacing.3" display="flex" gap="spacing.3" flexWrap="wrap">
      <BasicSkeleton />
      <BasicSkeleton />
      <BasicSkeleton />
    </Box>
  );
};

export const Basic = BasicTemplate.bind({});

const LoadableCard = ({ isLoading }: { isLoading: boolean }): React.ReactElement => {
  // Not using gap="" because RN
  // TODO change to gap since we upgrade RN
  return (
    <Card padding="spacing.7">
      <CardBody>
        {isLoading ? (
          <Box
            display="flex"
            flexDirection="column"
            backgroundColor="surface.background.gray.intense"
          >
            <Box display="flex" flexDirection="column" marginBottom="spacing.3">
              <Skeleton
                height="24px"
                width={{ s: '80%', base: '50%' }}
                borderRadius="medium"
                marginBottom="spacing.3"
              />
              <Skeleton
                height="40px"
                width={{ s: '60%', base: '30%' }}
                borderRadius="medium"
                marginBottom="spacing.3"
              />
              <Skeleton height="20px" width={{ s: '80%', base: '50%' }} borderRadius="medium" />
            </Box>
            <Skeleton height="65px" borderRadius="medium" marginBottom="spacing.3" />
            <Box marginY="spacing.3" />
            <Divider />
            <Box marginBottom="spacing.4" marginTop="spacing.3" />
            <Skeleton height="20px" width="100%" borderRadius="medium" marginBottom="spacing.2" />
            <Skeleton height="20px" width="100%" borderRadius="medium" />
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap="spacing.3"
            backgroundColor="surface.background.gray.intense"
          >
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="medium">Total Repayable Amount</Heading>
              <Amount size="large" value={160000} />
              <Text>
                Principal:{' '}
                <Text as="span" weight="semibold">
                  ₹16000
                </Text>{' '}
                Interest:{' '}
                <Text as="span" weight="semibold">
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

const SkeletonComplexTemplate: StoryFn<typeof SkeletonComponent> = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      <Button onClick={() => setIsLoading((prev) => !prev)}>Toggle Loading</Button>

      <Text marginY="spacing.4">
        Skeleton supports subset of Box properties like margin, padding, flex to help you position
        it as per your needs to compose more complex skeleton layouts.
      </Text>
      <Box
        marginY="spacing.4"
        display="flex"
        flexWrap="wrap"
        flexDirection={{ s: 'row', base: 'column' }}
      >
        {isReactNative() ? (
          <LoadableCard isLoading={isLoading} />
        ) : (
          <>
            <Box flex={1} marginBottom="spacing.4" marginRight="spacing.4">
              <LoadableCard isLoading={isLoading} />
            </Box>
            <Box flex={1}>
              <LoadableCard isLoading={isLoading} />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export const Complex = SkeletonComplexTemplate.bind({});

const SkeletonCardTemplate: StoryFn<typeof SkeletonComponent> = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      <Button
        onClick={() => {
          setIsLoading((prev) => !prev);
        }}
      >
        Toggle Loading
      </Button>
      <Text marginY="spacing.4">
        You can also use Skeleton to show loading states for existing blade components by composing
        multiple Skeletons and laying them out via layout props.
      </Text>
      <Box width={{ xs: '100%', m: '400px' }} marginTop="spacing.4">
        {isLoading ? (
          <Box
            padding="spacing.7"
            display="flex"
            gap="spacing.2"
            flexDirection="column"
            backgroundColor="surface.background.gray.intense"
            elevation="lowRaised"
            borderRadius="medium"
          >
            <Box marginBottom="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
              <Skeleton width="100%" height="24px" borderRadius="medium" />
              <Skeleton width="50%" height="20px" borderRadius="medium" />
            </Box>
            <Divider />
            <Skeleton marginTop="spacing.5" width="100%" height="100px" borderRadius="medium" />
          </Box>
        ) : (
          <Card>
            <CardHeader>
              <CardHeaderLeading title="Payment Pages" subtitle="Automated Receipts Enabled" />
              <CardHeaderTrailing visual={<CardHeaderBadge color="neutral">UPI</CardHeaderBadge>} />
            </CardHeader>
            <CardBody>
              <Text>
                Razorpay Payment Pages is the easiest way to accept payments with a custom-branded
                online store. Accept international and domestic payments with automated payment
                receipts. Take your store online instantly with zero coding.
              </Text>
            </CardBody>
          </Card>
        )}
      </Box>
    </>
  );
};

export const CardExample = SkeletonCardTemplate.bind({});

const SkeletonAccessibilityTemplate: StoryFn<typeof SkeletonComponent> = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    announce(isLoading ? 'Usage with announce loading' : 'Usage with announce finished loading');
  }, [isLoading]);

  if (isReactNative()) return <Text>Story not available on ReactNative</Text>;

  return (
    <>
      <Text marginBottom="spacing.4">
        To make Skeleton loader accessible and let consumers know that some content on the page is
        loading there are few options:
      </Text>
      <List>
        <ListItem>
          If you have a section of the page which is loading you can wrap the whole section in a div
          and set <ListItemCode>aria-busy</ListItemCode> to indicate the content is loading
        </ListItem>
        <ListItem>
          If you are using a button which triggers a loading state and you've set{' '}
          <ListItemCode>&lt;Button isLoading /&gt;</ListItemCode>, you do not need to do anything
          because button already announces the loading state
        </ListItem>
        <ListItem>
          Finally, if you want to announce a page level loading state you can utilize the{' '}
          <ListItemCode>announce()</ListItemCode> method exposed by blade to convey the loading
          state to the user.
        </ListItem>
      </List>

      <Heading marginY="spacing.5">
        Example 1: <Code size="medium">announce()</Code> method
      </Heading>
      <Button
        onClick={() => {
          setIsLoading((prev) => !prev);
        }}
      >
        Toggle Loading
      </Button>
      <Box width="400px" marginTop="spacing.4">
        {isLoading ? (
          <Box
            padding="spacing.7"
            display="flex"
            gap="spacing.2"
            flexDirection="column"
            backgroundColor="surface.background.gray.intense"
            elevation="lowRaised"
            borderRadius="medium"
          >
            <Box marginBottom="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
              <Skeleton width="100%" height="24px" borderRadius="medium" />
              <Skeleton width="50%" height="20px" borderRadius="medium" />
            </Box>
            <Divider />
            <Skeleton marginTop="spacing.5" width="100%" height="100px" borderRadius="medium" />
          </Box>
        ) : (
          <Card>
            <CardHeader>
              <CardHeaderLeading title="Payment Pages" subtitle="Automated Receipts Enabled" />
              <CardHeaderTrailing visual={<CardHeaderBadge color="neutral">UPI</CardHeaderBadge>} />
            </CardHeader>
            <CardBody>
              <Text>
                Razorpay Payment Pages is the easiest way to accept payments with a custom-branded
                online store. Accept international and domestic payments with automated payment
                receipts. Take your store online instantly with zero coding.
              </Text>
            </CardBody>
          </Card>
        )}
      </Box>

      <Heading marginY="spacing.5">Example 2: aria-busy method</Heading>

      <section aria-busy={isLoading}>
        <Box width="50%" display="flex" gap="spacing.3" flexWrap="wrap">
          {isLoading ? (
            <>
              <BasicSkeleton />
              <BasicSkeleton />
              <BasicSkeleton />
            </>
          ) : (
            <Text>Content loaded</Text>
          )}
        </Box>
      </section>
    </>
  );
};

export const SkeletonAccessibility = SkeletonAccessibilityTemplate.bind({});
