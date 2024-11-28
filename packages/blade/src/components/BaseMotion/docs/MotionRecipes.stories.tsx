import React from 'react';
import type { StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryRouter from 'storybook-react-router';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Code, Text } from '~components/Typography';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { DashboardWithRoutingExample } from './MotionDashboardComponents';
import { Move } from '~components/Move';

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
  title: 'Motion/Recipes',
  tags: ['autodocs'],
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/app/home'] })] as unknown,
  args: {
    motionTriggers: ['mount'],
    type: 'inout',
    shouldUnmountWhenHidden: false,
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const DashboardRoute = ({
  match,
}: {
  match: {
    params: {
      id: string;
    };
  };
}) => {
  return (
    <Move>
      <Card width="100%">
        <CardHeader>
          <CardHeaderLeading title={`Current Route is ${match.params.id}`} />
        </CardHeader>
        <CardBody>
          <Text marginTop="spacing.4">
            This is an example of <Code size="medium">Move</Code> component used for Page
            Transition.
          </Text>
        </CardBody>
      </Card>
    </Move>
  );
};

export const OnRouteChange: StoryFn<() => React.ReactElement> = (props) => {
  return <DashboardWithRoutingExample routeComponent={DashboardRoute} />;
};
