import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { ListView } from '../ListView';
import { ListViewFilter } from '../ListViewFilters';
import type { ListViewProps } from '../types';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ListView"
      componentDescription="List View is a pattern"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { ListView } from '@razorpay/blade/components';
        
        function App() {
          return (
            <ListView > Hi, from ray! </ListView>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Patterns/ListView',
  component: ListView,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ListViewProps>;

const ChatMessageTemplate: StoryFn<typeof ListView> = (args) => {
  return (
    <ListView>
      <ListViewFilter 
  
      >
         </ListViewFilter>
    </ListView>
  );
};

export const Default = ChatMessageTemplate.bind({});
Default.storyName = 'Default';
// Default.args
