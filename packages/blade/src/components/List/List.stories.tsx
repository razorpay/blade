import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { ListProps } from './List';
import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemText } from './ListItemText';
import { ListItemLink } from './ListItemLink';
import { ListItemCode } from './ListItemCode';
import { Heading } from '~components/Typography';
import { BookmarkIcon } from '~components/Icons';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { capitalize } from '~utils/lodashButBetter/capitalize';

const listSizes: NonNullable<ListProps['size']>[] = ['small', 'medium', 'large'];

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="List displays a set of related items that are composed of text/links."
      componentName="List"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74881-74522&t=8BTDBesZFpcSIj8v-1&scaling=min-zoom&page-id=22049%3A455845&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { List, ListItem } from '@razorpay/blade/components';

          function App() {
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
    size: 'large',
    variant: 'unordered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      name: 'icon',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ListProps>;

const ListTemplate: StoryFn<typeof List> = ({ ...args }) => {
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

const ListMixNestedTemplate: StoryFn<typeof List> = () => {
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

const ListWithSizesTemplate: StoryFn<typeof List> = ({ ...args }) => {
  return (
    <BaseBox>
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{capitalize(size)} Size:</Heading>
          <List {...args} size={size}>
            <ListItem>
              Level 1
              <List {...args} size={size}>
                <ListItem>
                  Level 2
                  <List {...args} size={size}>
                    <ListItem>Level 3</ListItem>
                  </List>
                </ListItem>
              </List>
            </ListItem>
          </List>
        </BaseBox>
      ))}
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

const OrderedFilledListWithSizesTemplate: StoryFn<typeof List> = () => {
  return (
    <BaseBox>
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{capitalize(size)} Size:</Heading>
          <List variant="ordered-filled" size={size}>
            <ListItem>
              <ListItemLink>Build Integration:</ListItemLink> Use the sample codes to integrate the
              Razorpay Web Standard Checkout on your website.
            </ListItem>
            <ListItem>
              <ListItemLink>Test Integration:</ListItemLink> Test the integration to ensure it was
              successful.
            </ListItem>
            <ListItem>
              <ListItemLink>Go-live Checklist:</ListItemLink> Check the go-live checklist before
              taking the integration live.
            </ListItem>
          </List>
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const OrderedFilledListWithSizes = OrderedFilledListWithSizesTemplate.bind({});
OrderedFilledListWithSizes.storyName = 'OrderedFilled - Sizes';

const ListWithLinkAndIconTemplate: StoryFn<typeof List> = () => {
  return (
    <List variant="unordered" icon={BookmarkIcon} iconColor="interactive.icon.staticWhite.subtle">
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

const ListWithCodeTemplate: StoryFn<typeof List> = () => {
  return (
    <BaseBox>
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{capitalize(size)} Size:</Heading>
          <List variant="ordered" size={size}>
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
      ))}
    </BaseBox>
  );
};
export const ListWithCodeAndIcon = ListWithCodeTemplate.bind({});
ListWithCodeAndIcon.storyName = 'With Inline Code';

const ListWithListItemTextTemplate: StoryFn<typeof List> = () => {
  return (
    <BaseBox>
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{capitalize(size)} Size:</Heading>
          <List variant="ordered" size={size}>
            <ListItem>
              <ListItemText>
                You will receive an invoice after a
                <ListItemText as="span" weight="semibold" color="feedback.text.positive.intense">
                  {' successful '}
                </ListItemText>
                payment
              </ListItemText>
            </ListItem>
            <ListItem>
              You will receive a mail with further instruction after a
              <ListItemText as="span" weight="semibold" color="feedback.text.negative.intense">
                {' failed '}
              </ListItemText>{' '}
              payment
            </ListItem>
          </List>
        </BaseBox>
      ))}
    </BaseBox>
  );
};
export const ListWithListItemText = ListWithListItemTextTemplate.bind({});
ListWithListItemText.storyName = 'With ListItemText';
