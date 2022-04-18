import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BaseText from './BaseText';

const TextMeta: ComponentMeta<typeof BaseText> = {
  title: 'Components/Typography',
  component: BaseText,
  args: {
    color: 'surface.text.normal.lowContrast',
    fontFamily: 'text',
    fontSize: 1000,
    fontWeight: 'regular',
    fontStyle: 'normal',
    textDecorationLine: 'none',
    lineHeight: 'm',
    // as: 'Text',
    name: 'Storybook',
    children: 'Base Text',
  },
};

export default TextMeta;

const Text: ComponentStory<typeof BaseText> = (args) => {
  return <BaseText {...args}>{args.children}</BaseText>;
};

export const BaseTextStory = Text.bind({});
