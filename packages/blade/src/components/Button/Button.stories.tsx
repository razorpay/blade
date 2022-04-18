import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Button from './Button';

const ButtonMeta: ComponentMeta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Hello world',
  },
};
export default ButtonMeta;

const Basic: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Basic.bind({});
Primary.args = { text: 'Button' };
