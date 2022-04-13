import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BaseText from './BaseText';

const TextMeta: ComponentMeta<typeof BaseText> = {
  title: 'Components/Text',
  component: BaseText,
  // argTypes: {
  //   onPress: { action: 'pressed the button' },
  // },
  args: {
    color: 'feedback.text.positive.lowContrast',
    fontFamily: 'text',
    fontSize: 100,
    fontWeight: 'regular',
    fontStyle: 'normal',
    textDecorationLine: 'none',
    lineHeight: 'm',
    as: 'p',
    name: 'Storybook',
    children: 'Hello world',
  },
};

export default TextMeta;

const Text: ComponentStory<typeof BaseText> = (args) => {
  return <BaseText {...args}>{args.children}</BaseText>;
};

export const BaseTextStory = Text.bind({});
// Primary.args = { text: 'Button' };
