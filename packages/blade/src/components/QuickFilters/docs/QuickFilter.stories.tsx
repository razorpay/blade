import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { QuickFilterGroup } from '../QuickFilterGroup';
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
      componentName="QuickFilter"
      componentDescription="QuickFilter & QuickFilterGroups can be used to show a list of filters that can be selected by the user."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { QuickFilterGroup,QuickFilter  } from '@razorpay/blade/components';
        
        function App() {
          return (
            <QuickFilterGroup >
             <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />{' '}
             <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />{' '}
           </QuickFilterGroup>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/QuickFilter & QuickFilterGroup',
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
  return (
    <QuickFilterGroup {...args}>
      <QuickFilter
        title="All"
        value="All"
        trailingElement={<Counter value={400} color="information" />}
      />
      <QuickFilter
        title="Captured"
        value="Captured"
        trailingElement={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="Failed"
        value="Failed"
        trailingElement={<Counter value={234} color="negative" />}
      />
    </QuickFilterGroup>
  );
};

export const Default = QuickFilterTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  selectionType: 'single',
};

const QuickFilterSingle: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup selectionType="single">
      <QuickFilter
        title="Unresolved"
        value="unresolved"
        trailingElement={<Counter value={234} color="information" />}
      />
      <QuickFilter
        title="Resolved"
        value="resolved"
        trailingElement={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="In Progress"
        value="in_progress"
        trailingElement={<Counter value={234} color="neutral" />}
      />
    </QuickFilterGroup>
  );
};

export const QuickFilterSingleStory = QuickFilterSingle.bind({});
QuickFilterSingleStory.storyName = 'QuickFilter Single Selection';

const QuickFilterMultiple: StoryFn<typeof QuickFilterGroup> = () => {
  return (
    <QuickFilterGroup selectionType="multiple">
      <QuickFilter
        title="Captured"
        value="Captured"
        trailingElement={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="Failed"
        value="Failed"
        trailingElement={<Counter value={234} color="negative" />}
      />
      <QuickFilter
        title="Pending"
        value="Pending"
        trailingElement={<Counter value={234} color="neutral" />}
      />
    </QuickFilterGroup>
  );
};

export const QuickFilterMultipleStory = QuickFilterMultiple.bind({});
QuickFilterMultipleStory.storyName = 'QuickFilter Multiple Selection';
