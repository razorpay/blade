import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { ListProps } from './List';
import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemLink } from './ListItemLink';
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
  args: {
    size: 'medium',
    variant: 'unordered',
  },
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

const ListTemplate: ComponentStory<typeof List> = ({ ...args }) => {
  return (
    <List variant="unordered" {...args}>
      <ListItem>
        Item 1 <ListItemLink href="https://github.com/razorpay/blade">Click here</ListItemLink>
        <List variant="unordered" {...args}>
          <ListItem>
            Item 1.1
            <List variant="unordered" {...args}>
              <ListItem>Item 1.1.1</ListItem>
            </List>
          </ListItem>
        </List>
      </ListItem>
      <ListItem>
        Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item 2Item
        2Item 2Item 2
      </ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
    </List>
  );
};

export const Default = ListTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
Default.args = {};
