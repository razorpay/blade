import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import StoryPageWrapper from '../../_helpers/storybook/StoryPageWrapper';
import BaseBox from '../Box/BaseBox';
import { Sandbox } from '../../_helpers/storybook/Sandbox';
import { Divider as DividerComponent } from './Divider';
import type { DividerProps } from './types';

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
        import { Divider } from '@razorpay/blade/components';
        
        function App(): JSX.Element {
          return <Divider />;
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
    <BaseBox height="100px" display="flex" alignItems="center" justifyContent="center">
      <DividerComponent {...args} />
    </BaseBox>
  );
};

export const Divider = DividerDefaultTemplate.bind({});

Divider.storyName = 'Default';

const DividerHorizontalTemplate: ComponentStory<typeof DividerComponent> = () => {
  return (
    <BaseBox>
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
    <BaseBox height="100px" display="flex" alignItems="center" justifyContent="center">
      <DividerComponent orientation="vertical" />
    </BaseBox>
  );
};

export const DividerVertical: ComponentStory<
  typeof DividerComponent
> = DividerVerticalTemplate.bind({});
DividerVertical.storyName = 'Vertical';
