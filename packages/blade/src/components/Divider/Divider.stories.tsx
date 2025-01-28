import type { StoryFn, Meta } from '@storybook/react';
import type { DividerProps } from './Divider';
import { Divider as DividerComponent } from './Divider';
import { Heading } from '~components/Typography/Heading';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Text } from '~components/Typography/Text';
import { Card, CardBody } from '~components/Card';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { List, ListItem } from '~components/List';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Divider"
      componentDescription="Divider is a visual element that is used to separate or divide content within a layout"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-84931&t=L3B7EoN3ZA9RuSPa-1&scaling=min-zoom&page-id=37369%3A560819&mode=design"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox>
        {`
          import {
            Divider,
            Box,
            Heading,
            Text,
            Card,
            CardBody
          } from "@razorpay/blade/components";
          
          function App() {
            return (
              <Card>
                <CardBody>
                  <Box display="flex" flexDirection="column">
                    <Heading marginBottom="spacing.2">Explore multiple payment options</Heading>
                    <Divider />
                    <Box display="flex" gap="spacing.4" flexDirection="row">
                      <Text marginTop="spacing.2">
                      Accept payments with a custom-branded online store using Payment Pages.
                      </Text>
                    <Divider orientation="vertical" />
                      <Text marginTop="spacing.2">
                      Create payment links which can be shared via an email, SMS, messenger, chatbot etc.
                      </Text>
                      <Divider orientation="vertical" />
                      <Text marginTop="spacing.2">
                      Accept one time and subscription payments using payment button on your website in less than 5 minutes.
                      </Text>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            );
          }
          export default App;          
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Divider',
  component: DividerComponent,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<DividerProps>;

const DividerDefaultTemplate: StoryFn<typeof DividerComponent> = (args) => {
  return (
    <Card>
      <CardBody>
        <BaseBox display="flex" flexDirection={args.orientation == 'vertical' ? 'row' : 'column'}>
          <Heading margin="spacing.4">Payment Links</Heading>
          <DividerComponent {...args} />
          <Box margin="spacing.4">
            <Text>Share payment link via:</Text>
            <List>
              <ListItem>Email</ListItem>
              <ListItem>SMS</ListItem>
              <ListItem>Messenger</ListItem>
            </List>
          </Box>
        </BaseBox>
      </CardBody>
    </Card>
  );
};

export const Divider = DividerDefaultTemplate.bind({});
Divider.storyName = 'Default';

const DividerHorizontalTemplate: StoryFn<typeof DividerComponent> = () => {
  return (
    <Card>
      <CardBody>
        <Heading marginBottom="spacing.2">Payment Links</Heading>
        <DividerComponent />
        <Text marginTop="spacing.3">
          Share payment link via an email, SMS, messenger, chatbot etc. and get paid immediately.
          Accepting payments from customers is now just a link away.
        </Text>
      </CardBody>
    </Card>
  );
};

export const DividerHorizontal: StoryFn<typeof DividerComponent> = DividerHorizontalTemplate.bind(
  {},
);
DividerHorizontal.storyName = 'Horizontal';

const DividerVerticalTemplate: StoryFn<typeof DividerComponent> = () => {
  return (
    <Card>
      <CardBody>
        <BaseBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="row"
          height="50px"
        >
          <BaseBox display="flex" flex={1}>
            <Button variant="secondary" marginRight="spacing.4" isFullWidth>
              Sign up
            </Button>
          </BaseBox>
          <DividerComponent orientation="vertical" />
          <BaseBox display="flex" flex={1}>
            <Button variant="primary" marginLeft="spacing.4" isFullWidth>
              Login
            </Button>
          </BaseBox>
        </BaseBox>
      </CardBody>
    </Card>
  );
};

export const DividerVertical: StoryFn<typeof DividerComponent> = DividerVerticalTemplate.bind({});
DividerVertical.storyName = 'Vertical';

const DividerWithTextTemplate: StoryFn<typeof DividerComponent> = () => {
  return (
    <Card>
      <CardBody>
        <BaseBox display="flex" flexDirection="column">
          <Heading marginBottom="spacing.4">Explore multiple payment options</Heading>
          <DividerComponent />
          <BaseBox display="flex" gap="spacing.6" flexDirection="row">
            <BaseBox width="30%">
              <Text margin="spacing.4">
                Accept payments with a custom-branded online store using Payment Pages. Accept
                international and domestic payments with automated payment receipts. Take your store
                online instantly with zero coding.
              </Text>
            </BaseBox>
            <DividerComponent orientation="vertical" />
            <BaseBox width="30%">
              <Text margin="spacing.4">
                Create payment links which can be shared via an email, SMS, messenger, chatbot etc.
                and get paid immediately. Accepting payments from customers is now just a link away.
              </Text>
            </BaseBox>
            <DividerComponent orientation="vertical" />
            <BaseBox width="30%">
              <Text margin="spacing.4">
                Accept one time and subscription payments on your website in less than 5 minutes.
                Thousands of NGOs, SMEs, and freelancers are collecting payments by adding a payment
                button to their website on their own.
              </Text>
            </BaseBox>
          </BaseBox>
        </BaseBox>
      </CardBody>
    </Card>
  );
};

export const DividerWithText: StoryFn<typeof DividerComponent> = DividerWithTextTemplate.bind({});
DividerWithText.storyName = 'Divider with Text columns';
