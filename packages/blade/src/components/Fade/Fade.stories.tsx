import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
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
import { StepperRouterExample } from '~components/BaseMotion/docs/StepperRouterExample';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Fade"
      componentDescription="The Fade component is a motion preset that animates the opacity of its children, allowing them to smoothly appear or disappear. It ensures seamless transitions while keeping the UI visually engaging."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Badge, InfoIcon, Fade } from '@razorpay/blade/components';
        
        function App(): React.ReactElement {
          return (
            <Fade>
              <Badge color="neutral" icon={InfoIcon}>
                Boop
              </Badge>
            </Fade>
          )
        }

        export default App;
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

export const OnRouteChange: StoryFn<(props: typeof Fade) => React.ReactElement> = (props) => {
  return <StepperRouterExample routeComponent={OnboardingRoute} />;
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
