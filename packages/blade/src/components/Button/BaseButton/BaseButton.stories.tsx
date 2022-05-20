import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { BaseButtonProps } from './BaseButton';
import BaseButtonComponent from './BaseButton';

export default {
  title: 'Components/Button/BaseButton (Internal)',
  component: BaseButtonComponent,
  args: {
    children: 'Pay Now',
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            This is the BaseButton component. It is only for internal Blade usage.
          </Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BaseButtonProps>;

const BaseButtonTemplate: ComponentStory<typeof BaseButtonComponent> = (args) => {
  return <BaseButtonComponent {...args}>{args.children}</BaseButtonComponent>;
};

export const BaseButton = BaseButtonTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseButton.storyName = 'BaseButton';
