/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { Route, useHistory, useLocation, matchPath } from 'react-router-dom';
import type { StepGroupProps, StepItemProps } from './types';
import { StepItem, StepGroup, StepItemIndicator, StepItemIcon } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import {
  BriefcaseIcon,
  ClockIcon,
  FileIcon,
  HeartIcon,
  RazorpayIcon,
  UserIcon,
} from '~components/Icons';
import { Alert } from '~components/Alert';
import { Text } from '~components/Typography';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="StepGroup"
      componentDescription="Step Group visualises sequential processes with a consistent structure. It can be interactive, guiding users through steps, or function as a timeline for reference."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=85892-80483&scaling=min-zoom&page-id=83575%3A87543&mode=design&t=QJnz2culisyKAoNz-1"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { 
          StepGroup, 
          StepItem, 
          StepItemIcon,
          Badge,
          FileIcon, 
          UserIcon,
          BriefcaseIcon,
          ClockIcon,
          HeartIcon,
        } from '@razorpay/blade/components';

        function App() {
          return (
            // Check console
            <StepGroup orientation="vertical" size="medium">
              <StepItem
                title="Introduction"
                timestamp="Thu, 11th Oct'23 | 12:00pm"
                stepProgress="full"
                marker={<StepItemIcon icon={FileIcon} color="positive" />}
              />
              <StepItem
                title="Personal Details"
                timestamp="Mon, 15th Oct'23 | 12:00pm"
                description="Your Personal Details for onboarding"
                stepProgress="full"
                marker={<StepItemIcon icon={UserIcon} color="positive" />}
              />
              <StepItem
                title="Business Details"
                trailing={
                  <Badge color="positive" size="medium">
                    Received by our team
                  </Badge>
                }
                stepProgress="full"
                marker={<StepItemIcon icon={BriefcaseIcon} color="positive" />}
              />
              <StepItem
                title="Needs Response"
                timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
                stepProgress="start"
                marker={<StepItemIcon icon={ClockIcon} color="notice" />}
              />
              <StepItem
                title="Complete Onboarding"
                marker={<StepItemIcon icon={HeartIcon} color="neutral" />}
                trailing={
                  <Badge color="neutral" size="medium">
                    Pending
                  </Badge>
                }
              />
            </StepGroup>
          );
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/StepGroup',
  component: StepGroup,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    _nestingLevel: {
      table: {
        disable: true,
      },
    },
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/onboarding/introduction'] })] as unknown,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<StepGroupProps>;

const stepsSampleData: StepItemProps[] = [
  {
    title: 'Introduction',
    timestamp: 'Mon, 15th Oct’23 | 12:00pm',
    description: 'Introduction to Razorpay Payment Gateway',
  },
  {
    title: 'Personal Details',
    timestamp: 'Mon, 16th Oct’23 | 12:00pm',
    description: 'Fill your Personal Details for onboarding',
  },
  {
    title: 'Business Details',
    timestamp: 'Mon, 17th Oct’23 | 12:00pm',
    description: 'Fill your Business Details for onboarding',
    isDisabled: true,
  },
  {
    title: 'Complete Onboarding',
    timestamp: 'Mon, 20th Oct’23 | 12:00pm',
    description: 'Complete your onboarding to start',
  },
];

const StepGroupInteractiveTemplate: StoryFn<typeof StepGroup> = (args) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  return (
    <Box>
      <Alert
        color="information"
        isDismissible={false}
        isFullWidth={true}
        description="Click Items to interact with the StepGroup"
        marginBottom="spacing.8"
      />
      <StepGroup {...args}>
        {stepsSampleData.map((stepInfo, index) => (
          <StepItem
            key={`${stepInfo.title}-${index}`}
            isSelected={selectedIndex === index}
            marker={<StepItemIndicator color={selectedIndex === index ? 'primary' : 'neutral'} />}
            onClick={() => setSelectedIndex(index)}
            stepProgress={
              index === selectedIndex ? 'start' : index < selectedIndex ? 'full' : 'none'
            }
            {...stepInfo}
          />
        ))}
      </StepGroup>
    </Box>
  );
};

