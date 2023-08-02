import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
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
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=608-883166&mode=design&t=6uRroMDHC66zlvxT-0',
        bankingTheme:
          'https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=608-883166&mode=design&t=6uRroMDHC66zlvxT-0',
      }}
      componentName="Divider"
      componentDescription="Divider is a visual element that is used to separate or divide content within a layout"
    >
      <Title>Usage</Title>
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
          
          function App(): React.ReactElement {
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
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<DividerProps>;

const DividerDefaultTemplate: ComponentStory<typeof DividerComponent> = (args) => {
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

const DividerHorizontalTemplate: ComponentStory<typeof DividerComponent> = () => {
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

export const DividerHorizontal: ComponentStory<
  typeof DividerComponent
> = DividerHorizontalTemplate.bind({});
DividerHorizontal.storyName = 'Horizontal';

const DividerVerticalTemplate: ComponentStory<typeof DividerComponent> = () => {
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

export const DividerVertical: ComponentStory<
  typeof DividerComponent
> = DividerVerticalTemplate.bind({});
DividerVertical.storyName = 'Vertical';

const DividerWithTextTemplate: ComponentStory<typeof DividerComponent> = () => {
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

export const DividerWithText: ComponentStory<
  typeof DividerComponent
> = DividerWithTextTemplate.bind({});
DividerWithText.storyName = 'Divider with Text columns';
