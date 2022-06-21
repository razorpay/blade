import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import iconMap from '../../Icons/iconMap';
import type { ButtonProps } from './Button';
import ButtonComponent from './Button';

export default {
  title: 'Components/Button/Button',
  component: ButtonComponent,
  args: {
    variant: 'primary',
    children: 'Pay Now',
    onClick: (): void => {
      console.log('clicked');
    },
    isDisabled: false,
    size: 'medium',
    iconPosition: 'left',
    isFullWidth: false,
    type: 'button',
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
          <Subtitle>This is the Button component. It is only for internal Blade usage.</Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<ButtonProps>;

const ButtonTemplate: ComponentStory<typeof ButtonComponent> = ({ icon, children, ...args }) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return (
    <ButtonComponent icon={IconComponent} {...args}>
      {children}
    </ButtonComponent>
  );
};

export const Button = ButtonTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Button.storyName = 'Button';
