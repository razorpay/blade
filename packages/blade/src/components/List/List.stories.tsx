import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import capitalize from 'lodash/capitalize';
import type { ReactElement } from 'react';
import { BookmarkIcon } from '../Icons';
import { Heading } from '../Typography';
import type { ListProps } from './List';
import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemText } from './ListItemText';
import { ListItemLink } from './ListItemLink';
import { ListItemCode } from './ListItemCode';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import BaseBox from '~components/Box/BaseBox';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const listSizes: NonNullable<ListProps['size']>[] = ['small', 'medium', 'large'];

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

          function App(): React.ReactElement {
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
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{`${capitalize(size)} Size:`}</Heading>
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

const OrderedFilledListWithSizesTemplate: ComponentStory<typeof List> = () => {
  return (
    <BaseBox>
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{`${capitalize(size)} Size:`}</Heading>
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
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{`${capitalize(size)} Size:`}</Heading>
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

const ListWithListItemTextTemplate: ComponentStory<typeof List> = () => {
  return (
    <BaseBox>
      {listSizes.map((size) => (
        <BaseBox key={size}>
          <Heading>{`${capitalize(size)} Size:`}</Heading>
          <List variant="ordered" size={size}>
            <ListItem>
              <ListItemText>
                You will receive an invoice after a
                <ListItemText as="span" weight="bold" color="feedback.text.positive.lowContrast">
                  {' successful '}
                </ListItemText>
                payment
              </ListItemText>
            </ListItem>
            <ListItem>
              You will receive a mail with further instruction after a
              <ListItemText as="span" weight="bold" color="feedback.text.negative.lowContrast">
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