const StepGroupStaticTemplate: StoryFn<typeof StepGroup> = (args) => {
  const isVertical = args.orientation === 'vertical';
  return (
    <StepGroup {...args}>
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Disputes Contested"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Disputes contested for Rs 5000"
        stepProgress="full"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Disputes Under Review"
        trailing={
          isVertical ? (
            <Badge color="positive" size={args.size}>
              Received by our team
            </Badge>
          ) : undefined
        }
        stepProgress="full"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Needs Response"
        titleColor="feedback.text.notice.intense"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
        marker={<StepItemIndicator color="notice" />}
      >
        <Button size="medium" variant="secondary">
          Submit Documents
        </Button>
      </StepItem>
      <StepItem
        title="Documents Sent to the Bank"
        description="Bank might take up to 3 months to review"
        trailing={
          isVertical ? (
            <Badge color="neutral" size={args.size}>
              Pending
            </Badge>
          ) : undefined
        }
      />
      <StepItem
        title="Decision from the Bank"
        trailing={
          isVertical ? (
            <Badge color="neutral" size={args.size}>
              Pending
            </Badge>
          ) : undefined
        }
      />
    </StepGroup>
  );
};
const StepGroupNestedTemplate: StoryFn<typeof StepGroup> = (args) => {
  const isVertical = args.orientation === 'vertical';

  return (
    <StepGroup {...args}>
      <StepItem
        title="Disputes Raised"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepItem
        title="Disputes Under Review"
        trailing={
          isVertical ? (
            <Badge color="positive" size={args.size}>
              Received by our team
            </Badge>
          ) : undefined
        }
        stepProgress="full"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepGroup>
        <StepItem
          title="Review from Razorpay Team"
          timestamp="Fri, 12th Oct'23 | 12:00pm"
          description="The dispute is reviewed by Razorpay team"
          stepProgress="full"
          marker={<StepItemIcon icon={RazorpayIcon} color="positive" />}
        />
      </StepGroup>
      <StepItem
        title="Needs Response"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
        marker={<StepItemIndicator color="positive" />}
      />
      <StepGroup>
        <StepItem
          title="Personal Documents Submission"
          marker={<StepItemIndicator color="positive" />}
        />
        <StepItem
          title="Company Documents Submission"
          titleColor="feedback.text.notice.intense"
          marker={<StepItemIndicator color="notice" />}
        >
          <Button size="medium" variant="secondary">
            Submit Documents
          </Button>
        </StepItem>
        <StepItem
          title="Documents Approval"
          trailing={
            isVertical ? (
              <Badge color="neutral" size={args.size}>
                Pending
              </Badge>
            ) : undefined
          }
        />
      </StepGroup>
      <StepItem
        title="Decision from the Bank"
        trailing={
          isVertical ? (
            <Badge color="neutral" size={args.size}>
              Pending
            </Badge>
          ) : undefined
        }
      />
    </StepGroup>
  );
};

export const StepGroupDefault = StepGroupStaticTemplate.bind({});
StepGroupDefault.args = {
  orientation: 'vertical',
  size: 'medium',
};

export const StepGroupLarge = StepGroupStaticTemplate.bind({});
StepGroupLarge.args = {
  orientation: 'vertical',
  size: 'large',
};

export const StepGroupInteractive = StepGroupInteractiveTemplate.bind({});
StepGroupInteractive.args = {
  orientation: 'vertical',
  size: 'medium',
};

export const StepGroupInteractiveHorizontal = StepGroupInteractiveTemplate.bind({});
StepGroupInteractiveHorizontal.args = {
  orientation: 'horizontal',
  size: 'medium',
};

export const StepGroupNested = StepGroupNestedTemplate.bind({});
StepGroupNested.args = {
  orientation: 'vertical',
  size: 'medium',
};

