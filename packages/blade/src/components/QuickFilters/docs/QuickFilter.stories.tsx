import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
//TODO: change this
import { QuickFilterGroup } from '../QuickFilterGroup/QuickFilterGroup';
import type { QuickFilterGroupProps } from '../types';
import { QuickFilter } from '../QuickFilter';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Counter } from '~components/Counter';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="QuickFilterGroup"
      componentDescription="A Chat Message is a visual representation of a message in a chat application."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { QuickFilterGroup } from '@razorpay/blade/components';
        
        function App() {
          return (
            <QuickFilterGroup > Hi, from ray! </QuickFilterGroup>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/QuickFilters',
  component: QuickFilterGroup,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<QuickFilterGroupProps>;

const QuickFilterTemplate: StoryFn<typeof QuickFilterGroup> = (args) => {
  return <div> yo yo</div>;
};

export const Default = QuickFilterTemplate.bind({});
Default.storyName = 'Default';
Default.args = {};

const QuickFilterTemplate1: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup selectionType="single">
      {' '}
      <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />{' '}
      <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />{' '}
    </QuickFilterGroup>
  );
};

export const Default1 = QuickFilterTemplate1.bind({});
Default1.storyName = 'Default1';

const QuickFilterTemplate2: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup selectionType="multiple">
      {' '}
      <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />{' '}
      <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />{' '}
    </QuickFilterGroup>
  );
};

export const Default2 = QuickFilterTemplate2.bind({});
Default1.storyName = 'Default2';
