import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { Route, useHistory, useLocation, matchPath, Switch } from 'react-router-dom';
import { Fade } from './';
import type { FadeProps } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { InternalCardExample } from '../Card/Card.stories';
import { TextInput } from '~components/Input/TextInput';
import { Heading, Text } from '~components/Typography';
import { Chip, ChipGroup } from '~components/Chip';
import type { StepItemProps } from '~components/StepGroup';
import { StepGroup, StepItem, StepItemIndicator } from '~components/StepGroup';
import { AnimatePresence } from 'motion/react';
import { Slide } from '~components/Slide';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Fade"
      componentDescription="Fade Motion Component (TODO)"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        const todo = 'todo';
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Fade',
  component: Fade,
  tags: ['autodocs'],
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/onboarding/introduction'] })] as unknown,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<FadeProps>;

const FadeTemplate: StoryFn<typeof Fade> = (args) => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Fade
      </Button>
      <Fade {...args} isVisible={isVisible} />
    </Box>
  );
};

export const Default = FadeTemplate.bind({});
Default.args = {
  children: <InternalCardExample />,
};

export const WithDifferentComponents = (args: typeof Fade): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.11" onClick={() => setIsVisible(!isVisible)}>
        Toggle Fade
      </Button>

      <Box
        display="flex"
        alignItems="flex-start"
        gap="spacing.8"
        flexWrap="wrap"
        backgroundColor="surface.background.gray.intense"
        padding="spacing.8"
        borderRadius="medium"
      >
        <Fade {...args} isVisible={isVisible}>
          <TextInput label="Input that fades" />
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <Button>Button that fades</Button>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <Box backgroundColor="surface.background.cloud.intense" padding="spacing.4">
            <Text color="surface.text.onCloud.onIntense">Box that fades</Text>
          </Box>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <Heading>Heading that fades</Heading>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <ChipGroup selectionType="multiple" label="ChipGroup that fades">
            {['Public', 'Small Business', 'Large Organization'].map((chipValue: string) => (
              <Chip key={chipValue} value={chipValue}>
                {chipValue}
              </Chip>
            ))}
          </ChipGroup>
        </Fade>

        <Fade {...args} isVisible={isVisible}>
          <p>Fade with custom components. Ensure you forward refs to your custom components</p>
        </Fade>
      </Box>
    </Box>
  );
};

export const FadeWhenInView = (args: typeof Fade): React.ReactElement => {
  return (
    <Box minHeight="350px">
      <Box height="700px" width="100%">
        <Text>Scroll down</Text>
      </Box>
      <Fade {...args}>
        <InternalCardExample />
      </Fade>
    </Box>
  );
};

FadeWhenInView.args = {
  motionTriggers: ['inView'],
};

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

const OnboardingRoute = ({
  match,
}: {
  match: {
    params: {
      id: string;
    };
  };
}) => (
  <Fade>
    <Text weight="semibold" marginY="spacing.4">
      React Router param: {match.params.id}
    </Text>
  </Fade>
);

const ReactRouterExample = (): React.ReactElement => {
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
        <StepGroup width="100%">
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
        <AnimatePresence mode="wait">
          <Switch location={location} key={location.pathname}>
            <Route path="/onboarding/:id" component={OnboardingRoute} />
          </Switch>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export const OnRouteChange: StoryFn<(props: typeof Fade) => React.ReactElement> = (props) => {
  return <ReactRouterExample />;
};

export const WithRef = (args: typeof Fade): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(true);

  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Fade
      </Button>
      <Fade {...args} isVisible={isVisible}>
        <TextInput
          ref={inputRef}
          label="My Text Input"
          helpText="This is an example to showcase how you can continue to use ref like you normally do
            inside Fade as well"
        />
      </Fade>
    </Box>
  );
};
