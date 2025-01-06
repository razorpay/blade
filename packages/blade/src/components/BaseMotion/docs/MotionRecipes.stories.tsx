import React from 'react';
import type { StoryFn } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { DashboardWithRoutingExample } from './MotionDashboardComponents';
import { Code, Text } from '~components/Typography';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Move } from '~components/Move';

export default {
  title: 'Motion/Recipes',
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
      page: null,
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
}): React.ReactElement => {
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

export const DashboardMotionRecipe: StoryFn<() => React.ReactElement> = () => {
  return <DashboardWithRoutingExample routeComponent={DashboardRoute} />;
};
