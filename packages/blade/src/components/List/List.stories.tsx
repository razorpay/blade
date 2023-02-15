import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { BookmarkIcon } from '../Icons';
import { Heading } from '../Typography';
import type { ListProps } from './List';
import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemLink } from './ListItemLink';
import { ListItemCode } from './ListItemCode';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="List displays a set of related items that are composed of text/links."
      componentName="List"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=23205%3A446859&t=itEw2V8u5Q0PPGJq-4',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=13864%3A436458&t=nNhw3mY86j85bYfl-4',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { List, ListItem } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <List>
                <ListItem>
                  Level 1
                  <List>
                    <ListItem>
                      Level 2
                      <List>
                        <ListItem>
                          Level 3
                        </ListItem>
                      </List>
                    </ListItem>
                  </List>
                </ListItem>
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
        Debit Card
        <List variant="unordered" {...args}>
          <ListItem>
            HDFC
            <List variant="unordered" {...args}>
              <ListItem>Domestic</ListItem>
              <ListItem>International</ListItem>
            </List>
          </ListItem>
        </List>
      </ListItem>
      <ListItem>
        Credit Card
        <List variant="unordered" {...args}>
          <ListItem>
            ICICI
            <List variant="unordered" {...args}>
              <ListItem>Domestic</ListItem>
              <ListItem>International</ListItem>
            </List>
          </ListItem>
        </List>
      </ListItem>
      <ListItem>
        Netbanking
        <List variant="unordered" {...args}>
          <ListItem>HDFC</ListItem>
          <ListItem>ICICI</ListItem>
        </List>
      </ListItem>
    </List>
  );
};

export const Default = ListTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
Default.args = {};

const ListMixNestedTemplate: ComponentStory<typeof List> = () => {
  return (
    <List variant="ordered">
      <ListItem>
        Debit Card
        <List variant="unordered">
          <ListItem>
            HDFC
            <List variant="ordered">
              <ListItem>Domestic</ListItem>
              <ListItem>International</ListItem>
            </List>
          </ListItem>
        </List>
      </ListItem>
      <ListItem>
        Credit Card
        <List variant="unordered">
          <ListItem>
            ICICI
            <List variant="ordered">
              <ListItem>Domestic</ListItem>
              <ListItem>International</ListItem>
            </List>
          </ListItem>
        </List>
      </ListItem>
      <ListItem>
        Netbanking
        <List variant="unordered">
          <ListItem>HDFC</ListItem>
          <ListItem>ICICI</ListItem>
        </List>
      </ListItem>
    </List>
  );
};

export const ListMixNested = ListMixNestedTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
ListMixNested.storyName = 'Unordered & Ordered Mix';

const ListWithSizesTemplate: ComponentStory<typeof List> = ({ ...args }) => {
  return (
    <BaseBox>
      <Heading>Small Size:</Heading>
      <List {...args} size="small">
        <ListItem>
          Level 1
          <List {...args} size="small">
            <ListItem>
              Level 2
              <List {...args} size="small">
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>
      <Heading>Medium Size:</Heading>
      <List {...args} size="medium">
        <ListItem>
          Level 1
          <List {...args} size="medium">
            <ListItem>
              Level 2
              <List {...args} size="medium">
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>
    </BaseBox>
  );
};

export const UnorderedListWithSizes = ListWithSizesTemplate.bind({});
UnorderedListWithSizes.storyName = 'Unordered - Sizes';
UnorderedListWithSizes.parameters = {
  controls: {
    disable: true,
  },
};
UnorderedListWithSizes.args = {
  variant: 'unordered',
};

export const OrderedListWithSizes = ListWithSizesTemplate.bind({});
OrderedListWithSizes.storyName = 'Ordered - Sizes';
OrderedListWithSizes.parameters = {
  controls: {
    disable: true,
  },
};
OrderedListWithSizes.args = {
  variant: 'ordered',
};

const OrderedFilledListWithSizesTemplate: ComponentStory<typeof List> = () => {
  return (
    <BaseBox>
      <Heading>Small Size:</Heading>
      <List variant="ordered-filled" size="small">
        <ListItem>
          <ListItemLink>Build Integration:</ListItemLink> Use the sample codes to integrate the
          Razorpay Web Standard Checkout on your website.
        </ListItem>
        <ListItem>
          <ListItemLink>Test Integration:</ListItemLink> Test the integration to ensure it was
          successful.
        </ListItem>
        <ListItem>
          <ListItemLink>Go-live Checklist:</ListItemLink> Check the go-live checklist before taking
          the integration live.
        </ListItem>
      </List>
      <Heading>Medium Size:</Heading>
      <List variant="ordered-filled" size="medium">
        <ListItem>
          <ListItemLink>Build Integration:</ListItemLink> Use the sample codes to integrate the
          Razorpay Web Standard Checkout on your website.
        </ListItem>
        <ListItem>
          <ListItemLink>Test Integration:</ListItemLink> Test the integration to ensure it was
          successful.
        </ListItem>
        <ListItem>
          <ListItemLink>Go-live Checklist:</ListItemLink> Check the go-live checklist before taking
          the integration live.
        </ListItem>
      </List>
    </BaseBox>
  );
};

export const OrderedFilledListWithSizes = OrderedFilledListWithSizesTemplate.bind({});
OrderedFilledListWithSizes.storyName = 'OrderedFilled - Sizes';

const ListWithLinkAndIconTemplate: ComponentStory<typeof List> = () => {
  return (
    <List variant="unordered" icon={BookmarkIcon}>
      <ListItem>
        <ListItemLink>Troubleshooting and FAQs</ListItemLink>
      </ListItem>
      <ListItem>
        <ListItemLink>Payment Methods</ListItemLink>
      </ListItem>
      <ListItem>
        <ListItemLink>International Currency Support</ListItemLink>
      </ListItem>
      <ListItem>
        <ListItemLink>Bank Downtime</ListItemLink>
      </ListItem>
    </List>
  );
};

export const ListWithLinkAndIcon = ListWithLinkAndIconTemplate.bind({});
ListWithLinkAndIcon.storyName = 'Link & Icon';

const ListWithCodeTemplate: ComponentStory<typeof List> = () => {
  return (
    <BaseBox>
      <Heading>Small Size:</Heading>
      <List variant="ordered" size="small">
        <ListItem>
          Bump blade version to <ListItemCode>v6.0.0</ListItemCode>
        </ListItem>
        <ListItem>
          Run <ListItemCode>yarn install</ListItemCode>
        </ListItem>

        <ListItem>
          Run <ListItemCode>yarn start</ListItemCode>
        </ListItem>
      </List>
      <Heading>Medium Size:</Heading>
      <List variant="ordered" size="medium">
        <ListItem>
          Bump blade version to <ListItemCode>v6.0.0</ListItemCode>
        </ListItem>
        <ListItem>
          Run <ListItemCode>yarn install</ListItemCode>
        </ListItem>

        <ListItem>
          Run <ListItemCode>yarn start</ListItemCode>
        </ListItem>
      </List>
    </BaseBox>
  );
};
export const ListWithCodeAndIcon = ListWithCodeTemplate.bind({});
ListWithCodeAndIcon.storyName = 'With Inline Code';
