import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
  Description,
} from '@storybook/addon-docs';
import iconMap from '../../Icons/iconMap';
import type { BaseButtonProps } from './BaseButton';
import BaseButtonComponent from './BaseButton';

export default {
  title: 'Components/Button/BaseButton (Internal)',
  component: BaseButtonComponent,
  args: {
    children: 'Pay Now',
    onClick: (): void => {
      console.log('clicked');
    },
  },
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
    },
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
          <Description
            markdown="
             >For demonstration purposes, we have created a dropdown of icons to choose from in the `icon` prop. The `icon` prop expects the actual Icon component of type `IconComponent` to be passed. 
             "
          />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BaseButtonProps>;

const BaseButtonTemplate: ComponentStory<typeof BaseButtonComponent> = ({
  icon,
  children,
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return (
    <BaseButtonComponent icon={IconComponent} {...args}>
      {children}
    </BaseButtonComponent>
  );
};

export const BaseButton = BaseButtonTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseButton.storyName = 'BaseButton';
