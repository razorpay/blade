import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { DividerProps } from './Divider';
import { Divider as DividerComponent } from './Divider';
import { Heading } from '~components/Typography/Heading';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Text } from '~components/Typography/Text';

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
        import { Divider, Box } from '@razorpay/blade/components';
        
        function App(): JSX.Element {
          return (
            <Box display="flex">
              <Divider />
            </Box>
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
    <BaseBox height="100px" display="flex">
      <DividerComponent {...args} />
    </BaseBox>
  );
};

export const Divider = DividerDefaultTemplate.bind({});
Divider.storyName = 'Default';

const DividerHorizontalTemplate: ComponentStory<typeof DividerComponent> = () => {
  return (
    <BaseBox display="flex">
      <DividerComponent />
    </BaseBox>
  );
};

export const DividerHorizontal: ComponentStory<
  typeof DividerComponent
> = DividerHorizontalTemplate.bind({});
DividerHorizontal.storyName = 'Horizontal';

const DividerVerticalTemplate: ComponentStory<typeof DividerComponent> = () => {
  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
      height="100px"
    >
      <DividerComponent orientation="vertical" />
    </BaseBox>
  );
};

export const DividerVertical: ComponentStory<
  typeof DividerComponent
> = DividerVerticalTemplate.bind({});
DividerVertical.storyName = 'Vertical';

const DividerWithTextTemplate: ComponentStory<typeof DividerComponent> = () => {
  return (
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
  );
};

export const DividerWithText: ComponentStory<
  typeof DividerComponent
> = DividerWithTextTemplate.bind({});
DividerWithText.storyName = 'Divider with Text columns';
