import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { TextProps } from './';
import { Text as TextComponent } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Text component is used to display main content of the page. It is often clubbed with Title or Heading to display content in a hierarchical structure. It applies responsive styles automatically based on the device it is being rendered on."
      componentName="Text"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Typography/_decisions/decisions.md"
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=11770%3A147139"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Text } from '@razorpay/blade/components';

          function App(): React.ReactElement {
            return (
              <Text>Lorem Ipsum</Text>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const TextStoryMeta: Meta<TextProps<{ variant: 'body' | 'caption' }>> = {
  title: 'Components/Typography/Text',
  component: TextComponent,
  args: {
    variant: 'body',
    weight: 'regular',
    size: 'medium',
    type: 'normal',
    children:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc',
    truncateAfterLines: 3,
    contrast: 'low',
    as: undefined,
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
  argTypes: getStyledPropsArgTypes(),
};

const TextTemplate: ComponentStory<typeof TextComponent> = (args) => {
  return <TextComponent {...args}>{args.children}</TextComponent>;
};

export default TextStoryMeta;
export const Text = TextTemplate.bind({});
export const WithColor = TextTemplate.bind({});
WithColor.args = {
  color: 'feedback.positive.action.text.primary.default.lowContrast',
};

const AsPropTemplate: ComponentStory<typeof TextComponent> = (args) => {
  return (
    <TextComponent {...args} as="p">
      Power your{' '}
      <TextComponent {...args} color="brand.primary.500" as="span" weight="bold">
        finance
      </TextComponent>
      , grow your{' '}
      <TextComponent {...args} as="span" weight="bold">
        business
      </TextComponent>
    </TextComponent>
  );
};

export const AsProp = AsPropTemplate.bind({});
AsProp.args = {
  truncateAfterLines: undefined,
};
