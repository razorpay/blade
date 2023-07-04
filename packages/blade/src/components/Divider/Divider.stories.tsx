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

const paragraph = (
  <BaseBox width="32%">
    <Text margin="spacing.4">
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
      Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur cursus
    </Text>
  </BaseBox>
);

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
          
          function App(): JSX.Element {
            const paragraph = (
              <Text marginTop="spacing.2">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              </Text>
            );
          
            return (
              <Card>
                <CardBody>
                  <Box display="flex" flexDirection="column">
                    <Heading marginBottom="spacing.2">Lorem Epsum</Heading>
                    <Divider />
                    <Box display="flex" gap="spacing.4" flexDirection="row">
                      {paragraph}
                      <Divider orientation="vertical" />
                      {paragraph}
                      <Divider orientation="vertical" />
                      {paragraph}
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
          <Text margin="spacing.4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fringilla lacus a
            neque placerat ullamcorper
          </Text>
          <DividerComponent {...args} />
          <Text margin="spacing.4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fringilla lacus a
            neque placerat ullamcorper
          </Text>
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
          <Button variant="secondary" marginRight="spacing.4" isFullWidth>
            Sign up
          </Button>
          <DividerComponent orientation="vertical" />
          <Button variant="primary" marginLeft="spacing.4" isFullWidth>
            Login
          </Button>
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
          <Heading marginBottom="spacing.4">Lorem Epsum</Heading>
          <DividerComponent />
          <BaseBox display="flex" gap="spacing.6" flexDirection="row">
            {paragraph}
            <DividerComponent orientation="vertical" />
            {paragraph}
            <DividerComponent orientation="vertical" />
            {paragraph}
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
