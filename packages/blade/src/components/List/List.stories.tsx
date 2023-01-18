import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { ListProps } from './List';
import { List } from './List';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="This is the List component"
      componentName="List"
      figmaURL={{
        paymentTheme: '',
        bankingTheme: '',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { List } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <List>
              </List>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/List',
  component: List,
  args: {},
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ListProps>;

const ListTemplate: ComponentStory<typeof List> = () => {
  return (
    <List variant="unordered">
      <List.ListItem>
        Item 1
        <List variant="unordered">
          <List.ListItem>
            Item 1.1
            <List variant="unordered">
              <List.ListItem>Item 1.1.1</List.ListItem>
            </List>
          </List.ListItem>
        </List>
      </List.ListItem>
      <List.ListItem>Item 2</List.ListItem>
      <List.ListItem>Item 3</List.ListItem>
    </List>
  );
};

export const Default = ListTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
Default.args = {};