export const StepGroupWithIcons = (args: StepGroupProps) => {
  const isVertical = args.orientation === 'vertical';

  return (
    <StepGroup {...args}>
      <StepItem
        title="Introduction"
        timestamp="Thu, 11th Oct'23 | 12:00pm"
        stepProgress="full"
        marker={<StepItemIcon icon={FileIcon} color="positive" />}
      />
      <StepItem
        title="Personal Details"
        timestamp="Mon, 15th Oct'23 | 12:00pm"
        description="Your Personal Details for onboarding"
        stepProgress="full"
        marker={<StepItemIcon icon={UserIcon} color="positive" />}
      />
      <StepItem
        title="Business Details"
        trailing={
          isVertical ? (
            <Badge color="positive" size={args.size}>
              Received by our team
            </Badge>
          ) : undefined
        }
        stepProgress="full"
        marker={<StepItemIcon icon={BriefcaseIcon} color="positive" />}
      />
      <StepItem
        title="Needs Response"
        timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
        stepProgress="start"
        marker={<StepItemIcon icon={ClockIcon} color="notice" />}
      />
      <StepItem
        title="Complete Onboarding"
        marker={<StepItemIcon icon={HeartIcon} color="neutral" />}
        trailing={
          isVertical ? (
            <Badge color="neutral" size={args.size}>
              Pending
            </Badge>
          ) : undefined
        }
      />
    </StepGroup>
  );
};

const OnboardingRoute = ({
  match,
}: {
  match: {
    params: {
      id: string;
    };
  };
}) => (
  <Text weight="semibold" marginY="spacing.4">
    React Router param: {match.params.id}
  </Text>
);

const ReactRouterExample = (args: StepGroupProps): React.ReactElement => {
  const history = useHistory();
  const navigateTo = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    history.push(url);
  };

  const location = useLocation();

  const getPathnameFromTitle = (title: string): string => {
    return `/onboarding/${title.toLowerCase().replace(/ /g, '-')}`;
  };

  const getSelectedItemIndex = (pathname: string) => {
    return stepsSampleData.findIndex((stepInfo) =>
      matchPath(pathname, getPathnameFromTitle(stepInfo.title)),
    );
  };

  return (
    <Box display="flex" flexDirection="row" minHeight="500px">
      <Box
        backgroundColor="surface.background.gray.intense"
        padding="spacing.7"
        position="fixed"
        left="spacing.0"
        top="spacing.0"
        height="100%"
        minWidth="400px"
        elevation="midRaised"
      >
        <StepGroup {...args} width="100%">
          {stepsSampleData.map((stepInfo, index) => {
            const stepPathname = getPathnameFromTitle(stepInfo.title);
            const selectedIndex = getSelectedItemIndex(location.pathname);

            const isBeforeSelectedItem = index < selectedIndex;
            const isSelectedItem = index === selectedIndex;

            return (
              <StepItem
                key={`${stepInfo.title}-${index}`}
                isSelected={isSelectedItem}
                marker={
                  <StepItemIndicator
                    color={
                      isSelectedItem ? 'primary' : isBeforeSelectedItem ? 'positive' : 'neutral'
                    }
                  />
                }
                onClick={(e) => navigateTo(e, stepPathname)}
                stepProgress={isSelectedItem ? 'start' : isBeforeSelectedItem ? 'full' : 'none'}
                {...stepInfo}
              />
            );
          })}
        </StepGroup>
      </Box>

      <Box marginLeft="400px" paddingX="spacing.6" paddingBottom="spacing.6">
        <Route path="/onboarding/:id" component={OnboardingRoute} />
      </Box>
    </Box>
  );
};

const ProductUseCase3Template: StoryFn<(props: StepGroupProps) => React.ReactElement> = (props) => {
  return <ReactRouterExample {...props} />;
};

export const StepGroupWithReactRouter = ProductUseCase3Template.bind({});
